import type { Metadata } from "next";

import { SITE_URL, ldString } from "@/lib/site";
import { SiteFooter, SiteNav } from "../about/chrome";
import "../about/about.css";
import "@/components/legal.css";

const TITLE = "Privacy Policy | Effix Labs";
const DESC = "How Effix Labs collects, uses and protects the information you share through our website, enquiry forms and free visibility and SEO audit tools.";
const UPDATED = "22 November 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}/privacy`, type: "website", images: [{ url: `${SITE_URL}/images/og-home.jpg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/images/og-home.jpg`] },
};

const LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: TITLE,
  url: `${SITE_URL}/privacy`,
  description: DESC,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const SECTIONS: [string, string][] = [
  ["collect", "What we collect"],
  ["use", "How we use it"],
  ["share", "Services that help us"],
  ["cookies", "Cookies and storage"],
  ["keep", "How long we keep it"],
  ["rights", "Your choices and rights"],
  ["security", "Security"],
  ["children", "Children"],
  ["changes", "Changes"],
  ["contact", "Contact us"],
];

export default function PrivacyPage() {
  return (
    <div className="ab">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(LD) }} />
      <SiteNav />
      <main id="main">
        <section className="lg-hero">
          <div className="ab-wrap">
            <span className="ab-eyebrow">Legal</span>
            <h1>Privacy <em>Policy</em></h1>
            <p className="lg-meta">Last updated: {UPDATED}</p>
          </div>
        </section>
        <div className="ab-wrap lg-body">
          <nav className="lg-toc" aria-label="On this page">
            <b>On this page</b>
            {SECTIONS.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <article className="lg-doc">
            <p>Effix Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs effixlabs.in. This policy explains what information we collect when you use the website, why we collect it and what you can ask us to do with it. We collect only what we need to reply to you and to run our free tools.</p>

            <h2 id="collect">What we collect</h2>
            <h3>When you fill in a form</h3>
            <p>Our contact and enquiry forms ask for your name, email address, company name and, optionally, your phone number, company website, message, the services you are interested in and how you heard about us. We receive exactly what you type.</p>
            <h3>When you use our free tools</h3>
            <p>The visibility audit (Effix Discover) and the SEO audit tool ask for a website address. We use it to look up public information about that website: public search results, its public pages and its speed scores. We do not ask for your name or email to use the tools.</p>
            <h3>Technical information</h3>
            <p>Like any website, our servers receive your IP address and basic browser information when you load a page or use a tool. We use the IP address briefly to stop abuse (for example, limiting how many audits can be run in a minute). We do not use it to identify you.</p>

            <h2 id="use">How we use it</h2>
            <ul>
              <li>To reply to your enquiry and talk with you about our services.</li>
              <li>To run the audits you request and show you the results.</li>
              <li>To keep the website and tools working, secure and free from abuse.</li>
            </ul>
            <p>We do not sell your information, and we do not use it for advertising.</p>

            <h2 id="share">Services that help us</h2>
            <p>We use a small number of trusted services to run the website. They process information only to provide their service to us:</p>
            <ul>
              <li><b>Website hosting:</b> MilesWeb hosts the website files.</li>
              <li><b>Forms and tools server:</b> Cloudflare runs the small server that checks form submissions and runs the audit tools.</li>
              <li><b>Email delivery:</b> Resend delivers form submissions to our inbox, which is hosted by Google (Gmail).</li>
              <li><b>Search results:</b> Serper provides the public Google search results used by the visibility audit. Only the website or brand being checked is sent.</li>
              <li><b>Speed scores:</b> Google PageSpeed Insights measures the speed of the website being audited.</li>
              <li><b>Audit summaries:</b> when enabled, an AI service (Groq) writes the plain-English summary of an SEO audit from the audit results. Only the audit results for the website are sent, not information about you.</li>
            </ul>
            <p>Some of these services may process information outside India. We may also share information if the law requires it.</p>

            <h2 id="cookies">Cookies and storage</h2>
            <p>The public website does not use advertising or analytics cookies. When you start an audit from the homepage, your browser keeps the website address you typed in temporary session storage so the results page can open it; it is cleared when you close the tab. If we add analytics in the future, we will update this policy first.</p>

            <h2 id="keep">How long we keep it</h2>
            <p>We keep enquiry emails for as long as we need them to talk with you and to keep a record of our work together. You can ask us to delete them at any time. Audit requests are processed when you run them; we do not build a profile of you from them.</p>

            <h2 id="rights">Your choices and rights</h2>
            <p>You can ask us to show you the information we hold about you, correct it or delete it, and you can withdraw your consent to us contacting you at any time. These rights are recognised under India&rsquo;s Digital Personal Data Protection Act, 2023. To make a request, email <a href="mailto:hello@effixlabs.in">hello@effixlabs.in</a> and we will respond as soon as we can.</p>

            <h2 id="security">Security</h2>
            <p>The website is served only over HTTPS, and access to our inbox and systems is limited to the Effix Labs team. No method of sending or storing data is completely secure, but we work to protect your information.</p>

            <h2 id="children">Children</h2>
            <p>Our website and services are meant for businesses. We do not knowingly collect information from children.</p>

            <h2 id="changes">Changes to this policy</h2>
            <p>If we change how we handle information, we will update this page and the &ldquo;Last updated&rdquo; date above.</p>

            <h2 id="contact">Contact us</h2>
            <p>Questions about this policy or your information: <a href="mailto:hello@effixlabs.in">hello@effixlabs.in</a>.</p>
            <p className="lg-note">See also our <a href="/terms">Terms of Service</a>.</p>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
