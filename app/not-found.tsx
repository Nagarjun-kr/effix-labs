// Branded 404 page. The static export writes it to out/404.html, which public/.htaccess serves (with a real 404
// status) for any address that doesn't exist. Next.js adds the noindex tag itself.
import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "./about/chrome";
import "./about/about.css";
import "@/components/not-found.css";

export const metadata: Metadata = {
  title: "Page not found | Effix Labs",
  description: "This page doesn't exist. Find your way back to Effix Labs services, the blog or the free visibility audit.",
};

const LINKS = [
  { href: "/", title: "Home", text: "Get found where your customers search." },
  { href: "/#services", title: "Services", text: "Google Business Profile, Reddit, SEO & AEO, content and websites." },
  { href: "/blog", title: "Blog", text: "Practical guides on getting found on Google, Reddit and AI search." },
  { href: "/contact", title: "Contact", text: "Tell us about your business and what you need." },
];

export default function NotFound() {
  return (
    <div className="ab">
      <SiteNav />
      <main className="nf">
        <div className="ab-wrap">
          <span className="ab-eyebrow">Error 404</span>
          <h1>This page wasn&rsquo;t <em>found.</em></h1>
          <p className="nf-lede">The link may be old, or the address may have a typo. Here are the best places to go next.</p>
          <div className="nf-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nf-link">
                <b>{l.title} <span aria-hidden="true">→</span></b>
                <small>{l.text}</small>
              </a>
            ))}
          </div>
          <a href="/#audit" className="ab-btn ab-btn-dark">Run a free visibility audit <span aria-hidden="true">→</span></a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
