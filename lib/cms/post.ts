// Blog editor: the post model and its file format. A post is content/blog/<slug>.md: YAML front matter + Markdown,
// the same format lib/blog.ts reads when the site is built. Runs in the browser (no Node APIs).
import yaml from "js-yaml";

export type Faq = { q: string; a: string };
export type Source = { label: string; url: string };
export type EditorPost = {
  title: string;
  slug: string;
  metaTitle: string;
  description: string;
  focusKeyword: string;
  category: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  author: string;
  date: string; // ISO; empty = publish now
  updated: string;
  draft: boolean;
  takeaways: string[];
  faq: Faq[];
  sources: Source[]; // shown as "Sources reviewed <date>: …" at the end of the post
  body: string; // Markdown
};

export const emptyPost = (): EditorPost => ({
  title: "",
  slug: "",
  metaTitle: "",
  description: "",
  focusKeyword: "",
  category: "seo-aeo",
  tags: [],
  cover: "",
  coverAlt: "",
  author: "Nagarjun",
  date: "",
  updated: "",
  draft: true,
  takeaways: [],
  faq: [],
  sources: [],
  body: "",
});

/** "Google Crawled but Not Indexed?" -> "google-crawled-but-not-indexed" */
export const toSlug = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/g, "");

export const isSlug = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : typeof v === "string" ? v : "");
const strs = (v: unknown) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);

export function parsePost(file: string, fallbackSlug = ""): EditorPost {
  const m = file.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const data = (m ? (yaml.load(m[1]) as Record<string, unknown>) : {}) ?? {};
  const body = m ? m[2] : file;
  return {
    ...emptyPost(),
    title: String(data.title ?? ""),
    slug: String(data.slug ?? fallbackSlug).replace(/^\/+|\/+$/g, ""),
    metaTitle: String(data.meta_title ?? ""),
    description: String(data.description ?? ""),
    focusKeyword: String(data.focus_keyword ?? ""),
    category: String(data.category ?? "seo-aeo"),
    tags: strs(data.tags),
    cover: String(data.cover ?? ""),
    coverAlt: String(data.cover_alt ?? ""),
    author: String(data.author ?? "Nagarjun"),
    date: iso(data.date),
    updated: iso(data.updated),
    draft: data.draft === true,
    takeaways: strs(data.takeaways),
    faq: Array.isArray(data.faq) ? data.faq.filter((f) => f && typeof f === "object").map((f) => ({ q: String((f as Faq).q ?? ""), a: String((f as Faq).a ?? "") })) : [],
    sources: Array.isArray(data.sources) ? data.sources.filter((x) => x && typeof x === "object").map((x) => ({ label: String((x as Source).label ?? ""), url: String((x as Source).url ?? "") })) : [],
    body: body.replace(/^\n+/, ""),
  };
}

/** Serialise for content/blog/<slug>.md. Empty optional fields are left out. */
export function stringifyPost(p: EditorPost): string {
  const data: Record<string, unknown> = {
    title: p.title.trim(),
    slug: p.slug,
    ...(p.metaTitle.trim() ? { meta_title: p.metaTitle.trim() } : {}),
    description: p.description.trim(),
    ...(p.focusKeyword.trim() ? { focus_keyword: p.focusKeyword.trim() } : {}),
    category: p.category,
    ...(p.tags.length ? { tags: p.tags } : {}),
    ...(p.cover ? { cover: p.cover } : {}),
    ...(p.cover && p.coverAlt.trim() ? { cover_alt: p.coverAlt.trim() } : {}),
    author: p.author.trim() || "Nagarjun",
    date: p.date || new Date().toISOString(),
    ...(p.updated ? { updated: p.updated } : {}),
    draft: p.draft,
    ...(p.takeaways.filter((t) => t.trim()).length ? { takeaways: p.takeaways.map((t) => t.trim()).filter(Boolean) } : {}),
    ...(p.faq.filter((f) => f.q.trim() && f.a.trim()).length ? { faq: p.faq.filter((f) => f.q.trim() && f.a.trim()).map((f) => ({ q: f.q.trim(), a: f.a.trim() })) } : {}),
    ...(p.sources.filter((x) => x.label.trim() && x.url.trim()).length ? { sources: p.sources.filter((x) => x.label.trim() && x.url.trim()).map((x) => ({ label: x.label.trim(), url: x.url.trim() })) } : {}),
  };
  const front = yaml.dump(data, { lineWidth: -1, quotingType: '"', forceQuotes: false, noRefs: true });
  return `---\n${front}---\n\n${p.body.trim()}\n`;
}

export type Status = "draft" | "scheduled" | "published";
export const statusOf = (p: Pick<EditorPost, "draft" | "date">): Status =>
  p.draft ? "draft" : p.date && new Date(p.date).getTime() > Date.now() ? "scheduled" : "published";
