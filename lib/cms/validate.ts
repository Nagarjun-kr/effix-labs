// Field-by-field validation for the blog editor (like WordPress + Rank Math): every field reports what is wrong
// (error, blocks publishing) or what could be better (warning). Used for the inline messages, the summary at the top
// and the publish check, so they always agree.
import type { EditorPost } from "./post";
import { isSlug } from "./post";
import { wordsIn } from "./seo";

export type Level = "error" | "warn";
export type Issue = { level: Level; text: string };
export type Field =
  | "title" | "slug" | "metaTitle" | "description" | "focusKeyword" | "tags" | "cover" | "coverAlt" | "author" | "date" | "takeaways" | "faq" | "sources" | "body";
export type Issues = Partial<Record<Field, Issue[]>> & { faqItems?: Record<number, Issue[]>; takeawayItems?: Record<number, Issue[]>; sourceItems?: Record<number, Issue[]> };

export const FIELD_LABEL: Record<Field, string> = {
  title: "Title", slug: "URL slug", metaTitle: "Meta title", description: "Meta description", focusKeyword: "Focus keyword", tags: "Tags",
  cover: "Featured image", coverAlt: "Featured image alt text", author: "Author", date: "Publish date", takeaways: "Key takeaways", faq: "FAQs", sources: "Sources", body: "Content",
};

export const LIMITS = { title: 70, slug: 75, metaTitleMin: 30, metaTitleMax: 60, descMin: 120, descMax: 160, alt: 125, tags: 10, takeaways: 5, takeawayLen: 200, faqWords: 60, minWords: 300 } as const;

type Ctx = { otherSlugs: string[]; publishedSlug?: string; schedule: boolean };

export function validate(p: EditorPost, ctx: Ctx): Issues {
  const out: Issues = {};
  const add = (f: Field, level: Level, text: string) => { (out[f] ??= []).push({ level, text }); };

  // title
  const t = p.title.trim();
  if (!t) add("title", "error", "Add a title.");
  else if (t.length > LIMITS.title) add("title", "warn", `Too long: ${t.length} characters. Keep the title under ${LIMITS.title} so it reads well everywhere.`);

  // slug
  if (!p.slug) add("slug", "error", "Add a URL slug.");
  else if (!isSlug(p.slug)) add("slug", "error", "Use only lowercase letters, numbers and single hyphens (no spaces, no hyphen at the start or end).");
  else if (ctx.otherSlugs.includes(p.slug)) add("slug", "error", `Another post already uses “${p.slug}”. Choose a different slug.`);
  else if (p.slug.length > LIMITS.slug) add("slug", "warn", `Long slug (${p.slug.length} characters). Short slugs with the keyword work best.`);
  if (ctx.publishedSlug && p.slug && ctx.publishedSlug !== p.slug) add("slug", "warn", "This post is already live: changing the slug breaks existing links to it.");

  // meta title
  const mt = p.metaTitle.trim();
  if (!mt) add("metaTitle", "warn", t ? `Not set. Google will show: “${t} | Effix Labs”.` : "Not set. Add a title first.");
  else if (mt.length > LIMITS.metaTitleMax) add("metaTitle", "error", `Too long: ${mt.length}/${LIMITS.metaTitleMax} characters. Google cuts off long titles.`);
  else if (mt.length < LIMITS.metaTitleMin) add("metaTitle", "warn", `Too short: ${mt.length} characters. Aim for 50–60.`);

  // meta description
  const d = p.description.trim();
  if (!d) add("description", "error", "Write a meta description. It is shown in Google and on the blog card.");
  else if (d.length > LIMITS.descMax) add("description", "error", `Too long: ${d.length}/${LIMITS.descMax} characters. Google cuts it off.`);
  else if (d.length < LIMITS.descMin) add("description", "warn", `Too short: ${d.length} characters. Aim for 140–155.`);

  // focus keyword
  const kw = p.focusKeyword.trim();
  if (!kw) add("focusKeyword", "warn", "Set the main search phrase this post should rank for.");
  else if (kw.split(/\s+/).length > 5) add("focusKeyword", "warn", "Keep the focus keyword to 5 words or fewer.");

  // tags
  if (p.tags.length > LIMITS.tags) add("tags", "warn", `${p.tags.length} tags. Keep it to ${LIMITS.tags} or fewer.`);

  // featured image
  if (p.cover && !p.coverAlt.trim()) add("coverAlt", "error", "Describe the featured image (alt text) for Google and screen readers.");
  else if (p.coverAlt.trim().length > LIMITS.alt) add("coverAlt", "warn", `Alt text is long (${p.coverAlt.trim().length} characters). Keep it under ${LIMITS.alt}.`);
  if (p.cover && /\s/.test(p.cover)) add("cover", "warn", "The image file name has spaces. Re-upload it so the editor can give it a clean name.");

  // author
  if (!p.author.trim()) add("author", "error", "Add the author's name.");

  // date
  if (ctx.schedule && !p.date) add("date", "error", "Pick a date and time to schedule the post.");
  else if (ctx.schedule && p.date && new Date(p.date).getTime() < Date.now()) add("date", "warn", "This date is in the past, so the post will go live immediately.");

  // takeaways
  const items: Record<number, Issue[]> = {};
  p.takeaways.forEach((x, i) => {
    if (!x.trim()) (items[i] ??= []).push({ level: "error", text: "Empty bullet. Write it or remove it." });
    else if (x.trim().length > LIMITS.takeawayLen) (items[i] ??= []).push({ level: "warn", text: `Long bullet (${x.trim().length} characters). Keep takeaways short.` });
  });
  if (Object.keys(items).length) out.takeawayItems = items;
  if (Object.values(items).flat().some((x) => x.level === "error")) add("takeaways", "error", "Fix or remove the empty takeaway bullets.");
  if (p.takeaways.length > LIMITS.takeaways) add("takeaways", "warn", `${p.takeaways.length} takeaways. 3 is ideal, ${LIMITS.takeaways} at most.`);

  // FAQs
  const faq: Record<number, Issue[]> = {};
  const seen = new Map<string, number>();
  p.faq.forEach((f, i) => {
    const q = f.q.trim(), a = f.a.trim();
    const push = (level: Level, text: string) => (faq[i] ??= []).push({ level, text });
    if (!q) push("error", "Write the question.");
    if (!a) push("error", "Write the answer.");
    if (q && !q.endsWith("?")) push("warn", "Questions should end with “?”.");
    if (a && wordsIn(a) > LIMITS.faqWords) push("warn", `Answer is ${wordsIn(a)} words. Keep it to 40–60 words.`);
    const key = q.toLowerCase();
    if (q && seen.has(key)) push("error", `Same question as Q${(seen.get(key) ?? 0) + 1}.`);
    else if (q) seen.set(key, i);
  });
  if (Object.keys(faq).length) out.faqItems = faq;
  if (Object.values(faq).flat().some((x) => x.level === "error")) add("faq", "error", "Some FAQs are incomplete or repeated.");

  // sources
  const src: Record<number, Issue[]> = {};
  p.sources.forEach((x, i) => {
    const push = (level: Level, text: string) => (src[i] ??= []).push({ level, text });
    if (!x.label.trim()) push("error", "Add the source name (e.g. Google Search Central: Page indexing report).");
    if (!x.url.trim()) push("error", "Add the source link.");
    else if (!/^https:\/\/[^\s.]+\.[^\s]+$/.test(x.url.trim())) push("error", "Use a full https:// link.");
  });
  if (Object.keys(src).length) out.sourceItems = src;
  if (Object.values(src).flat().some((x) => x.level === "error")) add("sources", "error", "Some sources are missing a name or a valid link.");

  // content
  const words = wordsIn(p.body);
  if (!p.body.trim()) add("body", "error", "The post has no content yet.");
  else if (words < LIMITS.minWords) add("body", "warn", `Only ${words} words. Guides usually need 300+ (900+ to compete).`);
  const noAlt = [...p.body.matchAll(/!\[([^\]]*)\]\(([^)]*)\)/g)].filter((m) => !m[1].trim()).length;
  if (noAlt) add("body", "error", `${noAlt} image${noAlt > 1 ? "s have" : " has"} no alt text. Click the image and add a description.`);
  const emptyLinks = [...p.body.matchAll(/(?<!!)\[[^\]]+\]\(\s*\)/g)].length;
  if (emptyLinks) add("body", "error", `${emptyLinks} link${emptyLinks > 1 ? "s have" : " has"} no address.`);
  if (/^#\s/m.test(p.body)) add("body", "warn", "The content has a top-level heading (H1). The title is already the H1; use Heading (H2) instead.");

  return out;
}

export const all = (issues: Issues) =>
  (Object.keys(FIELD_LABEL) as Field[]).flatMap((f) => (issues[f] ?? []).map((i) => ({ field: f, ...i })));

/** Saving a draft only needs a title and a usable, unique slug. */
export const draftBlockers = (issues: Issues) => all(issues).filter((i) => i.level === "error" && (i.field === "title" || i.field === "slug"));
