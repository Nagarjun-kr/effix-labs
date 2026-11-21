// Classifies brand search results: is a URL a profile or a piece of content, is it the profile the
// website links to, and does its handle match the brand? Pure functions, used in the browser.

export type Kind = "profile" | "community" | "video" | "post" | "thread" | "article" | "page";
export type Status = "official" | "likely" | "possible" | "mentions" | "none" | "unknown";

export type ResultTag = { kind: Kind; label: string; handle: string | null; official: boolean; matchesBrand: boolean; mentionsSite: boolean };

const segs = (u: URL) => u.pathname.split("/").filter(Boolean);

/** Profile/content detection by URL pattern for each platform. */
function kindFor(platform: string, u: URL): { kind: Kind; handle: string | null } {
  const s = segs(u);
  const first = (s[0] ?? "").toLowerCase();
  switch (platform) {
    case "YouTube":
      if (first.startsWith("@")) return { kind: s[1] && !["videos", "shorts", "featured", "about", "streams"].includes(s[1]) ? "video" : "profile", handle: first.slice(1) };
      if (["channel", "c", "user"].includes(first)) return { kind: "profile", handle: s[1] ?? null };
      if (["watch", "shorts", "live", "embed"].includes(first)) return { kind: "video", handle: null };
      return { kind: "page", handle: null };
    case "Instagram":
      if (["p", "reel", "reels", "tv", "stories"].includes(first)) return { kind: "post", handle: null };
      if (s.length >= 1 && !["explore", "accounts", "about", "directory"].includes(first)) return { kind: s.length === 1 ? "profile" : "post", handle: first };
      return { kind: "page", handle: null };
    case "Facebook":
      if (first === "groups") return { kind: "community", handle: s[1] ?? null };
      if (["watch", "reel", "events", "photo", "photo.php", "story.php", "permalink.php", "share", "marketplace", "hashtag"].includes(first)) return { kind: "post", handle: null };
      if (first === "people") return { kind: "profile", handle: s[1] ?? null };
      if (first === "profile.php") return { kind: "profile", handle: null };
      if (s.length === 1 || (s.length === 2 && ["about", "reviews", "photos", "videos"].includes(s[1]))) return { kind: "profile", handle: first };
      if (s.length >= 2) return { kind: "post", handle: first };
      return { kind: "page", handle: null };
    case "LinkedIn":
      if (first === "company" || first === "showcase" || first === "school") return { kind: s[2] && s[2] !== "about" ? "post" : "profile", handle: s[1] ?? null };
      if (first === "in") return { kind: "profile", handle: s[1] ?? null };
      if (first === "posts" || first === "feed" || first === "events") return { kind: "post", handle: null };
      if (first === "pulse") return { kind: "article", handle: null };
      if (first === "groups") return { kind: "community", handle: s[1] ?? null };
      return { kind: "page", handle: null };
    case "X":
      if (s.length >= 2 && s[1] === "status") return { kind: "post", handle: first };
      if (s.length === 1 && !["search", "hashtag", "explore", "i", "home"].includes(first)) return { kind: "profile", handle: first };
      return { kind: "page", handle: null };
    case "TikTok":
      if (first.startsWith("@")) return { kind: s[1] === "video" || s[1] === "photo" ? "video" : "profile", handle: first.slice(1) };
      if (first === "discover" || first === "tag") return { kind: "page", handle: null };
      return { kind: "video", handle: null };
    case "Reddit":
      if ((first === "r" || first === "user" || first === "u") && s.length >= 3 && s[2] === "comments") return { kind: "thread", handle: null };
      if (first === "r" && s.length >= 2) return { kind: s.length === 2 || ["about", "wiki"].includes(s[2]) ? "community" : "thread", handle: s[1] };
      if (first === "user" || first === "u") return { kind: "profile", handle: s[1] ?? null };
      if (first === "comments") return { kind: "thread", handle: null };
      return { kind: "page", handle: null };
    case "Pinterest":
      if (first === "pin") return { kind: "post", handle: null };
      if (first === "ideas" || first === "search") return { kind: "page", handle: null };
      if (s.length === 1) return { kind: "profile", handle: first };
      if (s.length >= 2) return { kind: "post", handle: first };
      return { kind: "page", handle: null };
    case "Threads":
      if (first.startsWith("@")) return { kind: s[1] === "post" ? "post" : "profile", handle: first.slice(1) };
      return { kind: "page", handle: null };
  }
  return { kind: "page", handle: null };
}

const LABEL: Record<Kind, string> = { profile: "Profile", community: "Community", video: "Video", post: "Post", thread: "Discussion", article: "Article", page: "Page" };

/** Lower-case letters and digits only, for comparing handles with a brand name. */
export const squash = (v: string) => v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]/g, "");

// Handle = brand, or brand with a common add-on (stripehq, getstripe, effixlabs, effix_india).
const SUFFIXES = ["hq", "official", "app", "inc", "co", "company", "labs", "lab", "global", "team", "group", "tv", "media", "studio", "studios", "agency", "digital", "india", "in", "uk", "us", "usa", "online", "web", "dev", "tech", "io", "ai", "brand", "store", "shop"];
const PREFIXES = ["the", "get", "try", "use", "join", "go", "hey", "we", "its", "real", "official", "team"];
export function handleMatches(handle: string, brand: string) {
  if (!handle || brand.length < 3) return false;
  if (handle === brand) return true;
  if (handle.startsWith(brand) && SUFFIXES.includes(handle.slice(brand.length))) return true;
  if (handle.endsWith(brand) && PREFIXES.includes(handle.slice(0, handle.length - brand.length))) return true;
  // multi-word brands written with a shorter handle, e.g. "Effix Labs" -> "effix"
  if (brand.startsWith(handle) && handle.length >= 4 && SUFFIXES.includes(brand.slice(handle.length))) return true;
  return false;
}

/** host + path without protocol, www, query, trailing slash; for comparing a result with a linked profile. */
export function normUrl(raw: string) {
  try {
    const u = new URL(raw);
    let host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host.split(".").length > 2) host = host.replace(/^(m|mobile|[a-z]{2})\./, ""); // m.youtube.com, in.linkedin.com
    host = host.replace(/^twitter\.com$/, "x.com");
    return (host + u.pathname.replace(/\/+$/, "")).toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

/** text = result title + snippet; domain = the audited website, e.g. "effix.co.in". */
export function tagResult(platform: string, url: string, brand: string, linkedUrl: string | null, text = "", domain = ""): ResultTag {
  let kind: Kind = "page";
  let handle: string | null = null;
  try {
    ({ kind, handle } = kindFor(platform, new URL(url)));
  } catch {}
  const b = squash(brand);
  const h = handle ? squash(decodeURIComponent(handle)) : "";
  const matchesBrand = handleMatches(h, b);
  const n = normUrl(url);
  const official = Boolean(linkedUrl) && (n === normUrl(linkedUrl as string) || n.startsWith(normUrl(linkedUrl as string) + "/"));
  const mentionsSite = Boolean(domain) && text.toLowerCase().includes(domain.toLowerCase().replace(/^www\./, ""));
  return { kind, label: LABEL[kind], handle, official, matchesBrand, mentionsSite };
}

/** Platform status from what the site links to and what search found. */
// likely   = a profile whose name matches AND whose result mentions the website address
// possible = name matches only (could be another business with the same name)
export const isProfile = (t: ResultTag) => t.kind === "profile" || t.kind === "community";
export function platformStatus(linked: boolean, tags: ResultTag[] | null): Status {
  if (linked) return "official";
  if (tags === null) return "unknown";
  if (tags.some((t) => isProfile(t) && t.matchesBrand && t.mentionsSite)) return "likely";
  if (tags.some((t) => isProfile(t) && t.matchesBrand)) return "possible";
  return tags.length ? "mentions" : "none";
}
