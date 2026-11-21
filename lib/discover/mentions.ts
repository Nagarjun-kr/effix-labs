// Server-side brand search: "<brand>" site:<platform> on nine platforms via Serper.dev (Google results).
// Runs on our server, so visitors never talk to Google directly and never see a CAPTCHA.
export const PLATFORMS = [
  { name: "YouTube", site: "site:youtube.com" },
  { name: "Instagram", site: "site:instagram.com" },
  { name: "Facebook", site: "site:facebook.com" },
  { name: "LinkedIn", site: "site:linkedin.com" },
  { name: "X", site: "(site:x.com OR site:twitter.com)" },
  { name: "TikTok", site: "site:tiktok.com" },
  { name: "Reddit", site: "site:reddit.com" },
  { name: "Pinterest", site: "site:pinterest.com" },
  { name: "Threads", site: "site:threads.net" },
] as const;

export type Mention = { title: string; url: string; snippet: string; source: string };
export type PlatformResult = { platform: string; query: string; results: Mention[]; error?: boolean };

const CACHE_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: PlatformResult[] }>();

export const mentionsConfigured = () => Boolean(process.env.SERPER_API_KEY);

export const cleanBrand = (value: string) => value.replace(/["\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 100);

async function searchOne(query: string, key: string): Promise<Mention[]> {
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
    return (data.organic ?? [])
      .filter((r) => r.link && /^https?:\/\//.test(r.link))
      .slice(0, 6)
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

  const data = await Promise.all(
    PLATFORMS.map(async (p): Promise<PlatformResult> => {
      const query = `"${brand}" ${p.site}`;
      try {
        return { platform: p.name, query, results: await searchOne(query, key) };
      } catch {
        return { platform: p.name, query, results: [], error: true };
      }
    }),
  );
  if (data.some((d) => !d.error)) {
    if (cache.size > 500) cache.clear();
    cache.set(cacheKey, { at: Date.now(), data });
  }
  return data;
}
