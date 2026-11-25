// Markdown -> HTML for blog posts, shared by the site (lib/blog.ts) and the editor preview (app/admin).
// No Node APIs here, so it runs in the browser too.
import { Marked } from "marked";

import { SITE_URL } from "./site";

export type Heading = { id: string; text: string; level: 2 | 3 };

export const slugify = (s: string) =>
  s.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

const escHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const safeHref = (href: string) => (/^(https?:|mailto:|tel:|\/|#)/i.test(href.trim()) ? href : "#");

export function render(md: string) {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      html({ text }) {
        return escHtml(text);
      },
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        if (depth === 2 || depth === 3) {
          let id = slugify(text) || "section";
          const n = used.get(id) ?? 0;
          used.set(id, n + 1);
          if (n) id = `${id}-${n + 1}`;
          headings.push({ id, text: text.replace(/<[^>]+>/g, ""), level: depth });
          return `<h${depth} id="${id}">${text}</h${depth}>\n`;
        }
        const level = Math.max(2, depth); // the page title is the only h1
        return `<h${level}>${text}</h${level}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const cleanHref = safeHref(href);
        const external = /^https?:\/\//i.test(cleanHref) && !cleanHref.startsWith(SITE_URL);
        const t = title ? ` title="${escHtml(title)}"` : "";
        return external
          ? `<a href="${escHtml(cleanHref)}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`
          : `<a href="${escHtml(cleanHref.replace(SITE_URL, "") || "/")}"${t}>${text}</a>`;
      },
      image({ href, title, text }) {
        const cleanSrc = /^(https?:|\/)/i.test(href.trim()) ? href : "";
        const cap = title ? `<figcaption>${escHtml(title)}</figcaption>` : "";
        return `<figure><img src="${escHtml(cleanSrc)}" alt="${escHtml(text)}" loading="lazy" decoding="async" />${cap}</figure>`;
      },
      // "> **Tip:** ..." / "> **Note:** ..." / "> **Warning:** ..." become callouts
      blockquote({ tokens }) {
        const inner = this.parser.parse(tokens);
        const kind = inner.match(/^<p><strong>(Tip|Note|Warning|Example):?<\/strong>/i)?.[1]?.toLowerCase();
        return kind ? `<aside class="bl-callout is-${kind}">${inner}</aside>\n` : `<blockquote>${inner}</blockquote>\n`;
      },
      table(token) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`).join("");
        return `<div class="bl-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, headings };
}

