// Reads the SEO signals out of one HTML page.
import { load } from "cheerio";

import type { RetrievedResource } from "@/lib/discover/safe-retrieval";
import type { PageData, SampledPage } from "./types";

const clean = (s: string | undefined | null) => (s ?? "").replace(/\s+/g, " ").trim();
const QUESTION = /\?\s*$|^(how|what|why|when|where|who|which)\s+(is|are|was|do|does|did|can|could|should|will|would|to|much|many|long|makes|happens|if)\b|^(can|do|does|is|are|should|will|could|would)\s+\w+\s+\w+/i;

function collectTypes(node: unknown, out: Set<string>) {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, out));
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") out.add(t);
  else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && out.add(x));
  for (const key of ["@graph", "mainEntity", "itemListElement", "publisher", "author", "brand"]) {
    if (obj[key]) collectTypes(obj[key], out);
  }
}

function headerValue(h: RetrievedResource["headers"], name: string) {
  const v = h[name];
  return Array.isArray(v) ? v.join(", ") : v ?? "";
}

export function parsePage(res: RetrievedResource): PageData {
  const $ = load(res.body);
  const base = new URL(res.url);
  const host = base.hostname.replace(/^www\./, "");

  const types = new Set<string>();
  let schemaErrors = 0;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      collectTypes(JSON.parse($(el).text()), types);
    } catch {
      schemaErrors += 1;
    }
  });

  const headingOrder: number[] = [];
  const questionHeadings: string[] = [];
  $("h1,h2,h3,h4,h5,h6").each((_, el) => {
    headingOrder.push(Number(el.tagName.slice(1)));
    const text = clean($(el).text());
    if (text && QUESTION.test(text) && el.tagName !== "h1") questionHeadings.push(text);
  });
  // FAQ blocks often use <summary>/<dt>/buttons for questions.
  $("summary, dt, [itemprop=name]").each((_, el) => {
    const text = clean($(el).text());
    if (text.length < 140 && QUESTION.test(text)) questionHeadings.push(text);
  });

  const internal = new Set<string>();
  let externalLinks = 0;
  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") ?? "").trim();
    if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
    try {
      const u = new URL(href, base);
      if (!/^https?:$/.test(u.protocol)) return;
      u.hash = "";
      if (u.hostname.replace(/^www\./, "") === host) internal.add(u.toString());
      else externalLinks += 1;
    } catch {}
  });

  const images = $("img");
  let imagesMissingAlt = 0;
  images.each((_, el) => {
    // alt="" is valid for decorative images; only a missing attribute is a problem.
    if ($(el).attr("alt") === undefined) imagesMissingAlt += 1;
  });

  const bodyText = (() => {
    const b = $("body").clone();
    b.find("script,style,noscript,template,svg").remove();
    return clean(b.text());
  })();

  const canonicalHref = $('link[rel="canonical"]').attr("href");
  let canonical: string | null = null;
  if (canonicalHref) {
    try {
      canonical = new URL(canonicalHref, base).toString();
    } catch {
      canonical = canonicalHref;
    }
  }

  return {
    url: res.url,
    status: res.status,
    ms: res.ms,
    bytes: res.bytes,
    title: clean($("head title").first().text() || $("title").first().text()),
    description: clean($('meta[name="description" i]').attr("content")),
    canonical,
    robotsMeta: clean($('meta[name="robots" i]').attr("content")).toLowerCase(),
    xRobots: headerValue(res.headers, "x-robots-tag").toLowerCase(),
    lang: clean($("html").attr("lang")),
    viewport: $('meta[name="viewport" i]').attr("content") ?? null,
    h1s: $("h1").map((_, el) => clean($(el).text())).get(),
    headingOrder,
    questionHeadings: [...new Set(questionHeadings)].slice(0, 30),
    wordCount: bodyText ? bodyText.split(" ").length : 0,
    scriptCount: $("script[src]").length,
    images: images.length,
    imagesMissingAlt,
    internalLinks: [...internal],
    externalLinks,
    og: {
      title: clean($('meta[property="og:title"]').attr("content")),
      description: clean($('meta[property="og:description"]').attr("content")),
      image: clean($('meta[property="og:image"]').attr("content")),
    },
    twitterCard: clean($('meta[name="twitter:card"]').attr("content")),
    schemaTypes: [...types],
    schemaErrors,
    hasEmail: $('a[href^="mailto:"]').length > 0 || /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(bodyText),
    hasPhone: $('a[href^="tel:"]').length > 0 || /\+\d{1,3}[\s-]?\(?\d{2,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}|\b[6-9]\d{4}\s?\d{5}\b/.test(bodyText),
  };
}

export function summarisePage(res: RetrievedResource): SampledPage {
  const p = parsePage(res);
  return {
    url: res.url,
    status: res.status,
    title: p.title,
    description: p.description,
    h1Count: p.h1s.length,
    wordCount: p.wordCount,
    noindex: /noindex/.test(p.robotsMeta + " " + p.xRobots),
    ms: res.ms,
  };
}
