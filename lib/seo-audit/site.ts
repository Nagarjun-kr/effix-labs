// Site-wide checks: robots.txt, sitemap, llms.txt, HTTPS + host redirects, and a sample of inner pages.
import { retrieveSafely } from "@/lib/discover/safe-retrieval";
import { RetrievalPolicyError } from "@/lib/discover/url-policy";
import { parsePage, summarisePage } from "./parse";
import type { SampledPage, SiteFiles } from "./types";

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot"];
const SAMPLE_SIZE = 8;

type RobotsGroup = { agents: string[]; rules: { allow: boolean; path: string }[] };

function parseRobots(text: string) {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "sitemap") {
      if (value) sitemaps.push(value);
      continue;
    }
    if (key === "user-agent") {
      if (!current || !lastWasAgent) groups.push((current = { agents: [], rules: [] }));
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (current && (key === "disallow" || key === "allow")) current.rules.push({ allow: key === "allow", path: value });
  }
  const blocksRoot = (agent: string) => {
    const g = groups.find((x) => x.agents.includes(agent.toLowerCase())) ?? groups.find((x) => x.agents.includes("*"));
    if (!g) return false;
    return g.rules.some((r) => !r.allow && r.path === "/") && !g.rules.some((r) => r.allow && r.path === "/");
  };
  return { sitemaps, blocksAll: blocksRoot("*"), aiBlocked: AI_BOTS.filter(blocksRoot) };
}

const locs = (xml: string) => [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, "&"));

async function readSitemap(candidates: string[]) {
  for (const candidate of candidates) {
    try {
      const res = await retrieveSafely(candidate, "xml", { maxBytes: 3_000_000 });
      if (!/<(urlset|sitemapindex)/i.test(res.body)) continue;
      if (/<sitemapindex/i.test(res.body)) {
        const children = locs(res.body);
        const pick = children.find((c) => /page/i.test(c)) ?? children[0];
        let urls: string[] = [];
        if (pick) {
          try {
            urls = locs((await retrieveSafely(pick, "xml", { maxBytes: 3_000_000 })).body);
          } catch {}
        }
        return { found: true, url: res.url, urls, count: urls.length, children: children.length };
      }
      const urls = locs(res.body);
      return { found: true, url: res.url, urls, count: urls.length, children: 0 };
    } catch {}
  }
  return { found: false, url: null, urls: [] as string[], count: 0, children: 0 };
}

async function finalUrl(url: string) {
  try {
    return new URL((await retrieveSafely(url, "html")).url);
  } catch {
    return null;
  }
}

function statusFromError(error: unknown): { status: number | null; error: string; broken: boolean } {
  if (error instanceof RetrievalPolicyError) {
    const m = error.message.match(/HTTP (\d{3})/);
    if (m) return { status: Number(m[1]), error: `HTTP ${m[1]}`, broken: Number(m[1]) >= 400 };
    const notes: Record<string, [string, boolean]> = {
      response_too_large: ["larger than 1 MB, not analysed", false],
      unsupported_content_type: ["not an HTML page", false],
      timeout: ["timed out", true],
      too_many_redirects: ["too many redirects", true],
      unsafe_dns: ["domain doesn't resolve", true],
    };
    const [note, broken] = notes[error.code] ?? [error.code.replace(/_/g, " "), false];
    return { status: null, error: note, broken };
  }
  return { status: null, error: "could not connect", broken: true };
}

function spread<T>(items: T[], n: number) {
  if (items.length <= n) return items;
  const step = items.length / n;
  return Array.from({ length: n }, (_, i) => items[Math.floor(i * step)]);
}

export async function auditSite(home: URL, internalLinks: string[]): Promise<{ site: SiteFiles; pages: SampledPage[] }> {
  const origin = home.origin;
  const host = home.hostname;
  const variant = host.startsWith("www.") ? host.slice(4) : `www.${host}`;

  const [robotsRes, llms, httpFinal, variantFinal] = await Promise.all([
    retrieveSafely(`${origin}/robots.txt`, "text").catch(() => null),
    retrieveSafely(`${origin}/llms.txt`, "text").then((r) => r.body.trim().length > 20 && !/<html/i.test(r.body)).catch(() => false),
    home.protocol === "https:" ? finalUrl(`http://${host}/`) : Promise.resolve(null),
    retrieveSafely(`${home.protocol}//${variant}/`, "html").catch(() => null),
  ]);

  const robotsText = robotsRes && !/<html/i.test(robotsRes.body) ? robotsRes.body : "";
  const robots = parseRobots(robotsText);
  const sitemap = await readSitemap([...robots.sitemaps, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`]);

  const bare = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const sameHost = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "") === host.replace(/^www\./, "");
    } catch {
      return false;
    }
  };
  const pool = [...new Set((sitemap.urls.length ? sitemap.urls : internalLinks).filter(sameHost))].filter(
    (u) => bare(u) !== bare(home.toString()) && !/\.(pdf|jpe?g|png|webp|gif|svg|zip|xml|txt)(\?|$)/i.test(u),
  );

  const pages = await Promise.all(
    spread(pool, SAMPLE_SIZE).map(async (u): Promise<SampledPage> => {
      const started = Date.now();
      try {
        return summarisePage(await retrieveSafely(u, "html"));
      } catch (error) {
        return { url: u, ...statusFromError(error), title: "", description: "", h1Count: 0, wordCount: 0, noindex: false, ms: Date.now() - started };
      }
    }),
  );

  return {
    site: {
      robots: { found: Boolean(robotsText), blocksAll: robots.blocksAll, sitemaps: robots.sitemaps, aiBlocked: robots.aiBlocked, text: robotsText.slice(0, 4000) },
      sitemap: { found: sitemap.found, url: sitemap.url, urlCount: sitemap.count },
      llmsTxt: Boolean(llms),
      httpsRedirect: httpFinal ? httpFinal.protocol === "https:" : null,
      hostVariantOk: variantFinal ? new URL(variantFinal.url).hostname === host : null,
      hostVariantCanonical: variantFinal && new URL(variantFinal.url).hostname !== host ? parsePage(variantFinal).canonical : null,
      hostVariant: variant,
    },
    pages,
  };
}
