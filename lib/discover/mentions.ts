// Server-side brand search workflow (Google results via Serper.dev). Takes its time to get complete answers:
//   1. Overview   – search the brand name alone: does Google show the website, and which profiles appear beside it?
//   2. Platforms  – "<brand>" site:<platform> for each of the eight platforms, re-checked in another country when
//                   the answer is empty or thin.
//   3. Second look – where no profile with the brand's name turned up, search "<brand> <platform>" too.
//   4. Merge      – combine, de-duplicate, keep only results on that platform.
// Searches are spaced (Serper allows 5/second and quietly returns partial results above that). Nothing is cached:
// every audit is fresh. Runs on our server, so visitors never talk to Google directly and never see a CAPTCHA.
import { tidyBrandName } from "./brand-identity";
import { realLink, tagResult, type Organic } from "./classify";

export { realLink };

export const PLATFORMS = [
  { name: "YouTube", site: "site:youtube.com", hosts: ["youtube.com"], word: "YouTube" },
  { name: "Instagram", site: "site:instagram.com", hosts: ["instagram.com"], word: "Instagram" },
  { name: "Facebook", site: "site:facebook.com", hosts: ["facebook.com"], word: "Facebook" },
  { name: "LinkedIn", site: "site:linkedin.com", hosts: ["linkedin.com"], word: "LinkedIn" },
  { name: "X", site: "(site:x.com OR site:twitter.com)", hosts: ["x.com", "twitter.com"], word: "Twitter" },
  { name: "Reddit", site: "site:reddit.com", hosts: ["reddit.com"], word: "Reddit" },
  { name: "Quora", site: "site:quora.com", hosts: ["quora.com"], word: "Quora" },
  { name: "Threads", site: "site:threads.net", hosts: ["threads.net", "threads.com"], word: "Threads" },
] as const;

export type Mention = { title: string; url: string; snippet: string; source: string; via?: string[] };
export type PlatformResult = { platform: string; query: string; results: Mention[]; error?: boolean };
export type Overview = { siteFound: boolean; siteRank: number | null; profiles: { platform: string; url: string }[] };
export type SearchResult = { platforms: PlatformResult[]; overview: Overview; searches: number };
export type Progress =
  | { type: "step"; step: "overview"; state: "start" | "done"; siteFound?: boolean }
  | { type: "step"; step: "platform"; platform: string; state: "start" | "done"; found?: number }
  | { type: "step"; step: "second"; platform: string; state: "start" | "done"; found?: number };

const PER_PLATFORM = 10;
const PARALLEL = 2; // platforms worked on at the same time (searches are spaced anyway)

export const mentionsConfigured = () => Boolean(process.env.SERPER_API_KEY);
export const cleanBrand = (value: string) => tidyBrandName(value.replace(/["\\]/g, "")).slice(0, 100);

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
};
const onHost = (url: string, hosts: readonly string[]) => {
  const h = hostOf(url);
  return Boolean(h) && hosts.some((x) => h === x || h.endsWith(`.${x}`));
};
/** Same page, different address (www., m., in., trailing slash, tracking query). */
export const pageKey = (url: string) => {
  try {
    const u = new URL(url);
    let host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host.split(".").length > 2) host = host.replace(/^(m|mobile|[a-z]{2})\./, "");
    host = host.replace(/^twitter\.com$/, "x.com");
    const path = host === "x.com" ? u.pathname.replace(/^\/@/, "/") : u.pathname; // x.com/@name = x.com/name
    return host + path.replace(/\/+$/, "").toLowerCase() + (u.pathname.startsWith("/watch") ? u.search.replace(/&.*$/, "") : "");
  } catch {
    return url;
  }
};

// Space search starts ≥ 260 ms apart across the whole server (≤ ~4/second), whatever the number of visitors.
let nextSlot = 0;
async function throttle() {
  const now = Date.now();
  const wait = Math.max(0, nextSlot - now);
  nextSlot = Math.max(now, nextSlot) + 260;
  if (wait) await new Promise((r) => setTimeout(r, wait));
}



/** One Serper search, with up to two retries on network/server errors. */
async function serper(q: string, gl: string, key: string, counter: { n: number }): Promise<Organic[]> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    await throttle();
    counter.n += 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        signal: controller.signal,
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q, num: 10, gl }),
        cache: "no-store",
      });
      if (res.status === 400 || res.status === 401 || res.status === 403) throw Object.assign(new Error(`search ${res.status}`), { fatal: true });
      if (!res.ok) throw new Error(`search ${res.status}`);
      const data = (await res.json()) as { organic?: Organic[] };
      return data.organic ?? [];
    } catch (error) {
      lastError = error;
      if ((error as { fatal?: boolean }).fatal) break;
      await new Promise((r) => setTimeout(r, attempt === 0 ? 1000 : 2500));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

const toMention = (r: Organic, via: string): Mention => {
  const url = realLink(r) as string;
  return { title: (r.title ?? "").slice(0, 200), url, snippet: (r.snippet ?? "").slice(0, 320), source: hostOf(url).replace(/^www\./, ""), via: [via] };
};
/** Results on one platform (by their real address). */
const onPlatform = (organic: Organic[], hosts: readonly string[]) =>
  organic.filter((r) => {
    const u = realLink(r);
    return Boolean(u) && onHost(u as string, hosts);
  });

/** Adds results to a list, merging duplicates (same page, different address) and remembering how each was found. */
function merge(into: Mention[], add: Mention[]) {
  for (const m of add) {
    const k = pageKey(m.url);
    const existing = into.find((x) => pageKey(x.url) === k);
    if (existing) existing.via = [...new Set([...(existing.via ?? []), ...(m.via ?? [])])];
    else into.push(m);
  }
}

/** Search country from the website's ending (.in -> India, .co.uk -> UK); other endings default to India (Effix's market). */
export function countryFor(domain: string) {
  const d = domain.toLowerCase();
  const map: [RegExp, string][] = [[/\.(in|co\.in)$/, "in"], [/\.(uk|co\.uk)$/, "uk"], [/\.(au|com\.au)$/, "au"], [/\.ca$/, "ca"], [/\.(ae)$/, "ae"], [/\.(sg|com\.sg)$/, "sg"], [/\.de$/, "de"], [/\.fr$/, "fr"], [/\.us$/, "us"], [/\.(nz|co\.nz)$/, "nz"], [/\.(za|co\.za)$/, "za"]];
  return map.find(([re]) => re.test(d))?.[1] ?? "in";
}

export async function findMentions(brand: string, domain = "", onProgress: (p: Progress) => void = () => {}): Promise<SearchResult> {
  const key = process.env.SERPER_API_KEY;
  if (!key) throw new Error("not_configured");
  const gl = countryFor(domain);
  const otherCountries = gl === "us" ? ["in", "uk"] : ["us", "uk"].filter((c) => c !== gl);
  const counter = { n: 0 };
  const site = domain.toLowerCase().replace(/^www\./, "");
  const isProfileOfBrand = (platform: string, url: string) => {
    const t = tagResult(platform, url, brand, null, "", domain);
    return t.kind === "profile" && t.matchesBrand;
  };

  // 1. Overview: the brand name alone.
  onProgress({ type: "step", step: "overview", state: "start" });
  let overview: Overview = { siteFound: false, siteRank: null, profiles: [] };
  const fromOverview = new Map<string, Mention[]>();
  try {
    const organic = await serper(brand, gl, key, counter);
    const rank = site ? organic.findIndex((r) => { const u = realLink(r); return Boolean(u) && (hostOf(u as string) === site || hostOf(u as string).endsWith(`.${site}`)); }) : -1;
    overview = { siteFound: rank >= 0, siteRank: rank >= 0 ? rank + 1 : null, profiles: [] };
    for (const p of PLATFORMS) {
      const hits = onPlatform(organic, p.hosts).map((r) => toMention(r, "overview"));
      if (hits.length) fromOverview.set(p.name, hits);
      hits.forEach((h) => overview.profiles.push({ platform: p.name, url: h.url }));
    }
  } catch {
    // The overview only adds evidence; the platform searches still run.
  }
  onProgress({ type: "step", step: "overview", state: "done", siteFound: overview.siteFound });

  // 2 + 3. Each platform: site: search (re-checked when empty/thin), then a second look if no profile turned up.
  const work = async (p: (typeof PLATFORMS)[number]): Promise<PlatformResult> => {
    const query = `"${brand}" ${p.site}`;
    onProgress({ type: "step", step: "platform", platform: p.name, state: "start" });
    const results: Mention[] = [];
    let failures = 0;
    for (const country of [gl, ...otherCountries]) {
      try {
        const organic = await serper(query, country, key, counter);
        merge(results, onPlatform(organic, p.hosts).map((r) => toMention(r, "site")));
      } catch {
        failures += 1;
      }
      if (results.length >= 3) break; // a full answer; thin or empty answers are re-checked in another country
    }
    merge(results, fromOverview.get(p.name) ?? []);
    onProgress({ type: "step", step: "platform", platform: p.name, state: "done", found: results.length });

    if (!results.some((m) => isProfileOfBrand(p.name, m.url))) {
      onProgress({ type: "step", step: "second", platform: p.name, state: "start" });
      try {
        const organic = await serper(`${brand} ${p.word}`, gl, key, counter);
        merge(results, onPlatform(organic, p.hosts).map((r) => toMention(r, "name")));
      } catch {
        failures += 1;
      }
      onProgress({ type: "step", step: "second", platform: p.name, state: "done", found: results.length });
    }
    // Keep the most useful first: results found several ways, then search order.
    const ordered = results.map((m, i) => ({ m, i })).sort((a, b) => (b.m.via?.length ?? 0) - (a.m.via?.length ?? 0) || a.i - b.i).map((x) => x.m);
    return { platform: p.name, query, results: ordered.slice(0, PER_PLATFORM), error: failures > 0 && results.length === 0 ? true : undefined };
  };

  const platforms: PlatformResult[] = new Array(PLATFORMS.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      while (next < PLATFORMS.length) {
        const i = next++;
        platforms[i] = await work(PLATFORMS[i]);
      }
    }),
  );
  return { platforms, overview, searches: counter.n };
}
