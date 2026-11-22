// SEO checklist for the editor (the "Rank Math / Yoast" box): checks the post against the focus keyword and basic
// on-page rules, so problems are visible before publishing. Pure functions; runs in the browser.
import type { EditorPost } from "./post";

export type Check = { label: string; status: "good" | "ok" | "bad"; tip: string };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const has = (text: string, kw: string) => Boolean(kw) && norm(text).includes(norm(kw));

export const wordsIn = (md: string) =>
  md.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#>*_`|~-]/g, " ").split(/\s+/).filter(Boolean).length;

export const metaTitleOf = (p: EditorPost) => p.metaTitle.trim() || (p.title.trim() ? `${p.title.trim()} | Effix Labs` : "");

export function analyse(p: EditorPost): { checks: Check[]; score: number; words: number; minutes: number } {
  const kw = p.focusKeyword.trim();
  const words = wordsIn(p.body);
  const title = metaTitleOf(p);
  const firstPara = p.body.split(/\n\s*\n/).find((b) => b.trim() && !b.trim().startsWith("#") && !b.trim().startsWith("!")) ?? "";
  const subheads = [...p.body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1]);
  const links = [...p.body.matchAll(/\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]).filter((u) => !/\.(png|jpe?g|webp|gif|svg)$/i.test(u));
  const internal = links.filter((u) => u.startsWith("/") || u.includes("effixlabs.in")).length;
  const external = links.filter((u) => /^https?:\/\//.test(u) && !u.includes("effixlabs.in")).length;
  const images = [...p.body.matchAll(/!\[([^\]]*)\]\(/g)].map((m) => m[1]);
  const kwCount = kw ? (norm(p.body).match(new RegExp(`\\b${norm(kw).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) ?? []).length : 0;
  const density = words ? (kwCount * kw.split(/\s+/).length * 100) / words : 0;

  const c: Check[] = [];
  const add = (ok: boolean | "ok", label: string, tip: string) => c.push({ label, status: ok === "ok" ? "ok" : ok ? "good" : "bad", tip });

  if (!kw) c.push({ label: "Set a focus keyword", status: "bad", tip: "Add the main search phrase this post should rank for." });
  else {
    add(has(p.title, kw), "Focus keyword in the title", "Use the keyword in the H1 title, ideally near the start.");
    add(has(title, kw), "Focus keyword in the meta title", "Google shows the meta title as the blue link.");
    add(has(p.description, kw), "Focus keyword in the meta description", "Helps Google bold your result for that search.");
    add(has(p.slug.replace(/-/g, " "), kw) || norm(kw).split(" ").every((w) => p.slug.includes(w)), "Focus keyword in the URL slug", "Keep the slug short and include the keyword.");
    add(has(firstPara, kw), "Focus keyword in the first paragraph", "Answer the search early: mention the keyword in the opening lines.");
    add(subheads.some((h) => has(h, kw)), "Focus keyword in a subheading", "Use the keyword (or a close variation) in at least one H2/H3.");
    add(density === 0 ? false : density > 3 ? "ok" : true, `Keyword used ${kwCount} time${kwCount === 1 ? "" : "s"}`, density > 3 ? "That may be too often; write naturally." : "Use it naturally a few times through the post.");
  }
  add(title.length >= 30 && title.length <= 60 ? true : title.length > 0 && title.length <= 70 ? "ok" : false, `Meta title length: ${title.length} characters`, "Aim for 50–60 characters so it isn't cut off in Google.");
  const d = p.description.trim().length;
  add(d >= 120 && d <= 158 ? true : d >= 70 && d <= 170 ? "ok" : false, `Meta description length: ${d} characters`, "Aim for 140–155 characters.");
  add(words >= 900 ? true : words >= 500 ? "ok" : false, `Content length: ${words} words`, "In-depth guides usually need 900+ words; cover the topic fully.");
  add(subheads.length >= 3 ? true : subheads.length >= 1 ? "ok" : false, `${subheads.length} subheading${subheads.length === 1 ? "" : "s"}`, "Break the post into clear H2 sections every 200–300 words.");
  add(internal >= 3 ? true : internal >= 1 ? "ok" : false, `${internal} internal link${internal === 1 ? "" : "s"}`, "Link to 3–5 related pages on effixlabs.in (services, tools, other posts).");
  add(external >= 1, `${external} external link${external === 1 ? "" : "s"}`, "Cite at least one trustworthy source, e.g. Google's own documentation.");
  add(Boolean(p.cover) ? (p.coverAlt.trim() ? true : "ok") : "ok", p.cover ? (p.coverAlt.trim() ? "Featured image has alt text" : "Featured image is missing alt text") : "No featured image (a cover will be generated)", "Add a featured image with a short description in the alt text.");
  if (images.length) add(images.every((a) => a.trim()), `${images.filter((a) => a.trim()).length}/${images.length} images have alt text`, "Describe every image in its alt text.");
  add(p.faq.filter((f) => f.q && f.a).length >= 3 ? true : "ok", `${p.faq.filter((f) => f.q && f.a).length} FAQs`, "3–8 FAQs help readers and AI answers (sent to Google as FAQ schema).");

  const pts = c.reduce((s, x) => s + (x.status === "good" ? 1 : x.status === "ok" ? 0.5 : 0), 0);
  return { checks: c, score: Math.round((pts / Math.max(1, c.length)) * 100), words, minutes: Math.max(1, Math.round(words / 220)) };
}
