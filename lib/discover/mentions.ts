// Server-side brand search: "<brand>" site:<platform> on nine platforms via Serper.dev (Google results).
// Runs on our server, so visitors never talk to Google directly and never see a CAPTCHA.
import { tidyBrandName } from "./brand-identity";

export const PLATFORMS = [
  { name: "YouTube", site: "site:youtube.com", hosts: ["youtube.com"] },
  { name: "Instagram", site: "site:instagram.com", hosts: ["instagram.com"] },
  { name: "Facebook", site: "site:facebook.com", hosts: ["facebook.com"] },
  { name: "LinkedIn", site: "site:linkedin.com", hosts: ["linkedin.com"] },
  { name: "X", site: "(site:x.com OR site:twitter.com)", hosts: ["x.com", "twitter.com"] },
  { name: "TikTok", site: "site:tiktok.com", hosts: ["tiktok.com"] },
  { name: "Reddit", site: "site:reddit.com", hosts: ["reddit.com"] },
  { name: "Pinterest", site: "site:pinterest.com", hosts: ["pinterest.com", "pinterest.co.uk", "pinterest.ca", "pinterest.com.au", "in.pinterest.com"] },
  { name: "Threads", site: "site:threads.net", hosts: ["threads.net", "threads.com"] },
] as const;

const CONCURRENCY = 3; // Serper's free plan rejects bursts; 3 at a time is reliable
const onHost = (url: string, hosts: readonly string[]) => {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return hosts.some((x) => h === x || h.endsWith(`.${x}`));
  } catch {
    return false;
  }
};
/** Same page, different address (www., m., in., trailing slash, tracking query). */
const pageKey = (url: string) => {
  try {
    const u = new URL(url);
    let host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host.split(".").length > 2) host = host.replace(/^(m|mobile|[a-z]{2})\./, "");
    return host.replace(/^twitter\.com$/, "x.com") + u.pathname.replace(/\/+$/, "").toLowerCase() + (u.pathname.startsWith("/watch") ? u.search.replace(/&.*$/, "") : "");
  } catch {
    return url;
  }
};

export type Mention = { title: string; url: string; snippet: string; source: string };
export type PlatformResult = { platform: string; query: string; results: Mention[]; error?: boolean };

const CACHE_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: PlatformResult[] }>();

export const mentionsConfigured = () => Boolean(process.env.SERPER_API_KEY);

export const cleanBrand = (value: string) => tidyBrandName(value.replace(/["\\]/g, "")).slice(0, 100);

async function searchOne(query: string, key: string, hosts: readonly string[]): Promise<Mention[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      signal: controller.signal,
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, num: 10 }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`search ${res.status}`);
    const data = (await res.json()) as { organic?: { title?: string; link?: string; snippet?: string }[] };
    const seen = new Set<string>();
    return (data.organic ?? [])
      .filter((r) => {
        if (!r.link || !/^https?:\/\//.test(r.link) || !onHost(r.link, hosts)) return false; // drop off-platform results
        const k = pageKey(r.link);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .slice(0, 8)
      .map((r) => {
        let source = "";
        try { source = new URL(r.link as string).hostname.replace(/^www\./, ""); } catch {}
        return { title: (r.title ?? "").slice(0, 200), url: r.link as string, snippet: (r.snippet ?? "").slice(0, 320), source };
      });
  } finally {
    clearTimeout(timer);
  }
}

export async function findMentions(brand: string): Promise<PlatformResult[]> {
  const key = process.env.SERPER_API_KEY;
  if (!key) throw new Error("not_configured");
  const cacheKey = brand.toLowerCase();
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;

  const run = async (p: (typeof PLATFORMS)[number]): Promise<PlatformResult> => {
    const query = `"${brand}" ${p.site}`;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return { platform: p.name, query, results: await searchOne(query, key, p.hosts) };
      } catch {
        if (attempt < 2) await new Promise((r) => setTimeout(r, attempt === 0 ? 800 : 2000));
      }
    }
    return { platform: p.name, query, results: [], error: true };
  };
  // A few at a time, in platform order.
  const data: PlatformResult[] = new Array(PLATFORMS.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < PLATFORMS.length) {
        const i = next++;
        data[i] = await run(PLATFORMS[i]);
      }
    }),
  );
  if (data.every((d) => !d.error)) {
    if (cache.size > 500) cache.clear();
    cache.set(cacheKey, { at: Date.now(), data });
  }
  return data;
}
