import type { Metadata } from "next";

import HeroFluid from "@/components/HeroFluid";
import { SITE_URL, ldString } from "@/lib/site";
import { Mark, SiteFooter, SiteNav } from "../about/chrome";
import { CopyEmail, ContactBrief } from "./contact-client";
import "../about/about.css";
import "./contact.css";

const TITLE = "Contact Effix Labs | Let's Get Your Business Found";
const DESCRIPTION =
  "Tell Effix Labs about your business. We'll show you where you can be found on Google, in online communities and in AI search, and how to get there.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/contact`, type: "website", images: [{ url: `${SITE_URL}/images/og-home.jpg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/images/og-home.jpg`] },
};

const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#page`,
      url: `${SITE_URL}/contact`,
      name: TITLE,
      description: DESCRIPTION,
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Effix Labs",
      url: `${SITE_URL}/`,
      email: "hello@effixlabs.in",
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "hello@effixlabs.in", availableLanguage: ["English"] },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
      ],
    },
  ],
};

const STEPS = [
  { n: "01", t: "Your brief reaches us", d: "Your message comes straight to the Effix Labs inbox, with everything you picked above." },
  { n: "02", t: "We reply within 1 business day", d: "We reply to the email address you give us, so check it's the one you use." },
  { n: "03", t: "We start with evidence", d: "We look at where your brand shows up on Google, in communities and in AI answers, then suggest where to start." },
];

export default function ContactPage() {
  return (
    <div className="ab ct">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(LD) }} />
      <SiteNav current="contact" />
      <main id="main">
        <section className="ct-hero">
          <HeroFluid />
          <div className="ab-wrap ct-hero-grid">
            <div className="ct-intro">
              <span className="ab-eyebrow">Contact</span>
              <h1>Let&rsquo;s get you <em>found.</em></h1>
              <p className="ct-lede">Tell us about your business. We&rsquo;ll show you where you can be found, and how to get there.</p>

              <ul className="ct-ways">
                <li className="ct-way">
                  <span className="ct-way-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
                  <span className="ct-way-text"><small>Email us directly</small><a href="mailto:hello@effixlabs.in">hello@effixlabs.in</a></span>
                  <CopyEmail email="hello@effixlabs.in" />
                </li>
                <li className="ct-way">
                  <span className="ct-way-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                  <span className="ct-way-text"><small>Response time</small><b>Within 1 business day</b></span>
                </li>
                <li className="ct-way">
                  <span className="ct-way-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></svg></span>
                  <span className="ct-way-text"><small>Privacy</small><b>We never share or sell your business information</b></span>
                </li>
              </ul>

              <a href="/#audit" className="ct-audit">
                <span className="ct-audit-mark" aria-hidden="true"><Mark /></span>
                <span><b>Not ready to talk yet?</b><small>Run a free visibility audit. No login.</small></span>
                <svg className="ct-audit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
            </div>

            <ContactBrief />
          </div>
        </section>

        <section className="ct-next" aria-labelledby="ct-next-title">
          <div className="ab-wrap">
            <span className="ab-label">After you send</span>
            <h2 id="ct-next-title">What happens <em>next.</em></h2>
            <ol className="ct-steps">
              {STEPS.map((s) => (
                <li key={s.n} className="ct-step">
                  <span className="ct-step-n">{s.n}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
