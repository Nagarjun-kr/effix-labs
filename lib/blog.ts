// Blog: posts are Markdown files in content/blog/<slug>.md with a front-matter header (see content/blog/_template.md).
// Read at build time. A post is published when `draft` is not true and its `date` has arrived; future-dated posts stay
// hidden until the daily rebuild after that date (scheduled publishing).
import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { render, type Heading } from "./blog-render";
import { SITE_URL } from "./site";

const DIR = path.join(process.cwd(), "content", "blog");

export { CATEGORIES, categoryOf, type CategorySlug } from "./blog-categories";
import { CATEGORIES, type CategorySlug } from "./blog-categories";

export type { Heading };
export type Faq = { q: string; a: string };
export type Source = { label: string; url: string };
export type PostMeta = {
  slug: string;
  title: string;
  metaTitle?: string; // <title> for Google; defaults to "<title> | Effix Labs"
  description: string;
  date: string; // ISO
  updated?: string;
  category: CategorySlug;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  author: string;
  minutes: number;
  featured: boolean;
};
export type Post = PostMeta & { html: string; headings: Heading[]; takeaways: string[]; faq: Faq[]; sources: Source[] };

const toISO = (v: unknown) => (v instanceof Date ? v.toISOString() : typeof v === "string" && v ? new Date(v).toISOString() : "");

function read(file: string, dir = DIR): Post | null {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.date) return null;
  const slug = (typeof data.slug === "string" && data.slug.replace(/^\/+|\/+$/g, "")) || file.replace(/\.md$/, "");
  const { html, headings } = render(content);
  const words = content.replace(/[#>*_`\-[\]()!|]/g, " ").split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(data.title),
    metaTitle: data.meta_title ? String(data.meta_title) : undefined,
    description: String(data.description ?? ""),
    date: toISO(data.date),
    updated: toISO(data.updated) || undefined,
    category: CATEGORIES.some((c) => c.slug === data.category) ? data.category : "seo-aeo",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    coverAlt: data.cover_alt ? String(data.cover_alt) : undefined,
    author: String(data.author ?? "Nagarjun"),
    minutes: Math.max(1, Math.round(words / 220)),
    featured: data.featured === true,
    html,
    headings,
    takeaways: Array.isArray(data.takeaways) ? data.takeaways.map(String) : [],
    sources: Array.isArray(data.sources) ? data.sources.filter((x) => x && x.label && /^https?:\/\//.test(String(x.url))).map((x) => ({ label: String(x.label), url: String(x.url) })) : [],
    faq: Array.isArray(data.faq) ? data.faq.filter((f) => f && f.q && f.a).map((f) => ({ q: String(f.q), a: String(f.a) })) : [],
    // draft handled by the caller
    ...(data.draft === true ? { draft: true } : {}),
  } as Post;
}

let cache: Post[] | null = null;
/** Published posts, newest first. */
export function getPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const now = Date.now();
  const list = (dir: string) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_")).map((f) => read(f, dir)) : []);
  const posts = list(DIR)
    .filter((p): p is Post => Boolean(p) && !(p as Post & { draft?: boolean }).draft && new Date(p!.date).getTime() <= now)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  cache = posts;
  return posts;
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug) ?? null;

/** Posts that share the same category or at least one tag (same-category first). */
export function relatedPosts(post: Post, n = 3) {
  const tags = new Set(post.tags.map((t) => t.toLowerCase()));
  const others = getPosts().filter((p) => p.slug !== post.slug);
  const matches = others.filter((p) => p.category === post.category || p.tags.some((t) => tags.has(t.toLowerCase())));
  return [...matches.filter((p) => p.category === post.category), ...matches.filter((p) => p.category !== post.category)].slice(0, n);
}

export const postUrl = (slug: string) => `${SITE_URL}/blog/${slug}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
