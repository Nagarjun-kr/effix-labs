# effix-labs

Marketing website for **Effix Labs**, built with [Next.js](https://nextjs.org) (App Router, TypeScript).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

| Path | What it is |
|---|---|
| `app/page.tsx` | Homepage |
| `app/services/<slug>/page.tsx` | Service pages (Google Business Profile, Reddit & Quora, AI Blog SEO, AI Search Visibility, Website Design & Development) |
| `app/**/page.css` | Styles for each page |
| `app/layout.tsx` | Root layout (font preloads, site metadata) |
| `components/LegacyScripts.tsx` | Loads each page's interaction scripts in order (smooth scroll, animations, FAQ, forms) |
| `public/js/<page>/` | Page interaction scripts |
| `public/images`, `public/videos`, `public/fonts` | Static assets |
| `next.config.ts` | Redirects from old/duplicate URLs to the canonical service routes |

Links between pages are plain `<a>` tags (full page loads), so each page's CSS and scripts stay isolated.
