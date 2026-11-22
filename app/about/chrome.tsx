// Shared page chrome (nav + footer) for the About and Blog pages. Styles live in app/about/about.css.
import MegaNav from "@/components/MegaNav";
export function Mark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function SiteNav({ current }: { current?: "about" | "blog" | "contact" }) {
  return (
  <header className="ab-nav">
    <div className="ab-wrap ab-nav-in">
      <a href="/" className="ab-logo" aria-label="Effix Labs home"><Mark /><span>Effix Labs</span></a>
      <MegaNav current={current} hideBelow={1000} />
      <a href="/#audit" className="ab-btn ab-btn-dark">Run a Visibility Audit</a>
      <details className="ab-menu">
        <summary aria-label="Menu"><span /><span /></summary>
        <nav aria-label="Mobile">
          <a href="/about" aria-current={current === "about" ? "page" : undefined}>About</a>
          <a href="/blog" aria-current={current === "blog" ? "page" : undefined}>Blog</a>
          <a href="/#services">Services</a>
          <a href="/casestudy/">Case Study</a>
          <a href="/seo-audit-tool/">SEO Audit Platform</a>
          <a href="/contact" aria-current={current === "contact" ? "page" : undefined}>Contact</a>
          <a href="/#audit" className="ab-btn ab-btn-dark">Run a Visibility Audit</a>
        </nav>
      </details>
    </div>
  </header>
  );
}

export function SiteFooter() {
  return (
  <footer className="ab-foot">
    <div className="ab-wrap">
      <div className="ab-foot-grid">
        <div className="ab-foot-brand">
          <a href="/" className="ab-logo ab-logo-light" aria-label="Effix Labs home"><Mark /><span>Effix Labs</span></a>
          <p className="ab-foot-tag">Get found where your customers search.</p>
          <p>Effix Labs helps businesses get found on Google, in online communities and in AI search.</p>
        </div>
        <div><p className="ab-foot-h">Services</p><ul><li><a href="/services/google-business-profile">Google Business Profile Optimisation</a></li><li><a href="/services/reddit-marketing">Reddit Marketing</a></li><li><a href="/services/seo-aeo-services">SEO &amp; AEO Services</a></li><li><a href="/services/content-writing">Content Writing</a></li><li><a href="/services/website-design-development">Website Design &amp; Development</a></li></ul></div>
        <div><p className="ab-foot-h">Product</p><ul><li><a href="/#audit">Effix Discover</a></li></ul></div>
        <div><p className="ab-foot-h">Company</p><ul><li><a href="/about">About</a></li><li><a href="/blog">Blog</a></li><li><a href="/casestudy/">Case Study</a></li><li><a href="/contact">Contact</a></li></ul></div>
        <div><p className="ab-foot-h">Legal</p><ul><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Service</a></li></ul></div>
      </div>
      <div className="ab-foot-bottom"><span>© 2026 Effix Labs</span><a href="mailto:hello@effixlabs.in">hello@effixlabs.in</a></div>
    </div>
  </footer>
  );
}
