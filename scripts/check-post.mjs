#!/usr/bin/env node
// Checks a blog post file with the SAME rules as the /admin editor (lib/cms/validate.ts + lib/cms/seo.ts), so every
// agent or person gets an identical verdict before publishing.
//
//   npm run check:post -- content/blog/<slug>.md          human-readable report
//   npm run check:post -- content/blog/<slug>.md --json   machine-readable
//
// Exit code: 0 = no errors (warnings allowed), 1 = errors (must be fixed or explicitly approved), 2 = usage problem.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
let file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Usage: npm run check:post -- content/blog/<slug>.md [--json]");
  process.exit(2);
}
if (!file.endsWith(".md")) file = path.join("content/blog", `${file}.md`);
const abs = path.resolve(root, file);
if (!fs.existsSync(abs)) {
  console.error(`File not found: ${file}`);
  process.exit(2);
}

// Bundle the editor's own validation code (TypeScript) and load it.
const out = path.join(os.tmpdir(), `effix-check-post-${process.pid}.mjs`);
await build({
  stdin: {
    contents: 'export { parsePost } from "./lib/cms/post.ts"; export { validate, all, FIELD_LABEL, LIMITS } from "./lib/cms/validate.ts"; export { analyse, metaTitleOf } from "./lib/cms/seo.ts";',
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: out,
  logLevel: "silent",
});
const { parsePost, validate, all, FIELD_LABEL, LIMITS, analyse, metaTitleOf } = await import(pathToFileURL(out).href);
fs.rmSync(out, { force: true });

const slugFromName = path.basename(abs, ".md");
const post = parsePost(fs.readFileSync(abs, "utf8"), slugFromName);
const postsDir = path.join(root, "content/blog");
const otherSlugs = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md") && !f.startsWith("_") && path.join(postsDir, f) !== abs).map((f) => f.replace(/\.md$/, ""));
const schedule = !post.draft && Boolean(post.date) && new Date(post.date).getTime() > Date.now();
const issues = validate(post, { otherSlugs, schedule });
const rows = all(issues);
const itemRows = [
  ...Object.entries(issues.faqItems ?? {}).flatMap(([i, list]) => list.map((x) => ({ field: `faq #${Number(i) + 1}`, ...x }))),
  ...Object.entries(issues.takeawayItems ?? {}).flatMap(([i, list]) => list.map((x) => ({ field: `takeaway #${Number(i) + 1}`, ...x }))),
  ...Object.entries(issues.sourceItems ?? {}).flatMap(([i, list]) => list.map((x) => ({ field: `source #${Number(i) + 1}`, ...x }))),
];
const seo = analyse(post);
const lengths = {
  title: { chars: post.title.trim().length, limit: LIMITS.title },
  metaTitle: { chars: metaTitleOf(post).length, limit: LIMITS.metaTitleMax, set: Boolean(post.metaTitle.trim()) },
  description: { chars: post.description.trim().length, min: LIMITS.descMin, limit: LIMITS.descMax },
  slug: { chars: post.slug.length, limit: LIMITS.slug },
};
const errors = rows.filter((r) => r.level === "error").length + itemRows.filter((r) => r.level === "error").length;
const warnings = rows.filter((r) => r.level === "warn").length + itemRows.filter((r) => r.level === "warn").length;

if (asJson) {
  console.log(JSON.stringify({ file, slug: post.slug, draft: post.draft, errors, warnings, issues: [...rows.map((r) => ({ ...r, label: FIELD_LABEL[r.field] })), ...itemRows], lengths, seo: { score: seo.score, words: seo.words, checks: seo.checks } }, null, 2));
} else {
  console.log(`\n${file}  (${post.draft ? "draft" : schedule ? "scheduled" : "published"})`);
  console.log(`Title ${lengths.title.chars}/${LIMITS.title} · Meta title ${lengths.metaTitle.chars}/${LIMITS.metaTitleMax}${lengths.metaTitle.set ? "" : " (not set, uses title)"} · Meta description ${lengths.description.chars} (${LIMITS.descMin}-${LIMITS.descMax}) · ${seo.words} words`);
  console.log(`\n${errors} error(s), ${warnings} warning(s)`);
  for (const r of rows) console.log(`  ${r.level === "error" ? "✕ ERROR" : "! WARN "}  ${FIELD_LABEL[r.field]}: ${r.text}`);
  for (const r of itemRows) console.log(`  ${r.level === "error" ? "✕ ERROR" : "! WARN "}  ${r.field}: ${r.text}`);
  console.log(`\nSEO score ${seo.score}/100`);
  for (const c of seo.checks.filter((c) => c.status !== "good")) console.log(`  ${c.status === "bad" ? "✕" : "!"} ${c.label}: ${c.tip}`);
  console.log("");
}
process.exit(errors ? 1 : 0);
