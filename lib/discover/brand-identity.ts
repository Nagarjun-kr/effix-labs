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
  ["reddit.com", "Reddit"],
  ["quora.com", "Quora"],
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

/** Only the parts the identity reads (title, meta tags, JSON-LD, link targets), in page order. Parsing this instead
 *  of a full page keeps large homepages cheap: about 1 ms instead of 15–20 ms on a 700 KB page. */
function essentials(html: string) {
  const re = /<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>|<script\b[^>]*application\/ld\+json[^>]*>[\s\S]*?<\/script>|<a\b[^>]*\bhref\s*=[^>]*>/gi;
  let out = "";
  for (const m of html.matchAll(re)) out += m[0].startsWith("<a") || m[0].startsWith("<A") ? `${m[0]}</a>` : m[0];
  return out;
}

export function extractBrandIdentity(html: string, sourceUrl: string): BrandIdentity {
  const $ = load(essentials(html));
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
  const name = tidyBrandName(shortBrand(best?.name ?? "", source.hostname)) || nameFromHost(source.hostname);
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
  const legal = v.replace(/[,\s]+(inc\.?|incorporated|llc|l\.l\.c\.|ltd\.?|limited|pvt\.? ltd\.?|private limited|corp\.?|corporation|gmbh|plc|co\.)$/i, "").trim();
  // Country/region endings narrow the search too much ("Netflix India" -> "Netflix"); the visitor can type them back.
  const core = legal.replace(/\s+(india|uk|usa|us|global|worldwide|international|australia|canada|singapore|uae|europe|asia)$/i, "").trim();
  return core.length >= 2 ? core : legal;
}

/** Taglines are not names: "CRED. not everyone gets it." -> "CRED"; "The Tata group. Leadership with Trust." -> "Tata".
 *  Uses the first part of the title, and the word matching the web address when the name says more than the brand. */
export function shortBrand(raw: string, hostname: string) {
  const squash = (x: string) => x.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");
  const label = squash(hostname.replace(/^www\./, "").split(".")[0] ?? "");
  const text = raw.replace(/\s+/g, " ").trim();
  // 1. The part of the title that spells the web address: "Apollo 24|7: Online…" on apollo247.com -> "Apollo 24|7",
  //    "Blue Tokai Coffee Roasters" on bluetokaicoffee.com -> "Blue Tokai Coffee".
  if (label.length >= 3) {
    for (let i = 1; i <= text.length; i++) {
      const head = text.slice(0, i);
      // only when a clear break follows (end, "|", ":", "-", "–", ","), not more words of the name
      if (squash(head) === label && (i === text.length || /^\s*[|:,–—-]/.test(text.slice(i)))) return head.replace(/[\s|:,.–—-]+$/, "");
      if (squash(head).length > label.length) break;
    }
  }
  const first = text.split(/\s*[|–—:•·]\s*|\.\s+|\s+-\s+/)[0].replace(/[.\s]+$/, "").trim() || text;
  if (!label || squash(first) === label) return first; // "The Body Shop" on thebodyshop.in stays whole
  const words = first.split(/\s+/);
  const hit = words.find((w) => squash(w) === label);
  if (hit && words.length > 1) return hit.replace(/[^\p{L}\p{N}'&.-]/gu, ""); // "The Tata group" -> "Tata"
  // 2. A long title that never mentions the brand is a page description, not a name -> use the web address
  //    ("Online Shopping for Women, Men, Kids and Home & Living" on fabindia.com -> "Fabindia").
  if (words.length > 4 && !squash(first).includes(label) && !label.includes(squash(first))) return "";
  return first;
}
