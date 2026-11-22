# Blog workflow (for every AI agent and developer)

This is the single source of truth for creating, checking and publishing posts on **effixlabs.in/blog**.
It applies to any agent (Claude, Codex, Cursor, Copilot, …) and to people. If anything here disagrees with
your own habits, follow this file.

The owner publishes in one of two ways, and both must produce identical results:

- **Workflow A: the owner gives you a document** (PDF, Google Doc or text in the brief format below) and asks you to
  fill the fields and publish.
- **Workflow B: the owner uses the editor** at `/admin` and fills the fields by hand.

---

## 1. How publishing works

```
content/blog/<slug>.md  ──push to main──▶  GitHub Action (.github/workflows/deploy.yml)
public/images/blog/*                       builds the static site (next build → out/)
                                           and force-pushes it to the `deploy` branch ──▶ MilesWeb serves it
```

- A post is **one Markdown file**: `content/blog/<slug>.md` (YAML front matter + Markdown body).
- Images live in `public/images/blog/` and are referenced as `/images/blog/<file>`.
- A post is **live** when `draft` is `false` **and** its `date` has arrived. Future dates are published by the daily
  rebuild at 06:00 IST (cron in the workflow).
- The editor at `/admin` writes the same files: **local mode** (only in `next dev`) writes to disk; **GitHub mode**
  commits through the GitHub API (login via the Cloudflare Worker `/auth`, `/callback`).
- Rendering: `lib/blog.ts` (read posts), `lib/blog-render.ts` (Markdown → HTML), `app/blog/**` (pages and styles).
  The page template (header, featured-image card, reading column, tables, FAQ, sources, footer line, contact form)
  is automatic. **Do not add layout or styling inside a post.**

---

## 2. Post file format

```yaml
---
title: "The H1 title readers see"                     # required
slug: lowercase-words-with-hyphens                     # required, unique, = file name
meta_title: "Title shown in Google | Effix Labs"       # optional; defaults to "<title> | Effix Labs"
description: "Meta description, also the blog card."   # required to publish
focus_keyword: "main search phrase"                    # not shown on the site; used by the SEO checks
category: seo-aeo                                      # google-business-profile | seo-aeo | reddit-communities | content | websites
tags: ["secondary keyword", "another keyword"]
cover: /images/blog/<slug>-cover.webp                  # optional featured image
cover_alt: "What the image shows"                      # required whenever cover is set
author: Nagarjun
date: "2026-11-22T09:00:00Z"                           # ISO 8601 with time zone
updated: "2026-12-01T09:00:00Z"                        # optional; only for real updates
draft: false                                           # true = saved but never shown
takeaways: ["Short bullet", "Short bullet"]            # optional, shown in a box at the top
faq:                                                   # optional; rendered at the end + FAQPage schema
  - q: "A question?"
    a: "A 40–60 word answer."
sources:                                               # optional; "Sources reviewed <date>: …" line
  - label: "Google Search Central: Page indexing report"
    url: "https://support.google.com/webmasters/answer/7440203"
---
```

A blank template is in `docs/blog-post-template.md`.

### Body (Markdown) conventions

| Element | How to write it | Notes |
|---|---|---|
| Intro | 2–3 short paragraphs, the direct answer early | No heading before the intro |
| Sections | `## Heading` (H2), `### Sub-heading` (H3) | **Never use `#` (H1)**: the title is the H1. Headings render without underlines. |
| Table | GitHub Markdown table with a header row | The paragraph **right after** a table renders as a small caption |
| Labelled paragraph | `**What to test:** text` | Bold lead-in |
| Callout box | `> **Tip:** text` (also `Note:`, `Warning:`, `Example:`) | Plain `> text` is a pull quote |
| Links | Internal: `/services/seo-aeo-services`, `/#audit`, `/seo-audit-tool/`, `/about`, `/casestudy/`; external: full `https://` | External links open in a new tab automatically |
| Images in the body | `![alt text](/images/blog/file.webp)` | Alt text is required |
| Code | `` `inline` `` or fenced blocks | |

FAQs belong in the `faq` field, **not** in the body (otherwise they appear twice).

---

## 3. Validation rules (identical to the editor)

The rules live in **`lib/cms/validate.ts`** and **`lib/cms/seo.ts`**. Run them, don't re-implement them:

```bash
npm run check:post -- content/blog/<slug>.md          # report
npm run check:post -- content/blog/<slug>.md --json   # machine-readable
```

Exit code `0` = no errors, `1` = errors, `2` = usage problem. Current limits:

| Field | ✕ Error (blocks publishing) | ! Warning |
|---|---|---|
| Title | empty | over 70 characters |
| Slug | empty, invalid characters, already used | over 75 characters; changing a published post's slug |
| Meta title | **over 60 characters** | empty (falls back to title), under 30 |
| Meta description | empty, over 160 characters | under 120 |
| Focus keyword | none | empty, over 5 words |
| Tags | none | more than 10 |
| Featured image | `cover` set without `cover_alt` | alt over 125 characters; file name with spaces |
| Author | empty | none |
| Date (scheduled) | schedule without a date | date in the past |
| Takeaways | empty bullet | more than 5; bullet over 200 characters |
| FAQs | missing question or answer; duplicate question | answer over 60 words; question without "?" |
| Sources | missing name; link not `https://…` | none |
| Content | empty; image without alt; link without address | under 300 words; H1 in the body |

The SEO score (0–100) also checks the focus keyword in the title, meta title, description, slug, first paragraph and a
subheading, keyword use, internal links (3+), external links (1+), image alt text and FAQs.

---

## 4. Workflow A: the owner gives you a document

The owner's documents usually look like this: a **brief** (meta title, meta description, slug, primary and secondary
keywords, a "User Intent" table) followed by the **article** (intro, numbered sections, a summary table, final
thoughts, FAQs).

1. **Map the brief to fields.**
   - Title = the document's main heading. `meta_title`, `description`, `slug` as written (strip a leading `/` from the slug).
   - `focus_keyword` = primary keyword. `tags` = secondary keywords.
   - `category`: pick from the list in section 2 based on the topic (ask if unclear).
   - `author: Nagarjun` unless told otherwise. `date` = now (ISO, UTC) unless a date is given.
   - **The brief itself (keywords, User Intent table) is never published.**
2. **Convert the article to the body** using the conventions above: numbered sections → `##`, bullet lists → `-`,
   tables → Markdown tables, "Request Indexing"-style UI names → bold, code-like text → inline code.
   Move the FAQ section into `faq` (question/answer pairs) and remove it from the body.
   **Keep the owner's words.** Do not rewrite, add facts, statistics, takeaways or sources that are not in the
   document.
3. **Featured image** (if provided): resize to **1600 px wide, WebP, quality about 84**, save as
   `public/images/blog/<slug>-cover.webp`. Any aspect ratio is accepted: the site shows it in full inside a fixed 16:9
   frame with a backdrop in the image's own colours. **Best input: 1600 × 900 px (16:9).**
   `cover_alt`: describe the image, or use what the owner asks for (e.g. the title).
4. **Write the file** with `draft: false` only if the owner asked to publish; otherwise `draft: true`.
5. **Check it:** `npm run check:post -- content/blog/<slug>.md`.
6. **Report before publishing**, using the output, in a table like this:

   | | Field | Owner's text | Problem | Suggested fix (with character count) |
   |---|---|---|---|---|
   | ✕ | Meta title | "…" | 64 characters, limit 60 | "…" (58) |
   | ! | Title | "…" | 71 characters, aim for under 70 | "…" (64) |

   Then list the SEO checklist items that failed, each with a concrete suggestion.
   - **Never change the owner's words silently.** Offer: (1) use the suggestion, (2) the owner gives their own text,
     (3) publish the original anyway.
   - **Errors (✕): stop and wait for the owner's choice.** Do not publish.
   - **Warnings (!): list them; publish if the owner says to go ahead.**
7. **Preview:** run `npx next build`, serve `out/` locally, open `/blog/<slug>` and show the owner the page.
   (`next dev` returns 404 for a post created after it started; the static build is the real preview.)
8. **Publish:** commit `content/blog/<slug>.md` and the image, and **push to `main` only when the owner says so**.
   The site is live about 2–3 minutes later (once MilesWeb serves the `deploy` branch).

## 5. Workflow B: the owner uses `/admin`

Nothing to do unless asked. The editor shows the same errors and warnings inline, blocks publishing on errors and asks
"Publish anyway?" on warnings. Saving in GitHub mode commits to `main` directly, so **pull before you push** if the
owner has been editing.

---

## 6. Rules that always apply

- **No invented facts or statistics.** Use only what the owner provides or what the site already states.
- Brand name: **Effix Labs**. Email: **hello@effixlabs.in**. Domain: **effixlabs.in**.
- Don't publish placeholder or test content. Remove any test post you create.
- Don't delete or overwrite a post without the owner's confirmation; back it up first.
- Never commit secrets (`.env`, API keys, tokens). Never print secret values; refer to them by name.
- Push to GitHub only when the owner asks.
- Before handing over: `npm run test:brands`, `npx tsc --noEmit`, `npx next build` must pass.
