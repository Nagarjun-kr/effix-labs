import type { Metadata } from "next";

import { SITE_URL, ldString } from "@/lib/site";
import { SiteFooter, SiteNav } from "../about/chrome";
import "../about/about.css";
import "@/components/legal.css";

const TITLE = "Terms of Service | Effix Labs";
const DESC = "The terms for using effixlabs.in and the free Effix Labs tools, including the visibility audit and SEO audit, and how our service engagements work.";
const UPDATED = "22 November 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}/terms`, type: "website", images: [{ url: `${SITE_URL}/images/og-home.jpg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/images/og-home.jpg`] },
};

const LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: `${SITE_URL}/terms`,
  description: DESC,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const SECTIONS: [string, string][] = [
  ["using", "Using this website"],
  ["tools", "Our free tools"],
  ["services", "Our services"],
  ["results", "No guaranteed results"],
  ["content", "Our content"],
  ["links", "Other websites"],
  ["liability", "Liability"],
  ["law", "Governing law"],
  ["changes", "Changes"],
  ["contact", "Contact us"],
];

export default function TermsPage() {
  return (
    <div className="ab">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(LD) }} />
      <SiteNav />
      <main>
        <section className="lg-hero">
          <div className="ab-wrap">
            <span className="ab-eyebrow">Legal</span>
            <h1>Terms of <em>Service</em></h1>
            <p className="lg-meta">Last updated: {UPDATED}</p>
          </div>
        </section>
        <div className="ab-wrap lg-body">
          <nav className="lg-toc" aria-label="On this page">
            <b>On this page</b>
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <article className="lg-doc">
            <p>These terms apply when you use effixlabs.in, run our free tools or contact Effix Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the website, you agree to them.</p>

            <h2 id="using">Using this website</h2>
            <p>You may use the website to learn about our services, read our content, use our free tools and contact us. Please do not misuse it: do not try to break or overload it, run automated requests against our tools, or use it for anything unlawful.</p>

            <h2 id="tools">Our free tools</h2>
            <p>The visibility audit (Effix Discover) and the SEO audit tool are free and are still being developed. They look at public information, such as public search results, a website&rsquo;s public pages and its speed scores, and the results are estimates. They may be incomplete or not 100% accurate, so please use them as a starting point, not as professional advice. Only audit websites you own or have permission to review. We may limit, change or pause the tools at any time.</p>

            <h2 id="services">Our services</h2>
            <p>The services described on this website (Google Business Profile optimisation, Reddit marketing, SEO and AEO, content writing, and website design and development) are provided under a separate agreement or proposal that we agree with you in writing. That agreement covers the scope, timeline and fees, and it takes priority over these terms where they differ.</p>

            <h2 id="results">No guaranteed results</h2>
            <p>Search engines, AI tools and online communities make their own decisions about what they show. We work to improve your visibility, but we cannot guarantee specific rankings, traffic, citations or sales.</p>

            <h2 id="content">Our content</h2>
            <p>The text, design, graphics and tools on this website belong to Effix Labs unless stated otherwise. You may share links to our pages and quote short parts with credit. Please do not copy or republish our content or tools without our permission. Brand names and logos of other companies, such as Google and Reddit, belong to their owners and are used only to describe our services.</p>

            <h2 id="links">Other websites</h2>
            <p>Our pages may link to other websites. We are not responsible for their content or how they handle your information.</p>

            <h2 id="liability">Liability</h2>
            <p>The website and free tools are provided &ldquo;as is&rdquo;. To the extent the law allows, Effix Labs is not liable for any loss that comes from using the website, the free tools or decisions made based on their results.</p>

            <h2 id="law">Governing law</h2>
            <p>These terms are governed by the laws of India, and the courts of Bengaluru, Karnataka have jurisdiction over any dispute about them.</p>

            <h2 id="changes">Changes to these terms</h2>
            <p>We may update these terms from time to time. The &ldquo;Last updated&rdquo; date above shows when they last changed.</p>

            <h2 id="contact">Contact us</h2>
            <p>Questions about these terms: <a href="mailto:hello@effixlabs.in">hello@effixlabs.in</a>.</p>
            <p className="lg-note">See also our <a href="/privacy">Privacy Policy</a>.</p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
