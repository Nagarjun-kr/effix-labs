// Ported from Effix Discover (Search Tool): brand name + social profile links from one page.
import { load } from "cheerio";

export type BrandIdentity = {
  name: string;
  domain: string;
  sourceUrl: string;
  profiles: { platform: string; url: string }[];
};

const socialHosts: [string, string][] = [
  ["youtube.com", "YouTube"],
  ["youtu.be", "YouTube"],
  ["instagram.com", "Instagram"],
  ["facebook.com", "Facebook"],
  ["linkedin.com", "LinkedIn"],
  ["x.com", "X"],
  ["twitter.com", "X"],
  ["tiktok.com", "TikTok"],
  ["reddit.com", "Reddit"],
  ["pinterest.com", "Pinterest"],
  ["threads.net", "Threads"],
];

function platformFor(raw: string): string | undefined {
  try {
    const host = new URL(raw).hostname.toLowerCase().replace(/^www\./, "");
    return socialHosts.find(([domain]) => host === domain || host.endsWith(`.${domain}`))?.[1];
  } catch {
    return undefined;
  }
}

// Lower rank = more likely to be the brand. Company/brand entities beat a site name, page title or person.
type Ranked = { name: string; rank: number };
const entityRank: Record<string, number> = { Organization: 1, Corporation: 1, LocalBusiness: 1, ProfessionalService: 1, Brand: 1, WebSite: 2.5, Person: 4 };

function walkJson(value: unknown, names: Ranked[], sameAs: string[]) {
  if (Array.isArray(value)) return value.forEach((entry) => walkJson(entry, names, sameAs));
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const type = record["@type"];
  const types = (Array.isArray(type) ? type : [type]).map(String);
  const ranks = types.map((item) => entityRank[item]).filter((r): r is number => r !== undefined);
  if (ranks.length) {
    const rank = Math.min(...ranks);
    if (typeof record.name === "string" && record.name.trim()) names.push({ name: record.name.trim(), rank });
    if (typeof record.alternateName === "string" && record.alternateName.trim()) names.push({ name: record.alternateName.trim(), rank: rank + 0.2 });
    const links = Array.isArray(record.sameAs) ? record.sameAs : [record.sameAs];
    for (const link of links) if (typeof link === "string") sameAs.push(link);
  }
  for (const child of Object.values(record)) walkJson(child, names, sameAs);
}

export function extractBrandIdentity(html: string, sourceUrl: string): BrandIdentity {
  const $ = load(html);
  const names: Ranked[] = [];
  const profileCandidates: string[] = [];
  $("script[type='application/ld+json']").each((_, script) => {
    try {
      walkJson(JSON.parse($(script).text()), names, profileCandidates);
    } catch {
      // Ignore malformed structured data and continue with ordinary page metadata.
    }
  });
  for (const [selector, rank] of [["meta[property='og:site_name']", 1.5], ["meta[name='application-name']", 2]] as const) {
    const content = $(selector).attr("content")?.trim();
    if (content) names.push({ name: content, rank });
  }
  const title = $("title").first().text().trim();
  if (title) names.push({ name: title.split(/\s+[|–—-]\s+/)[0].trim(), rank: 3 });
  const source = new URL(sourceUrl);
  const best = names
    .filter((candidate) => candidate.name.length > 1 && candidate.name.length <= 100)
    .sort((a, b) => a.rank - b.rank)[0];
  const name = tidyBrandName(best?.name ?? "") || nameFromHost(source.hostname);
  $("a[href]").each((_, anchor) => {
    const href = $(anchor).attr("href");
    if (!href) return;
    try {
      profileCandidates.push(new URL(href, source).toString());
    } catch {
      // Ignore malformed links.
    }
  });
  const profiles = new Map<string, { platform: string; url: string }>();
  for (const candidate of profileCandidates) {
    const platform = platformFor(candidate);
    if (platform && !profiles.has(`${platform}:${candidate}`)) profiles.set(`${platform}:${candidate}`, { platform, url: candidate });
  }
  return {
    name,
    domain: source.hostname.replace(/^www\./, ""),
    sourceUrl,
    profiles: [...profiles.values()].slice(0, 40),
  };
}

/** "swiggy.com" / "my-brand.co.in" -> "Swiggy" / "My Brand". Search APIs reject queries containing web addresses. */
export function nameFromHost(hostname: string) {
  const label = hostname.toLowerCase().replace(/^www\./, "").split(".")[0] ?? "";
  return label.split(/[-_]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || hostname;
}

/** Drops legal endings people don't search with ("Freshworks Inc" -> "Freshworks"); turns an address into a name. */
export function tidyBrandName(raw: string) {
  const v = raw.replace(/\s+/g, " ").trim();
  if (/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/.*)?$/i.test(v)) return nameFromHost(v.replace(/^https?:\/\//i, "").split("/")[0]);
  return v.replace(/[,\s]+(inc\.?|incorporated|llc|l\.l\.c\.|ltd\.?|limited|pvt\.? ltd\.?|private limited|corp\.?|corporation|gmbh|plc|co\.)$/i, "").trim();
}
