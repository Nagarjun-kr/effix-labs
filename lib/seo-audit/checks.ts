// Turns what we found into pass/fail checks with evidence, fixes and scores.
import type { Category, Check, PageData, SampledPage, SiteFiles, Severity } from "./types";

type Rule = Omit<Check, "category" | "passed" | "severity" | "impact"> & { pass: boolean; severity: Severity; impact: number };

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

function make(category: Category, rules: (Rule | null)[]): Check[] {
  return rules.filter((r): r is Rule => Boolean(r)).map(({ pass, ...r }) => ({ ...r, category, passed: pass }));
}

export function runChecks(page: PageData, site: SiteFiles, pages: SampledPage[]): Check[] {
  const noindex = /noindex/.test(page.robotsMeta + " " + page.xRobots);
  const isHttps = page.url.startsWith("https://");
  const canonicalHost = page.canonical ? safeHost(page.canonical) : null;
  const pageHost = safeHost(page.url);
  const okPages = pages.filter((p) => p.status && p.status < 400 && !p.error);
  const broken = pages.filter((p) => p.broken || (p.status !== null && p.status >= 400));
  const all = [{ title: page.title, description: page.description, url: page.url }, ...okPages];
  const dupTitles = dupes(all.map((p) => p.title));
  const dupDescs = dupes(all.map((p) => p.description));
  const skipped = headingSkips(page.headingOrder);
  const schema = page.schemaTypes;
  const orgSchema = schema.some((t) => /Organization|LocalBusiness|Corporation|ProfessionalService|Store|Restaurant|Person/i.test(t));
  const thinPages = okPages.filter((p) => p.wordCount < 250);
  const jsOnly = page.wordCount < 80 && page.scriptCount >= 3;

  const technical = make("technical", [
    {
      code: "https",
      pass: isHttps && site.httpsRedirect !== false,
      severity: "high",
      impact: 18,
      title: isHttps ? (site.httpsRedirect === false ? "HTTP version doesn't redirect to HTTPS" : "Site uses HTTPS") : "Site isn't served over HTTPS",
      evidence: isHttps ? (site.httpsRedirect === false ? "http:// loads without moving visitors to https://." : site.httpsRedirect ? "https:// in use and http:// redirects to it." : "https:// in use.") : "The page loaded over plain http://.",
      fix: "Install an SSL certificate and add a permanent (301) redirect from http:// to https:// for every URL.",
    },
    {
      code: "indexable",
      pass: !noindex,
      severity: "high",
      impact: 30,
      title: noindex ? "Homepage is set to noindex" : "Homepage can be indexed",
      evidence: noindex ? `Found "noindex" in ${page.robotsMeta.includes("noindex") ? "the robots meta tag" : "the X-Robots-Tag header"}.` : "No noindex tag or header found.",
      fix: "Remove the noindex robots meta tag / X-Robots-Tag header so Google can list this page.",
    },
    {
      code: "robots-blocks",
      pass: !site.robots.blocksAll,
      severity: "high",
      impact: 30,
      title: site.robots.blocksAll ? "robots.txt blocks all search engines" : "robots.txt allows crawling",
      evidence: site.robots.blocksAll ? 'robots.txt has "Disallow: /" for all user agents.' : site.robots.found ? "No site-wide block found." : "No robots.txt (crawling is allowed by default).",
      fix: 'Remove "Disallow: /" from the User-agent: * group in robots.txt.',
    },
    {
      code: "robots-file",
      pass: site.robots.found,
      severity: "low",
      impact: 4,
      title: site.robots.found ? "robots.txt found" : "No robots.txt file",
      evidence: site.robots.found ? `Lists ${plural(site.robots.sitemaps.length, "sitemap")}.` : "/robots.txt returned nothing usable.",
      fix: "Add a robots.txt at the site root that allows crawling and points to your sitemap (Sitemap: https://yoursite/sitemap.xml).",
    },
    {
      code: "sitemap",
      pass: site.sitemap.found,
      severity: "medium",
      impact: 10,
      title: site.sitemap.found ? "XML sitemap found" : "No XML sitemap found",
      evidence: site.sitemap.found ? `${site.sitemap.url} lists ${plural(site.sitemap.urlCount, "URL")}.` : "Checked robots.txt, /sitemap.xml and /sitemap_index.xml.",
      fix: "Create an XML sitemap of your indexable pages, link it in robots.txt and submit it in Google Search Console.",
    },
    {
      code: "canonical",
      pass: Boolean(page.canonical) && canonicalHost === pageHost,
      severity: page.canonical ? "high" : "medium",
      impact: page.canonical ? 16 : 8,
      title: !page.canonical ? "No canonical tag" : canonicalHost !== pageHost ? "Canonical points to a different domain" : "Canonical tag set",
      evidence: page.canonical ? `Canonical: ${page.canonical}` : 'No <link rel="canonical"> in the page head.',
      fix: 'Add <link rel="canonical" href="..."> with the page\'s own preferred https URL.',
    },
    site.hostVariantOk === null
      ? null
      : (() => {
          const softened = !site.hostVariantOk && site.hostVariantCanonical !== null && safeHost(site.hostVariantCanonical) === pageHost;
          return {
            code: "host-variant",
            pass: site.hostVariantOk,
            severity: softened ? ("low" as const) : ("medium" as const),
            impact: softened ? 3 : 8,
            title: site.hostVariantOk ? "www and non-www versions agree" : `${site.hostVariant} doesn't redirect to your main domain`,
            evidence: site.hostVariantOk
              ? `${site.hostVariant} redirects to ${pageHost}.`
              : `${site.hostVariant} loads its own copy of the site${softened ? `, though its canonical tag points to ${pageHost}` : ""}.`,
            fix: `Add a 301 redirect from ${site.hostVariant} to ${pageHost} so Google and visitors always see one version of each page.`,
          };
        })(),
    {
      code: "viewport",
      pass: Boolean(page.viewport),
      severity: "high",
      impact: 12,
      title: page.viewport ? "Mobile viewport set" : "No mobile viewport tag",
      evidence: page.viewport ? `viewport: ${page.viewport}` : "Page has no viewport meta tag, so phones show the desktop layout.",
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the page head.',
    },
    {
      code: "lang",
      pass: Boolean(page.lang),
      severity: "low",
      impact: 4,
      title: page.lang ? "Page language declared" : "Page language not declared",
      evidence: page.lang ? `<html lang="${page.lang}">` : "The <html> tag has no lang attribute.",
      fix: 'Add a lang attribute, e.g. <html lang="en-IN">.',
    },
    {
      code: "response-time",
      pass: page.ms < 1500,
      severity: page.ms >= 3000 ? "high" : "medium",
      impact: page.ms >= 3000 ? 10 : 5,
      title: page.ms < 1500 ? "Server responds quickly" : "Server responds slowly",
      evidence: `Page HTML downloaded in ${(page.ms / 1000).toFixed(2)}s from our server (${Math.round(page.bytes / 1024)} KB).`,
      fix: "Enable server/CDN caching, use a faster host or edge CDN, and reduce server-side work before the first byte.",
    },
    pages.length
      ? {
          code: "broken-pages",
          pass: broken.length === 0,
          severity: "high",
          impact: Math.min(20, broken.length * 6),
          title: broken.length ? `${plural(broken.length, "page")} in your sitemap or links failed to load` : "Sampled pages load fine",
          evidence: broken.length ? broken.map((p) => `${shortUrl(p.url)} (${p.error ?? p.status})`).join(", ") : `${plural(okPages.length, "page")} checked, all loaded normally.`,
          fix: "Fix or 301-redirect the failing URLs and remove dead URLs from your sitemap and menus.",
        }
      : null,
  ]);

  const content = make("content", [
    {
      code: "title",
      pass: page.title.length >= 25 && page.title.length <= 65,
      severity: page.title ? "medium" : "high",
      impact: page.title ? 7 : 18,
      title: !page.title ? "No page title" : page.title.length < 25 ? "Page title is too short" : page.title.length > 65 ? "Page title will be cut off in Google" : "Page title length is good",
      evidence: page.title ? `"${page.title}" (${page.title.length} characters)` : "The <title> tag is empty or missing.",
      fix: "Write a 30–60 character title with your main service and brand, e.g. \"SEO Agency in Bengaluru | Brand\".",
    },
    {
      code: "meta-description",
      pass: page.description.length >= 70 && page.description.length <= 165,
      severity: page.description ? "low" : "medium",
      impact: page.description ? 5 : 10,
      title: !page.description ? "No meta description" : page.description.length < 70 ? "Meta description is too short" : page.description.length > 165 ? "Meta description will be cut off" : "Meta description length is good",
      evidence: page.description ? `${page.description.length} characters: "${page.description.slice(0, 120)}${page.description.length > 120 ? "…" : ""}"` : "No meta description tag found.",
      fix: "Write a 120–160 character description that says what you offer, who it's for and why to click.",
    },
    {
      code: "h1",
      pass: page.h1s.length === 1,
      severity: page.h1s.length ? "low" : "medium",
      impact: page.h1s.length ? 4 : 10,
      title: page.h1s.length === 0 ? "No H1 heading" : page.h1s.length > 1 ? `${page.h1s.length} H1 headings on one page` : "One clear H1 heading",
      evidence: page.h1s.length ? page.h1s.slice(0, 3).map((h) => `"${h.slice(0, 80)}"`).join(", ") : "No <h1> found.",
      fix: "Use exactly one H1 that states the page's main topic; make other headings H2/H3.",
    },
    {
      code: "heading-order",
      pass: skipped === 0,
      severity: "low",
      impact: 3,
      title: skipped ? "Heading levels skip steps" : "Heading levels are in order",
      evidence: skipped ? `${plural(skipped, "jump")} such as H2 straight to H4.` : `${plural(page.headingOrder.length, "heading")} in a logical order.`,
      fix: "Keep headings nested in order (H1 → H2 → H3) so search engines and screen readers understand the structure.",
    },
    {
      code: "word-count",
      pass: page.wordCount >= 300,
      severity: page.wordCount < 150 ? "medium" : "low",
      impact: page.wordCount < 150 ? 12 : 6,
      title: page.wordCount >= 300 ? "Enough text on the page" : "Very little text on the page",
      evidence: `About ${page.wordCount.toLocaleString("en-IN")} words of readable text.`,
      fix: "Add useful text: what you do, who it's for, where you work, proof (results, reviews) and answers to common questions.",
    },
    {
      code: "image-alt",
      pass: page.imagesMissingAlt === 0,
      severity: page.imagesMissingAlt > 5 ? "medium" : "low",
      impact: Math.min(10, page.imagesMissingAlt * 2),
      title: page.imagesMissingAlt ? `${plural(page.imagesMissingAlt, "image")} without alt text` : "Images have alt text",
      evidence: `${page.images - page.imagesMissingAlt} of ${plural(page.images, "image")} have an alt attribute.`,
      fix: 'Add short descriptive alt text to meaningful images (alt="" for purely decorative ones).',
    },
    {
      code: "open-graph",
      pass: Boolean(page.og.title && page.og.image),
      severity: "low",
      impact: 5,
      title: page.og.title && page.og.image ? "Social sharing preview set" : "Social sharing preview incomplete",
      evidence: `og:title ${page.og.title ? "✓" : "missing"}, og:image ${page.og.image ? "✓" : "missing"}, twitter:card ${page.twitterCard || "missing"}.`,
      fix: "Add og:title, og:description, og:image (1200×630) and twitter:card so links look right on WhatsApp, LinkedIn and X.",
    },
    {
      code: "internal-links",
      pass: page.internalLinks.length >= 5,
      severity: "low",
      impact: 5,
      title: page.internalLinks.length >= 5 ? "Good internal linking" : "Few internal links",
      evidence: `${plural(page.internalLinks.length, "internal link")}, ${plural(page.externalLinks, "external link")}.`,
      fix: "Link from the homepage to your key service, location and proof pages with descriptive anchor text.",
    },
    all.length > 1
      ? {
          code: "duplicates",
          pass: dupTitles === 0 && dupDescs === 0,
          severity: "medium",
          impact: Math.min(12, (dupTitles + dupDescs) * 4),
          title: dupTitles || dupDescs ? "Pages share the same title or description" : "Titles and descriptions are unique",
          evidence: `Across ${plural(all.length, "page")}: ${plural(dupTitles, "repeated title")}, ${plural(dupDescs, "repeated description")}.`,
          fix: "Give every page its own title and meta description that describes that page specifically.",
        }
      : null,
    okPages.length
      ? {
          code: "thin-pages",
          pass: thinPages.length === 0,
          severity: "low",
          impact: Math.min(10, thinPages.length * 3),
          title: thinPages.length ? `${plural(thinPages.length, "inner page")} with very little text` : "Inner pages have real content",
          evidence: thinPages.length ? thinPages.map((p) => `${shortUrl(p.url)} (~${p.wordCount} words)`).join(", ") : `${plural(okPages.length, "page")} sampled, each with 250+ words.`,
          fix: "Expand thin pages with specific, useful detail or merge them into stronger pages.",
        }
      : null,
  ]);

  const ai = make("ai", [
    {
      code: "js-content",
      pass: !jsOnly,
      severity: "high",
      impact: 25,
      title: jsOnly ? "Content only appears after JavaScript runs" : "Content is readable without JavaScript",
      evidence: jsOnly ? `Only ~${page.wordCount} words in the raw HTML; the rest is built by ${plural(page.scriptCount, "script")}.` : `~${page.wordCount.toLocaleString("en-IN")} words present in the raw HTML.`,
      fix: "Use server-side rendering or static generation so the text is in the HTML. Many AI crawlers don't run JavaScript.",
    },
    {
      code: "schema",
      pass: schema.length > 0 && page.schemaErrors === 0,
      severity: "medium",
      impact: schema.length ? 6 : 14,
      title: !schema.length ? "No structured data (schema)" : page.schemaErrors ? "Some structured data can't be read" : "Structured data found",
      evidence: schema.length ? `Types: ${schema.slice(0, 8).join(", ")}${page.schemaErrors ? ` · ${plural(page.schemaErrors, "broken JSON-LD block")}` : ""}` : "No JSON-LD found on the page.",
      fix: "Add JSON-LD schema (Organization or LocalBusiness, WebSite, and FAQPage where relevant) and validate it with Google's Rich Results Test.",
    },
    {
      code: "entity",
      pass: orgSchema,
      severity: "medium",
      impact: 10,
      title: orgSchema ? "Business identity is marked up" : "Business identity isn't marked up",
      evidence: orgSchema ? `Found ${schema.filter((t) => /Organization|LocalBusiness|Corporation|ProfessionalService|Store|Restaurant|Person/i.test(t)).join(", ")} schema.` : "No Organization / LocalBusiness schema telling search and AI tools who you are.",
      fix: "Add Organization (or LocalBusiness) schema with name, logo, url, contact details and sameAs links to your official profiles.",
    },
    {
      code: "questions",
      pass: page.questionHeadings.length >= 3,
      severity: "medium",
      impact: 10,
      title: page.questionHeadings.length >= 3 ? "Page answers common questions" : "Few question-and-answer sections",
      evidence: page.questionHeadings.length ? `${plural(page.questionHeadings.length, "question")} found, e.g. "${page.questionHeadings[0].slice(0, 70)}"` : "No question-style headings or FAQ found.",
      fix: "Add an FAQ answering the real questions customers ask, each with a short, direct first sentence.",
    },
    {
      code: "ai-crawlers",
      pass: site.robots.aiBlocked.length === 0,
      severity: "medium",
      impact: 10,
      title: site.robots.aiBlocked.length ? "robots.txt blocks AI search crawlers" : "AI crawlers are allowed",
      evidence: site.robots.aiBlocked.length ? `Blocked: ${site.robots.aiBlocked.join(", ")}.` : "No AI crawler is blocked in robots.txt.",
      fix: "If you want to appear in ChatGPT, Claude, Perplexity and Google AI answers, allow OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended.",
    },
    {
      code: "contact",
      pass: page.hasEmail || page.hasPhone,
      severity: "low",
      impact: 6,
      title: page.hasEmail || page.hasPhone ? "Contact details are visible" : "No contact details on the homepage",
      evidence: `Email ${page.hasEmail ? "✓" : "not found"}, phone ${page.hasPhone ? "✓" : "not found"}.`,
      fix: "Show a phone number and email (and address if you serve locally) as text on the page, matching your Google Business Profile.",
    },
    {
      code: "llms-txt",
      pass: site.llmsTxt,
      severity: "low",
      impact: 3,
      title: site.llmsTxt ? "llms.txt found" : "No llms.txt file",
      evidence: site.llmsTxt ? "/llms.txt is present." : "/llms.txt not found. This is an optional, emerging convention.",
      fix: "Optionally add /llms.txt: a short plain-text summary of your business with links to your key pages.",
    },
  ]);

  return [...technical, ...content, ...ai];
}

export function scoreChecks(checks: Check[]) {
  const score = (c: Category) => Math.max(0, 100 - checks.filter((x) => x.category === c && !x.passed).reduce((s, x) => s + x.impact, 0));
  return { technical: score("technical"), content: score("content"), ai: score("ai") };
}

function safeHost(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
function shortUrl(u: string) {
  try {
    const x = new URL(u);
    return x.pathname === "/" ? x.hostname : x.pathname;
  } catch {
    return u;
  }
}
function dupes(values: string[]) {
  const seen = new Map<string, number>();
  values.filter(Boolean).forEach((v) => seen.set(v.toLowerCase(), (seen.get(v.toLowerCase()) ?? 0) + 1));
  return [...seen.values()].filter((n) => n > 1).length;
}
function headingSkips(order: number[]) {
  let skips = 0;
  for (let i = 1; i < order.length; i++) if (order[i] > order[i - 1] + 1) skips += 1;
  return skips;
}
