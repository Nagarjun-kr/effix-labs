// Opens a public profile page to confirm whose it is. Only YouTube and Pinterest serve real profile pages to
// servers; Instagram, Facebook, LinkedIn, X, TikTok and Reddit block automated visitors, so they rely on search evidence.
import { retrieveSafely } from "./safe-retrieval";
import type { ProfileCheck } from "./classify";

const CACHE_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; v: ProfileCheck }>();

const HOSTS: Record<string, RegExp> = {
  YouTube: /(^|\.)youtube\.com$/i,
  Pinterest: /(^|\.)pinterest\.(com|co\.uk|ca|com\.au|de|fr|es|it|jp|com\.mx|ch|at|nz|ie|ph|cl|pt|se|dk|ru|kr)$/i,
};

export const canCheck = (platform: string, url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && Boolean(HOSTS[platform]?.test(u.hostname));
  } catch {
    return false;
  }
};

const decode = (s: string) => s.replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/&amp;/g, "&");
const bare = (d: string) => d.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

export async function checkProfile(platform: string, url: string, domain: string): Promise<ProfileCheck> {
  const key = `${platform}|${url}|${domain}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.v;
  const site = bare(domain);
  let v: ProfileCheck = { url, ok: false };
  try {
    const page = await retrieveSafely(url, "html", { maxBytes: 4_000_000 });
    const html = page.body;
    const lower = html.toLowerCase();
    if (platform === "YouTube") {
      const channelId = html.match(/"externalId":"(UC[\w-]{20,})"/)?.[1] ?? html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{20,})"/)?.[1] ?? null;
      const name = decode(html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? "");
      // description + header links are in the page; the site can appear as text or inside a redirect link
      v = { url, ok: Boolean(channelId), channelId, name, mentionsSite: site.length > 3 && lower.includes(site) };
    } else if (platform === "Pinterest") {
      const website = decode(html.match(/"website_url":"([^"]+)"/)?.[1] ?? "") || null;
      const about = decode(html.match(/property="og:description"[^>]*content="([^"]*)"|content="([^"]*)"[^>]*property="og:description"/)?.slice(1).find(Boolean) ?? "");
      const name = decode(html.match(/content="([^"]*)"[^>]*property="og:title"/)?.[1] ?? "");
      const mentionsSite = site.length > 3 && ((website ?? "").toLowerCase().includes(site) || about.toLowerCase().includes(site));
      v = { url, ok: true, website, name, mentionsSite };
    }
  } catch {
    v = { url, ok: false };
  }
  if (cache.size > 2000) cache.clear();
  cache.set(key, { at: Date.now(), v });
  return v;
}
