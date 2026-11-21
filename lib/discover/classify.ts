// Classifies brand search results: is a URL a profile or a piece of content, is it the profile the
// website links to, and does its handle match the brand? Pure functions, used in the browser.

export type Kind = "profile" | "community" | "video" | "post" | "thread" | "article" | "page";
export type Status = "official" | "likely" | "possible" | "mentions" | "none" | "unknown";

export type ResultTag = {
  kind: Kind; label: string; handle: string | null; official: boolean; matchesBrand: boolean; mentionsSite: boolean; sameHandle: boolean;
  /** From opening the profile page itself (YouTube): links to your site, or to another site. */
  checked?: "yours" | "other";
  otherSite?: string;
  sameChannel?: boolean; // YouTube @handle resolved to the channel the site links to
  besideSite?: boolean; // Google showed it beside your website when searching your brand name
};

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
      if (s.length >= 2 && s[1] === "status") return { kind: "post", handle: first.replace(/^@/, "") };
      if (s.length === 1 && !["search", "hashtag", "explore", "i", "home"].includes(first)) return { kind: "profile", handle: first.replace(/^@/, "") };
      return { kind: "page", handle: null };
    case "Reddit":
      if ((first === "r" || first === "user" || first === "u") && s.length >= 3 && s[2] === "comments") return { kind: "thread", handle: null };
      if (first === "r" && s.length >= 2) return { kind: s.length === 2 || ["about", "wiki"].includes(s[2]) ? "community" : "thread", handle: s[1] };
      if (first === "user" || first === "u") return { kind: "profile", handle: s[1] ?? null };
      if (first === "comments") return { kind: "thread", handle: null };
      return { kind: "page", handle: null };
    case "Quora": {
      const sub = u.hostname.toLowerCase().replace(/^www\./, "").replace(/\.?quora\.com$/, "");
      if (["help", "business", "blog", "careers"].includes(sub)) return { kind: "page", handle: null }; // Quora's own pages
      if (sub && sub.length > 2) return { kind: "community", handle: sub }; // Quora Spaces live on their own subdomain
      if (first === "profile") return { kind: s.length >= 3 && s[2] === "answers" ? "profile" : s.length > 2 ? "post" : "profile", handle: s[1] ?? null };
      if (first === "topic") return { kind: "community", handle: s[1] ?? null };
      if (first === "q") return { kind: "community", handle: s[1] ?? null };
      if (s.length >= 3 && s[1] === "answer") return { kind: "post", handle: null };
      if (s.length === 1 && !["search", "about", "contact"].includes(first)) return { kind: "thread", handle: null };
      return { kind: "page", handle: null };
    }
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

// Words that make a name regional or formal; the core brand is matched too ("Netflix India" -> "netflix").
const REGION_WORDS = /\b(india|in|uk|us|usa|global|official|worldwide|international|australia|canada|singapore|uae|europe|asia|pvt|private|limited|ltd|inc|llc)\b/gi;
/** Name forms to match handles against: full name, name without regional words, and the website's name. */
export function brandForms(brand: string, domain = "") {
  const forms = new Set<string>([squash(brand), squash(brand.replace(REGION_WORDS, " "))]);
  const label = domain.toLowerCase().replace(/^www\./, "").split(".")[0] ?? "";
  if (label.length >= 3) forms.add(squash(label));
  return [...forms].filter((f) => f.length >= 3);
}

/** host + path without protocol, www, query, trailing slash; for comparing a result with a linked profile. */
export function normUrl(raw: string) {
  try {
    const u = new URL(raw);
    let host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host.split(".").length > 2) host = host.replace(/^(m|mobile|[a-z]{2})\./, ""); // m.youtube.com, in.linkedin.com
    host = host.replace(/^twitter\.com$/, "x.com");
    const path = host === "x.com" ? u.pathname.replace(/^\/@/, "/") : u.pathname; // x.com/@name = x.com/name
    return (host + path.replace(/\/+$/, "")).toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
}

/** text = result title + snippet; domain = the audited website; officialHandles = handles of profiles the site links to. */
/** Facebook page number: profile.php?id=615…, /p/Name-615…/, /615…/posts/… all point to the same page. */
export function facebookId(raw: string): string | null {
  try {
    const u = new URL(raw);
    const id = u.searchParams.get("id");
    if (id && /^\d{8,}$/.test(id)) return id;
    const m = u.pathname.match(/(?:^|[/-])(\d{10,})(?=\/|$)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

/** Last path part of a profile address, squashed (youtube.com/OpenAI -> "openai"), to spot the same account. */
export function lastSegment(raw: string): string {
  try {
    const parts = new URL(raw).pathname.split("/").filter(Boolean);
    return squash(decodeURIComponent((parts[parts.length - 1] ?? "").replace(/^@/, "")));
  } catch {
    return "";
  }
}

/** A linked address that is a profile/page (not a single video or post). */
export function isProfileUrl(platform: string, url: string) {
  try {
    const k = kindFor(platform, new URL(url)).kind;
    return k === "profile" || k === "community" || (platform === "YouTube" && k === "page" && new URL(url).pathname.split("/").filter(Boolean).length === 1);
  } catch {
    return false;
  }
}

/** Handles of the profiles a website links to (squashed), for spotting the same handle on other platforms. */
export function handlesOf(links: { platform: string; url: string }[]) {
  const out = new Set<string>();
  for (const l of links) {
    try {
      const { kind, handle } = kindFor(l.platform, new URL(l.url));
      if (handle && kind === "profile") out.add(squash(decodeURIComponent(handle)));
    } catch {}
  }
  return out;
}

export function tagResult(platform: string, url: string, brand: string, linked: string | string[] | null, text = "", domain = "", officialHandles: Set<string> = new Set()): ResultTag {
  const linkedUrls = linked === null ? [] : Array.isArray(linked) ? linked : [linked];
  let kind: Kind = "page";
  let handle: string | null = null;
  try {
    ({ kind, handle } = kindFor(platform, new URL(url)));
  } catch {}
  const h = handle ? squash(decodeURIComponent(handle)) : "";
  const matchesBrand = brandForms(brand, domain).some((b) => handleMatches(h, b));
  const n = normUrl(url);
  const official = linkedUrls.some((l) => {
    const ln = normUrl(l);
    if (n === ln || n.startsWith(ln + "/")) return true;
    const fb = platform === "Facebook" ? facebookId(l) : null;
    return fb !== null && facebookId(url) === fb;
  });
  const mentionsSite = Boolean(domain) && text.toLowerCase().includes(domain.toLowerCase().replace(/^www\./, ""));
  const sameHandle = Boolean(h) && h.length >= 3 && officialHandles.has(h) && (kind === "profile");
  return { kind, label: LABEL[kind], handle, official, matchesBrand, mentionsSite, sameHandle };
}

/** Platform status from what the site links to and what search found. */
// likely   = a profile whose name matches AND (its result mentions the website address OR it uses the
//            exact handle of a profile the website links to, e.g. @openai everywhere)
// possible = name matches only (could be another business with the same name)
export const isProfile = (t: ResultTag) => t.kind === "profile" || t.kind === "community";
export function platformStatus(linked: boolean, all: ResultTag[] | null): Status {
  if (linked) return "official";
  if (all === null) return "unknown";
  const tags = all.filter((t) => t.checked !== "other"); // profile page links to a different website: not yours
  // Communities (subreddits, groups) are often fan-run, so they can only be a possible match.
  if (tags.some((t) => t.kind === "profile" && t.matchesBrand && (t.mentionsSite || t.sameHandle))) return "likely";
  if (tags.some((t) => isProfile(t) && t.matchesBrand)) return "possible";
  return all.length ? "mentions" : "none";
}

/* ---------- report analysis (shared by the page and the accuracy tests) ---------- */

export type Profile = { platform: string; url: string };
export type Identity = { name: string; domain: string; sourceUrl: string; profiles: Profile[] };
export type Mention = { title: string; url: string; snippet: string; source: string; via?: string[] };
export type Overview = { siteFound: boolean; siteRank: number | null; profiles: { platform: string; url: string }[] };
export type PlatformResult = { platform: string; query: string; results: Mention[]; error?: boolean };
export type Mentions =
  | { status: "loading" }
  | { status: "off" }
  | { status: "error"; message: string }
  | { status: "done"; brand: string; byPlatform: Record<string, PlatformResult>; overview?: Overview };

export const PLATFORMS = [
  { name: "YouTube", domain: "youtube.com", sym: "▶" },
  { name: "Instagram", domain: "instagram.com", sym: "◎" },
  { name: "Facebook", domain: "facebook.com", sym: "f" },
  { name: "LinkedIn", domain: "linkedin.com", sym: "in" },
  { name: "X", domain: "x.com", sym: "𝕏" },
  { name: "Reddit", domain: "reddit.com", sym: "r/" },
  { name: "Quora", domain: "quora.com", sym: "Q" },
  { name: "Threads", domain: "threads.net", sym: "@" },
] as const;

/** Result of opening a profile page (see lib/discover/verify.ts). */
export type ProfileCheck = { url: string; ok: boolean; channelId?: string | null; website?: string | null; mentionsSite?: boolean; name?: string };

export type Row = {
  name: string;
  domain: string;
  sym: string;
  linked: Profile | null;
  result: PlatformResult | null; // null = not searched / failed
  tagged: { m: Mention; t: ResultTag }[] | null;
  status: Status;
  bestProfile: { m: Mention; t: ResultTag } | null;
  /** On a platform the site links to: other profiles using the brand name (old accounts, copies, look-alikes). */
  extras: { m: Mention; t: ResultTag }[];
};

/** Readable address: no protocol/www/m., no tracking query (except YouTube video ids), no trailing slash. */
export const shortUrl = (u: string) => {
  let x = u.replace(/^https?:\/\/(www\.|m\.|mobile\.)?/, "");
  if (/profile\.php\?/.test(x)) x = x.replace(/(\?id=\d+).*$/, "$1"); // Facebook page number is the address
  else if (!/youtube\.com\/watch/.test(x)) x = x.replace(/\?.*$/, "");
  return x.replace(/\/$/, "");
};

/** Order: linked profile, then confirmed profile, then name-matching profile, then other profiles, then content. */
export const score = (t: ResultTag) => (t.official ? 8 : 0) + (isProfile(t) && t.matchesBrand ? (t.mentionsSite || t.sameHandle ? 4 : 2) : 0) + (isProfile(t) ? 1 : 0);

export function buildRows(identity: Identity, mentions: Mentions, brand: string, checks: Record<string, ProfileCheck> = {}): Row[] {
  const own = identity.domain.toLowerCase().replace(/^www\./, "");
  const profiles = identity.profiles.filter((p) => {
    try {
      const host = new URL(p.url).hostname.toLowerCase().replace(/^www\./, "");
      if (host === own || host.endsWith(`.${own}`)) return false; // the site's own pages (e.g. youtube.com auditing itself)
    } catch {
      return false;
    }
    return isProfileUrl(p.platform, p.url); // ignore links to single videos/posts
  });
  const linkedAll = (name: string) => profiles.filter((x) => x.platform === name).map((x) => x.url);
  const officialHandles = handlesOf(profiles);
  const beside = besideSiteKeys(mentions);
  // Handles confirmed on other platforms (profile mentions your website / opened and links to it) count like linked ones.
  if (mentions.status === "done") {
    for (const p of PLATFORMS) {
      for (const m of mentions.byPlatform[p.name]?.results ?? []) {
        const t = markBeside(applyCheck({ m, t: tagResult(p.name, m.url, brand, linkedAll(p.name), `${m.title} ${m.snippet}`, identity.domain) }, checks, linkedAll(p.name)), beside).t;
        if (t.kind === "profile" && t.matchesBrand && (t.mentionsSite || t.checked === "yours") && t.handle) officialHandles.add(squash(decodeURIComponent(t.handle)));
      }
    }
  }
  // The exact brand name as the handle on 3+ platforms is strong evidence those accounts belong together
  // (only for names of 5+ characters, so short generic names don't qualify; communities never count).
  const exact = squash(brand);
  if (exact.length >= 5 && mentions.status === "done") {
    const withExact = PLATFORMS.filter((p) =>
      (mentions.byPlatform[p.name]?.results ?? []).some((m) => {
        const t = tagResult(p.name, m.url, brand, null);
        return t.kind === "profile" && t.handle !== null && squash(decodeURIComponent(t.handle)) === exact && checks[m.url]?.website === undefined;
      }),
    );
    if (withExact.length >= 3) officialHandles.add(exact);
  }
  return PLATFORMS.map((p) => {
    const urls = linkedAll(p.name);
    const link = profiles.find((x) => x.platform === p.name) ?? null;
    const result = mentions.status === "done" ? mentions.byPlatform[p.name] ?? null : null;
    const ok = result && !result.error ? result : null;
    const tagged = ok
      ? ok.results
          .map((m) => ({ m, t: tagResult(p.name, m.url, brand, urls, `${m.title} ${m.snippet}`, identity.domain, officialHandles) }))
          .map((x) => markBeside(applyCheck(x, checks, urls), beside))
          .sort((a, b) => score(b.t) - score(a.t))
      : null;
    const bestProfile = tagged?.find((x) => x.t.official && x.t.kind === "profile") ?? tagged?.find((x) => x.t.official) ?? tagged?.find((x) => x.t.kind === "profile" && x.t.matchesBrand && (x.t.mentionsSite || x.t.sameHandle)) ?? tagged?.find((x) => isProfile(x.t) && x.t.matchesBrand && x.t.checked !== "other") ?? null;
    const linkedKeys = new Set(urls.map((u) => lastSegment(u)));
    const extras = link && tagged
      ? tagged.filter((x, i, all) => {
          if (x.t.kind !== "profile" || !x.t.matchesBrand || x.t.official) return false;
          const h = x.t.handle ? squash(decodeURIComponent(x.t.handle)) : "";
          if (h && linkedKeys.has(h)) return false; // same account as the linked one
          // one entry per account (youtube.com/@x and youtube.com/@x/shorts)
          return all.findIndex((y) => y.t.kind === "profile" && y.t.handle && squash(decodeURIComponent(y.t.handle)) === h) === i;
        })
      : [];
    return { ...p, linked: link, result: ok, tagged, status: platformStatus(Boolean(link), tagged ? tagged.map((x) => x.t) : null), bestProfile, extras };
  });
}

export type Action = { level: "high" | "medium" | "low"; title: string; detail: string };

export function buildActions(rows: Row[], brand: string): Action[] {
  const out: Action[] = [];
  const none: string[] = [];
  for (const r of rows) {
    if (r.status === "likely" && r.bestProfile) {
      const why = r.bestProfile.t.checked === "yours" ? "links to your website (we checked the profile)" : r.bestProfile.t.besideSite ? "appears next to your website when people search your name on Google" : r.bestProfile.t.mentionsSite ? "mentions your website" : "uses the same handle as your other profiles";
      out.push({ level: "high", title: `Link your ${r.name} profile on your website`, detail: `${shortUrl(r.bestProfile.m.url)} ${why}, but your website doesn't link to it. Add it to your footer or contact page so Google and visitors can connect the two.` });
    }
    if (r.status === "possible" && r.bestProfile) {
      out.push({ level: "medium", title: `Is ${shortUrl(r.bestProfile.m.url)} yours?`, detail: `This ${r.name} profile uses the name “${brand}”, but nothing on it points to your website. If it's yours, link it from your site and add your website to its bio. If it isn't, another business uses your name on ${r.name}, which can confuse customers.` });
    }
    for (const x of r.extras) {
      const channelLink = r.name === "YouTube" && /\/channel\//.test(r.linked?.url ?? "");
      out.push(
        channelLink
          ? { level: "medium", title: `Is ${shortUrl(x.m.url)} the same channel you link to?`, detail: `Your site links to a YouTube channel by its ID (${shortUrl(r.linked!.url)}). We also found ${shortUrl(x.m.url)} (“${x.m.title.slice(0, 70)}”). If it's the same channel under its @handle, link the @handle address instead, because it's easier to recognise. If it's a second channel, decide which one is your main channel.` }
          : x.t.checked === "other"
            ? { level: "low", title: `Another business uses your name on ${r.name}: ${shortUrl(x.m.url)}`, detail: `We opened ${shortUrl(x.m.url)} and it links to ${shortUrl(x.t.otherSite ?? "")}, not your website, so it isn't yours. Customers searching “${brand}” on ${r.name} may find it, so make sure your own profile clearly shows your website.` }
            : { level: "medium", title: `Another ${r.name} account uses your name: ${shortUrl(x.m.url)}`, detail: `Your site links to ${shortUrl(r.linked!.url)}, but we also found ${shortUrl(x.m.url)} (“${x.m.title.slice(0, 70)}”). If it's an old or second account of yours, keep one main profile and point the other to it. If it isn't yours, someone else is using your name on ${r.name}.` },
      );
    }
    if (r.linked && r.tagged && !r.extras.length && !r.tagged.some((x) => x.t.official || (x.t.kind === "profile" && x.t.matchesBrand && (x.t.mentionsSite || x.t.sameHandle)))) {
      out.push({ level: "medium", title: `Google doesn't show your linked ${r.name} profile`, detail: `Your site links to ${shortUrl(r.linked.url)}, but it wasn't in the top results for “${brand}” on ${r.name}. Make sure the profile name and bio include “${brand}” and a link back to your website.` });
    }
    if (r.status === "mentions") {
      out.push({ level: "low", title: `People mention you on ${r.name}, but no profile was found`, detail: `There are results for “${brand}” on ${r.name}, but none is a profile with your name. If you have an account, put “${brand}” in its name or handle so these searches lead to you.` });
    }
    if (r.status === "none") none.push(r.name);
  }
  if (none.length) {
    out.push({ level: "low", title: `Nothing found on ${none.join(", ")}`, detail: `No results for “${brand}” on ${none.length === 1 ? "this platform" : "these platforms"}. If you use ${none.length === 1 ? "it" : "them"}, make sure the profile name includes your brand. If not, focus on the platforms your customers use.` });
  }
  const order = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => order[a.level] - order[b.level]);
}

/** Accounts Google listed in the top results for the brand name, next to the brand's own website. */
function besideSiteKeys(mentions: Mentions) {
  if (mentions.status !== "done" || !mentions.overview?.siteFound) return new Set<string>();
  return new Set(mentions.overview.profiles.map((p) => normUrl(p.url)));
}
function markBeside(x: { m: Mention; t: ResultTag }, keys: Set<string>) {
  if (!keys.has(normUrl(x.m.url)) || x.t.kind !== "profile") return x;
  return { m: x.m, t: { ...x.t, besideSite: true, mentionsSite: true } };
}

function applyCheck(x: { m: Mention; t: ResultTag }, checks: Record<string, ProfileCheck>, linkedUrls: string[]) {
  const v = checks[x.m.url];
  if (!v?.ok) return x;
  const t = { ...x.t };
  const linkedIds = new Set(linkedUrls.map((u) => checks[u]?.channelId).filter(Boolean));
  if (v.channelId && linkedIds.has(v.channelId)) {
    t.official = true;
    t.sameChannel = true;
  }
  if (v.mentionsSite) {
    t.mentionsSite = true;
    t.checked = "yours";
  } else if (v.website) {
    t.checked = "other";
    t.otherSite = v.website;
  }
  return { m: x.m, t };
}

/** YouTube channels worth opening to confirm: the linked channel(s) and channels found in the search. */
export function checkTargets(identity: Identity, mentions: Mentions, brand: string): { platform: string; url: string }[] {
  if (mentions.status !== "done") return [];
  const out: { platform: string; url: string }[] = [];
  const seen = new Set<string>();
  const add = (platform: string, url: string) => {
    const k = normUrl(url);
    if (seen.has(k) || out.length >= 8) return;
    seen.add(k);
    out.push({ platform, url });
  };
  for (const name of ["YouTube"]) {
    const links = identity.profiles.filter((p) => p.platform === name && isProfileUrl(name, p.url)).map((p) => p.url);
    const results = mentions.byPlatform[name]?.results ?? [];
    const candidates = results.filter((m) => {
      const t = tagResult(name, m.url, brand, links, "", identity.domain);
      // YouTube with a linked channel: open every channel found, because one channel has several addresses
      // (/@handle, /channel/UC…, /c/name, /user/name); otherwise only profiles using the brand name.
      return t.kind === "profile" && !t.official && (t.matchesBrand || (name === "YouTube" && links.length > 0));
    });
    if (name === "YouTube" && candidates.length) links.slice(0, 2).forEach((u) => add(name, u));
    candidates.slice(0, 3).forEach((m) => add(name, m.url));
  }
  return out;
}

/** Brand presence: platforms where an account using your name exists. Confirmed = official or likely yours;
 *  to verify = a profile using your name with no proof yet (communities and accounts linking elsewhere don't count). */
export function presenceOf(rows: Row[]) {
  const confirmed = rows.filter((r) => r.status === "official" || r.status === "likely").length;
  const toVerify = rows.filter((r) => r.status === "possible" && r.bestProfile?.t.kind === "profile").length;
  return { confirmed, toVerify, total: confirmed + toVerify };
}

/** A search result as the search API returns it. */
export type Organic = { title?: string; link?: string; snippet?: string; displayedLink?: string };

/** Serper sometimes returns Google's redirect (google.com/goto?url=…) instead of the real address. The display line
 *  ("https://www.youtube.com › @digifortex") still shows it, so rebuild the address from there when it's complete. */
export function realLink(r: Organic): string | null {
  const link = r.link ?? "";
  if (!/^https?:\/\//.test(link)) return null;
  let h = "";
  try {
    h = new URL(link).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!/(^|\.)google\.[a-z.]+$/.test(h) || !/^\/(goto|url)/.test(new URL(link).pathname)) return link;
  const shown = (r.displayedLink ?? "").trim();
  const m = shown.match(/^(?:https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,})((?:\s*›\s*[^›]+)*)$/i);
  if (!m) return null;
  const segs = m[2].split("›").map((x) => x.trim()).filter(Boolean);
  if (segs.some((x) => /\.\.\.|…|\s/.test(x))) return null; // shortened: the exact page is unknown
  return `https://${m[1].toLowerCase()}/${segs.join("/")}`;
}
