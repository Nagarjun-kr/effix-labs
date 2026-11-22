<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Effix Labs website: notes for AI agents and developers

Site: **effixlabs.in** (Next.js, exported as static HTML to `out/` and served by MilesWeb from the `deploy` branch).
Search API (Effix Discover, SEO audit) and the blog editor's GitHub login run on the Cloudflare Worker in `worker/`.

## Blog posts: read `docs/BLOG_WORKFLOW.md` first

Any task that creates, edits, checks or publishes a blog post follows **`docs/BLOG_WORKFLOW.md`**. Key rules:

- A post is `content/blog/<slug>.md` (front matter + Markdown). Images go in `public/images/blog/`.
- **Check every post with `npm run check:post -- content/blog/<slug>.md`** (same rules as the `/admin` editor).
- **Errors block publishing**: show the owner a table (field, their text, problem, suggested fix with character count)
  and wait for their choice. **Warnings**: list them and publish only if the owner agrees.
- **Never change the owner's words silently**, and never invent facts, statistics, takeaways or sources.
- From a brief document: the brief (keywords, user-intent table) is never published; FAQs go in the `faq` field, not
  the body; the featured image becomes `public/images/blog/<slug>-cover.webp` (1600 px wide, WebP).
- Push to GitHub only when the owner asks. Never commit or print secrets (`.env`, keys, tokens).

## Site-wide rules

- Brand: **Effix Labs**; email **hello@effixlabs.in**; domain **effixlabs.in**.
- Headings use the two-tone style (plain + italic word) on marketing pages.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Before handing over: `npm run test:brands`, `npx tsc --noEmit` and `npx next build` must pass.
- Enquiry forms: every form uses the strict checks in `lib/forms/rules.ts` and sends through the Worker
  (`/api/contact` → Resend → effix.labs@gmail.com). React forms call `bindForm` from `lib/forms/guard.ts`; plain-script
  pages add `data-effix-form="Name"` to the `<form>` and load `/js/form-guard.js` (built by `npm run build:forms`).
