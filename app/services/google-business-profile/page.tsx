// Google Business Profile Optimisation — service page.
// Markup renders on the server; small interactions (banner parallax, checklist meter,
// FAQ accordion, contact form) are plain scripts loaded in order by <LegacyScripts>.
import type { Metadata } from "next";
import LegacyScripts from "@/components/LegacyScripts";
import ServiceFaq, { faqPageLd, type FaqItem } from "@/components/ServiceFaq";
import { ORG_ID, ldString } from "@/lib/site";
import { SiteFooter } from "@/app/about/chrome";
import "@/app/about/about.css";
import "./page.css";
import "./gx.css";
import "./gb-banner.css";
import "./gb-process.css";

export const metadata: Metadata = {
  "title": "Google Business Profile Optimisation Services | Effix Labs",
  "description": "Google Business Profile optimisation services in Bengaluru and across India. Get found on Google Search and Maps, win more local customers. Talk to our team.",
  "alternates": {
    "canonical": "https://effixlabs.in/services/google-business-profile"
  },
  "openGraph": {
    "title": "Google Business Profile Optimisation Services | Effix Labs",
    "description": "Google Business Profile optimisation services in Bengaluru and across India. Get found on Google Search and Maps, win more local customers. Talk to our team.",
    "url": "https://effixlabs.in/services/google-business-profile",
    "type": "website",
    "images": [
      "https://effixlabs.in/images/services/service-01-gbp.jpg"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Google Business Profile Optimisation Services | Effix Labs",
    "description": "Google Business Profile optimisation services in Bengaluru and across India. Get found on Google Search and Maps, win more local customers. Talk to our team.",
    "images": [
      "https://effixlabs.in/images/services/service-01-gbp.jpg"
    ]
  }
};

const SCRIPTS = [
  "/js/form-guard.js",
  "/js/legacy-shim.js",
  "/js/google-business-profile/01.js",
  "/scripts/lenis.min.js",
  "/js/google-business-profile/02.js",
  "/js/google-business-profile/03.js"
];

const FAQS: FaqItem[] = [
  {
    "q": "Do you offer Google Business Profile optimisation services in Bengaluru?",
    "a": [
      "Yes. Effix Labs works with businesses across Bengaluru (Bangalore), from single shops and clinics to multi-location brands, as well as clients elsewhere in India and abroad. Audits and optimisation are done remotely through your Business Profile access, and we can meet in person where needed."
    ]
  },
  {
    "q": "Can you help my business show up in a specific Bengaluru area, like Koramangala or Whitefield?",
    "a": [
      "We can make your profile clearly relevant to the areas you serve, with the correct address or service area, local services and area-specific updates. Google also weighs distance from the person searching, which no one can control, so we focus on everything that is in your control and report results honestly."
    ]
  },
  {
    "q": "What is Google Business Profile optimisation?",
    "a": [
      "It’s the process of improving your free Google Business Profile (formerly Google My Business) so it’s complete, accurate and relevant to what customers search for. That covers categories, services, description, photos, reviews and regular updates, which help your business appear in more local searches on Google Search and Maps."
    ]
  },
  {
    "q": "How long does Google Business Profile optimisation take?",
    "a": [
      "The initial audit and optimisation usually take one to three weeks, depending on how many fixes are needed and how quickly we receive access and information. Visibility changes follow over the next weeks and months, and they vary by industry, competition and location. It works best as an ongoing process."
    ]
  },
  {
    "q": "Can you guarantee a top position on Google Maps?",
    "a": [
      "No, and be cautious of anyone who does. Google states there’s no way to pay for a better local ranking. We improve the factors you can influence, such as relevance, completeness, reviews and activity, and track the results honestly."
    ]
  },
  {
    "q": "Why is my business not showing on Google Maps?",
    "a": [
      "Common reasons are an unverified or suspended profile, a category that doesn’t match the search, incomplete information, inconsistent details across the web, or strong nearby competitors. Our audit shows which of these apply to you."
    ]
  },
  {
    "q": "How do I get more Google reviews?",
    "a": [
      "Ask every satisfied customer at the right moment with a direct review link, and reply to every review you receive. We set up a simple, policy-compliant routine. We never buy, fake or offer incentives for reviews."
    ]
  },
  {
    "q": "What are the best categories for my Google Business Profile?",
    "a": [
      "Choose the most specific primary category for your core business and add only a few additional categories for key services. The right choice depends on your business and on which categories top competitors use, which we research during the audit."
    ]
  },
  {
    "q": "Do I need a website to benefit from a Google Business Profile?",
    "a": [
      "No. A profile can bring calls and visits on its own. A website that matches your profile details does strengthen local SEO and gives customers more confidence."
    ]
  },
  {
    "q": "Can you optimise a profile for a service-area business?",
    "a": [
      "Yes. If you visit customers at their location, such as plumbers or cleaners, Google asks you to hide your address and set a service area. We set this up correctly so you stay compliant."
    ]
  },
  {
    "q": "Do you manage multiple locations?",
    "a": [
      "Yes. Each eligible location needs its own profile. We manage them consistently, with shared standards and individual reporting."
    ]
  },
  {
    "q": "Do you offer Google My Business optimization services in India?",
    "a": [
      "Yes. Effix Labs works with businesses across India and internationally. All work is done remotely through your Google Business Profile access."
    ]
  },
  {
    "q": "Is Google Business Profile optimisation a one-time job?",
    "a": [
      "The first optimisation is a one-time project, but profiles need ongoing care: new reviews, updates, photo refreshes, public edits and changes to Google’s features. That’s why we also offer ongoing Google Business Profile management."
    ]
  }
];

const SERVICE_LD = {
  "@type": "Service",
  "@id": "https://effixlabs.in/services/google-business-profile#service",
  "name": "Google Business Profile Optimisation Services",
  "serviceType": "Google Business Profile optimisation and management",
  "provider": {
    "@id": ORG_ID
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Bengaluru",
      "alternateName": "Bangalore",
      "containedInPlace": {
        "@type": "State",
        "name": "Karnataka"
      }
    },
    {
      "@type": "Country",
      "name": "India"
    },
    {
      "@type": "Place",
      "name": "Worldwide"
    }
  ],
  "description": "Google Business Profile optimisation services for businesses in Bengaluru (Bangalore) and across India: profile audit, category and service optimisation, review management support, regular updates and monthly reporting.",
  "url": "https://effixlabs.in/services/google-business-profile"
};

const BREADCRUMB_LD = {
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://effixlabs.in/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://effixlabs.in/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Google Business Profile Optimisation",
      "item": "https://effixlabs.in/services/google-business-profile"
    }
  ]
};

const JSON_LD = ldString([SERVICE_LD, faqPageLd(FAQS), BREADCRUMB_LD]);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header">
        {" "}
        <div className="header-inner">
          {" "}
          <a href="/" className="brand-logo-wrap" aria-label="Effix Labs Home">
            <svg className="effix-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"></path>
              <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></path>
            </svg>
            <span className="brand-name">{"Effix Labs"}</span>
          </a>
          {" "}
          <a href="/#services" className="back-services-btn" aria-label="Back to Services Cards">
            {" "}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {" "}
              <line x1="19" y1="12" x2="5" y2="12"></line>
              {" "}
              <polyline points="12 19 5 12 12 5"></polyline>
              {" "}
            </svg>
            {" "}
            <span>
              {"Back to Services"}
            </span>
            {" "}
          </a>
          {" "}
        </div>
        {" "}
      </header>
      <main id="main" className="gx-page">
        {/* ================= HERO ================= */}
        <section className="gx-hero" id="hero">
          <div className="gx-wrap gx-hero-inner">
            <h1 className="gx-hero-title">
              {"Google Business Profile "}<em>{"Optimisation"}</em>{" Services"}
            </h1>
            <p className="gx-hero-sub">{"Get found where local customers are searching."}</p>
            <p className="gx-hero-lede">
              {"Most people choose a local business without ever opening a website. They search, glance at the map, compare a few profiles and call. Effix Labs helps businesses in Bengaluru and across India make their Google Business Profile easier to find, easier to understand and easier to choose on Google Search and Maps."}
            </p>
            <div className="gx-hero-ctas">
              <a href="#contact" className="gx-btn gx-btn-dark">{"Talk to us"}<span aria-hidden="true">{" →"}</span></a>
              <a href="#included" className="gx-btn gx-btn-ghost">{"See what’s included"}</a>
            </div>
            <p className="gx-hero-trust">{"No lock-in · No fake reviews · No ranking promises we can’t keep"}</p>
          </div>

          {/* Hero banner — CSS-built 3D "Map Pack" scene (no video) */}
          <div className="gx-wrap-wide">
            <div className="gb-banner" id="gbBanner">
              <div className="gb-copy">
                <span className="gb-label">{"Google Business Profile"}</span>
                <h2 className="gb-title">{"Your profile,"}<br /><em>{"working for you."}</em></h2>
                <p className="gb-sub">{"Show up in Google Search and Maps, and turn profile views into calls, visits and directions."}</p>
                <a href="#included" className="gb-btn">{"See what’s included"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"></path></svg></a>
              </div>
              <div className="gb-scene" aria-hidden="true">
                <div className="gb-map">
                  <i className="gb-park"></i><i className="gb-water"></i>
                  <i className="gb-dot d1"></i><i className="gb-dot d2"></i><i className="gb-dot d3"></i><i className="gb-dot d4"></i>
                  <span className="gb-pulse"></span>
                  <span className="gb-pin"><svg viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.6 12 32 12 32s12-11.4 12-20.1C24 5.3 18.6 0 12 0z" fill="url(#gbPinGrad)"></path><circle cx="12" cy="11.5" r="4.6" fill="#fff"></circle><defs><linearGradient id="gbPinGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a855f7"></stop><stop offset="1" stopColor="#6d28d9"></stop></linearGradient></defs></svg></span>
                </div>
                <div className="gb-pack">
                  <span className="gb-pack-h"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path><circle cx="12" cy="9.5" r="2.4"></circle></svg><bdi data-t={"Map Pack"}></bdi></span>
                  <span className="gb-pack-row on"><b><bdi data-t={"1"}></bdi></b><bdi data-t={"Your business"}></bdi></span>
                  <span className="gb-pack-row"><b><bdi data-t={"2"}></bdi></b><i></i></span>
                  <span className="gb-pack-row"><b><bdi data-t={"3"}></bdi></b><i></i></span>
                </div>
                <div className="gb-card">
                  <div className="gb-card-cover"><span className="gb-card-logo"></span></div>
                  <div className="gb-card-body">
                    <b className="gb-card-name"><bdi data-t={"Your business"}></bdi></b>
                    <span className="gb-card-stars"><bdi data-t={"★★★★★"}></bdi></span>
                    <span className="gb-card-meta"><i></i><bdi data-t={"Open · Closes 8 pm"}></bdi></span>
                    <div className="gb-card-actions">
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path></svg><bdi data-t={"Call"}></bdi></span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-8-8 18-2-8z"></path></svg><bdi data-t={"Directions"}></bdi></span>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg><bdi data-t={"Website"}></bdi></span>
                    </div>
                  </div>
                </div>
                <span className="gb-chip c1"><i></i><bdi data-t={"Profile verified"}></bdi></span>
                <span className="gb-chip c2"><i></i><bdi data-t={"Review replied"}></bdi></span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MARQUEE ================= */}
        <div className="gx-marquee" id="gxMarquee">
          <div className="gx-marquee-track">
            <div className="gx-marquee-set"><span>{"Verified profiles"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Sharper categories"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Accurate NAP"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Genuine reviews"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Fresh photos"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Regular updates"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Plain-language reports"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i></div>
          </div>
        </div>

        {/* ================= WHAT IS ================= */}
        <section className="gx-section" id="what-is">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label">{"What it is"}</span>
              <h2 className="gx-h2">{"What is Google Business Profile "}<em>{"optimisation?"}</em></h2>
            </div>
            <div className="gx-split-body">
              <p className="gx-statement">
                {"Google Business Profile optimisation, also called Google My Business (GMB) optimization, is improving every part of your free Google listing so it matches what customers search for, answers their questions, and shows Google your business is real, active and relevant."}
              </p>
              <p className="gx-p">{"It’s the foundation of local SEO: the work that helps you appear in the Google Map Pack, the three businesses shown beside the map, and in “near me” searches."}</p>
              <ul className="gx-chips" aria-label="What an optimised profile has">
                <li>{"Right primary category"}</li><li>{"Accurate name, address & phone"}</li><li>{"Complete services"}</li><li>{"Clear description"}</li><li>{"Fresh photos & updates"}</li><li>{"Genuine reviews, all answered"}</li><li>{"Consistent details across the web"}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= RANKING FACTORS ================= */}
        <section className="gx-section gx-tint" id="ranking">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"How Google ranks local results"}</span>
              <h2 className="gx-h2">{"Three things decide who shows up. "}<em>{"Two of them we can improve."}</em></h2>
            </div>
            <div className="gx-factors">
              <article className="gx-factor">
                <span className="gx-factor-num" aria-hidden="true"><bdi data-t={"1"}></bdi></span>
                <h3 className="gx-h3">{"Relevance"}</h3>
                <blockquote className="gx-quote">{"“How well a Business Profile matches what someone is searching for.”"}</blockquote>
                <p className="gx-p-sm">{"We tune categories, services, description, attributes and your website so your profile clearly matches the searches you want."}</p>
                <div className="gx-influence" data-level="high"><span className="gx-influence-bars" aria-hidden="true"><b></b><b></b><b></b></span>{"You can influence this: "}<strong>{"a lot"}</strong></div>
              </article>
              <article className="gx-factor">
                <span className="gx-factor-num" aria-hidden="true"><bdi data-t={"2"}></bdi></span>
                <h3 className="gx-h3">{"Distance"}</h3>
                <blockquote className="gx-quote">{"“How far each business is from the customer who’s searching.”"}</blockquote>
                <p className="gx-p-sm">{"No one controls where a customer searches from. We make sure your address or service area is set up correctly."}</p>
                <div className="gx-influence" data-level="none"><span className="gx-influence-bars" aria-hidden="true"><b></b><b></b><b></b></span>{"You can influence this: "}<strong>{"not really"}</strong></div>
              </article>
              <article className="gx-factor">
                <span className="gx-factor-num" aria-hidden="true"><bdi data-t={"3"}></bdi></span>
                <h3 className="gx-h3">{"Prominence"}</h3>
                <blockquote className="gx-quote">{"“How well-known a business is.”"}</blockquote>
                <p className="gx-p-sm">{"Reviews and replies, photos, regular updates and consistent citations all build prominence over time."}</p>
                <div className="gx-influence" data-level="high"><span className="gx-influence-bars" aria-hidden="true"><b></b><b></b><b></b></span>{"You can influence this: "}<strong>{"a lot"}</strong></div>
              </article>
            </div>
            <p className="gx-source">
              {"Google also says: “There’s no way to request or pay for a better local ranking on Google.” That’s why we never sell guaranteed rankings. Source: "}
              <a href="https://support.google.com/business/answer/7091" target="_blank" rel="noopener noreferrer">{"Google Business Profile Help"}</a>{"."}
            </p>
          </div>
        </section>

        {/* ================= WHY IT MATTERS ================= */}
        <section className="gx-section" id="why">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"Why it matters"}</span>
              <h2 className="gx-h2">{"Why your business needs Google Business Profile "}<em>{"optimisation"}</em></h2>
              <p className="gx-lead">{"A profile that’s simply “set up” isn’t the same as a profile that works. Incomplete listings quietly lose customers to competitors who look more complete and more active."}</p>
            </div>
            <div className="gx-tiles">
              <article className="gx-tile">
                <div className="gx-tile-art" aria-hidden="true">
                  <div className="gx-mock-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg><span><bdi data-t={"dentist near me"}></bdi></span></div>
                  <div className="gx-mock-results"><span className="is-you"><bdi data-t={"Your business"}></bdi></span><span></span><span></span></div>
                </div>
                <h3 className="gx-h3">{"Appear for more local searches"}</h3>
                <p className="gx-p-sm">{"Show up for “near me” and service-specific searches, and rank higher on Google Maps by strengthening relevance and prominence."}</p>
              </article>
              <article className="gx-tile">
                <div className="gx-tile-art" aria-hidden="true">
                  <div className="gx-mock-profile">
                    <div className="gx-mock-photo"></div>
                    <div><b><bdi data-t={"Your business"}></bdi></b><span className="gx-mock-stars"><bdi data-t={"★★★★★"}></bdi></span><span className="gx-mock-meta"><bdi data-t={"Open · Closes 8 pm"}></bdi></span></div>
                  </div>
                </div>
                <h3 className="gx-h3">{"Win the click"}</h3>
                <p className="gx-p-sm">{"Better photos, clearer services and well-answered reviews build trust before a customer ever speaks to you."}</p>
              </article>
              <article className="gx-tile">
                <div className="gx-tile-art" aria-hidden="true">
                  <div className="gx-mock-actions"><span><bdi data-t={"Call"}></bdi></span><span><bdi data-t={"Directions"}></bdi></span><span><bdi data-t={"Website"}></bdi></span></div>
                </div>
                <h3 className="gx-h3">{"Turn views into calls and visits"}</h3>
                <p className="gx-p-sm">{"Accurate hours, numbers and directions mean the people ready to buy can reach you, and never arrive at a closed door."}</p>
              </article>
            </div>
            <aside className="gx-note">
              <strong>{"Worth knowing:"}</strong>{" anyone can suggest edits to a business profile. Without monitoring, your hours, phone number or even your category can change without you noticing. We watch for this."}
            </aside>
          </div>
        </section>

        {/* ================= PROBLEMS TABLE ================= */}
        <section className="gx-section gx-tint" id="problems">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"Common problems"}</span>
              <h2 className="gx-h2">{"Why is my business not showing on "}<em>{"Google Maps?"}</em></h2>
              <p className="gx-lead">{"Usually it’s one or more of these. Our audit tells you exactly which apply to you."}</p>
            </div>
            <div className="gx-table-wrap" role="region" aria-label="Common Google Business Profile problems" tabIndex={0}>
              <table className="gx-table">
                <thead><tr><th scope="col">{"Problem"}</th><th scope="col">{"What it costs you"}</th><th scope="col">{"Typical impact"}</th></tr></thead>
                <tbody>
                  <tr><td>{"Wrong or too-general primary category"}</td><td data-label="What it costs you">{"You don’t appear for your main service"}</td><td data-label="Typical impact"><span className="gx-pill gx-pill-high"><i aria-hidden="true"><bdi data-t={"▲"}></bdi></i>{"High"}</span></td></tr>
                  <tr><td>{"Unverified or suspended profile"}</td><td data-label="What it costs you">{"No visibility at all"}</td><td data-label="Typical impact"><span className="gx-pill gx-pill-high"><i aria-hidden="true"><bdi data-t={"▲"}></bdi></i>{"High"}</span></td></tr>
                  <tr><td>{"Duplicate or conflicting listings"}</td><td data-label="What it costs you">{"Split reviews and confused rankings"}</td><td data-label="Typical impact"><span className="gx-pill gx-pill-high"><i aria-hidden="true"><bdi data-t={"▲"}></bdi></i>{"High"}</span></td></tr>
                  <tr><td>{"Incomplete services and products"}</td><td data-label="What it costs you">{"Google can’t match you to specific searches"}</td><td data-label="Typical impact"><span className="gx-pill gx-pill-med"><i aria-hidden="true"><bdi data-t={"●"}></bdi></i>{"Medium"}</span></td></tr>
                  <tr><td>{"Inconsistent name, address or phone across the web"}</td><td data-label="What it costs you">{"Weakens Google’s confidence in your details"}</td><td data-label="Typical impact"><span className="gx-pill gx-pill-med"><i aria-hidden="true"><bdi data-t={"●"}></bdi></i>{"Medium"}</span></td></tr>
                  <tr><td>{"Few reviews, or reviews left unanswered"}</td><td data-label="What it costs you">{"Lower prominence and lower trust"}</td><td data-label="Typical impact"><span className="gx-pill gx-pill-med"><i aria-hidden="true"><bdi data-t={"●"}></bdi></i>{"Medium"}</span></td></tr>
                </tbody>
              </table>
            </div>
            <p className="gx-source">{"Impact levels are Effix Labs’ general guidance from audit experience, not Google data. Every profile is different."}</p>
          </div>
        </section>

        {/* ================= WHAT'S INCLUDED ================= */}
        <section className="gx-section" id="included">
          <div className="gx-wrap">
            <div className="gx-head gx-head-left">
              <span className="gx-label">{"What’s included"}</span>
              <h2 className="gx-h2">{"Our Google Business Profile optimisation "}<em>{"services"}</em></h2>
            </div>
            <ol className="gx-services">
              <li><span className="gx-svc-n" aria-hidden="true">{"01"}</span><h3 className="gx-svc-t">{"Full profile audit"}</h3><p>{"Every field reviewed against Google’s guidelines and against the competitors showing up for your most important searches."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"02"}</span><h3 className="gx-svc-t">{"Local keyword & competitor research"}</h3><p>{"The exact words your customers use, including service + city terms and “near me” searches, and what top-ranking competitors do differently."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"03"}</span><h3 className="gx-svc-t">{"Category optimisation"}</h3><p>{"The most specific primary category and a small set of relevant additional categories, following Google’s guidance to use as few as possible."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"04"}</span><h3 className="gx-svc-t">{"Business information & NAP accuracy"}</h3><p>{"Name, address, phone, website, hours, special hours and service areas, kept consistent with your website and key directories."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"05"}</span><h3 className="gx-svc-t">{"Services, products & description"}</h3><p>{"A complete services list and a clear description written for customers, with no keyword stuffing, prices, promotions or links."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"06"}</span><h3 className="gx-svc-t">{"Photos, videos & visual content"}</h3><p>{"Genuine, high-quality photos of your premises, team, work and products, organised so customers know what to expect."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"07"}</span><h3 className="gx-svc-t">{"Google Posts & profile updates"}</h3><p>{"Regular updates, offers and events that keep your profile active and give customers a reason to choose you now."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"08"}</span><h3 className="gx-svc-t">{"Review management support"}</h3><p>{"A simple, policy-compliant way to ask for reviews, plus professional replies to every review. We never buy, fake or incentivise reviews."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"09"}</span><h3 className="gx-svc-t">{"Website & landing-page alignment"}</h3><p>{"Matching details, local pages where useful and clear contact paths, so your "}<a href="/services/website-design-development">{"website"}</a>{" supports your profile."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"10"}</span><h3 className="gx-svc-t">{"Monitoring & monthly reporting"}</h3><p>{"Profile views, searches, calls, direction requests and website clicks, explained in plain language with clear next steps."}</p></li>
            </ol>
          </div>
        </section>

        {/* ================= PROCESS — interactive route ================= */}
        <section className="gx-section gx-tint" id="process">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"Our process"}</span>
              <h2 className="gx-h2">{"Our Google Business Profile "}<em>{"optimisation process"}</em></h2>
              <p className="gx-lead">{"Six steps from first call to a profile that keeps working. Follow the pin, or pick a step."}</p>
            </div>
            <div className="gr-route" id="gxRoute">
              <div className="gr-map" aria-hidden="true">
                <svg className="gr-svg" viewBox="0 0 1200 170" fill="none">
                  <defs><linearGradient id="grFill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c4a8ff"></stop><stop offset="1" stopColor="#8b25e2"></stop></linearGradient></defs>
                  <path className="gr-road" d="M10 112 C 120 40, 210 36, 320 88 S 520 150, 620 92 S 810 24, 920 82 S 1110 146, 1190 70"></path>
                  <path className="gr-lane" d="M10 112 C 120 40, 210 36, 320 88 S 520 150, 620 92 S 810 24, 920 82 S 1110 146, 1190 70"></path>
                  <path className="gr-fill" id="grFillPath" d="M10 112 C 120 40, 210 36, 320 88 S 520 150, 620 92 S 810 24, 920 82 S 1110 146, 1190 70"></path>
                </svg>
                <span className="gr-stop"></span><span className="gr-stop"></span><span className="gr-stop"></span><span className="gr-stop"></span><span className="gr-stop"></span><span className="gr-stop"></span>
                <span className="gr-pin" id="grPin"><svg viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.6 12 32 12 32s12-11.4 12-20.1C24 5.3 18.6 0 12 0z" fill="#8b25e2"></path></svg><b id="grPinN"><bdi data-t={"1"}></bdi></b></span>
                <span className="gr-pin-shadow" id="grPinShadow"></span>
              </div>
              <ol className="gr-steps">
              <li className="gr-step is-on" tabIndex={0}><span className="gr-step-n" aria-hidden="true">{"01"}</span><h3 className="gr-step-t">{"Discovery"}</h3><p className="gr-step-d">{"We learn your business, locations, services and goals, and confirm profile access."}</p><span className="gr-step-bar" aria-hidden="true"></span></li>
              <li className="gr-step" tabIndex={0}><span className="gr-step-n" aria-hidden="true">{"02"}</span><h3 className="gr-step-t">{"Profile audit"}</h3><p className="gr-step-d">{"A full review of your profile, competitors and visibility, with issues ranked by impact."}</p><span className="gr-step-bar" aria-hidden="true"></span></li>
              <li className="gr-step" tabIndex={0}><span className="gr-step-n" aria-hidden="true">{"03"}</span><h3 className="gr-step-t">{"Research"}</h3><p className="gr-step-d">{"We map the searches that matter and study who’s already in the Map Pack."}</p><span className="gr-step-bar" aria-hidden="true"></span></li>
              <li className="gr-step" tabIndex={0}><span className="gr-step-n" aria-hidden="true">{"04"}</span><h3 className="gr-step-t">{"Optimise"}</h3><p className="gr-step-d">{"Categories, details, services, description and media fixed, all within Google’s guidelines."}</p><span className="gr-step-bar" aria-hidden="true"></span></li>
              <li className="gr-step" tabIndex={0}><span className="gr-step-n" aria-hidden="true">{"05"}</span><h3 className="gr-step-t">{"Publish & reviews"}</h3><p className="gr-step-d">{"Updates go live and your review request and reply routine begins."}</p><span className="gr-step-bar" aria-hidden="true"></span></li>
              <li className="gr-step" tabIndex={0}><span className="gr-step-n" aria-hidden="true">{"06"}</span><h3 className="gr-step-t">{"Measure"}</h3><p className="gr-step-d">{"Monthly tracking and a plain report. Then we adjust and repeat from step 3."}</p><span className="gr-step-bar" aria-hidden="true"></span></li>
              </ol>
            </div>
          </div>
        </section>

        {/* ================= WHO + WHY ================= */}
        <section className="gx-section" id="audience">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label">{"Who we help"}</span>
              <h2 className="gx-h2">{"Built for businesses that serve customers "}<em>{"locally"}</em></h2>
              <p className="gx-p">{"In Bengaluru, across India and abroad, from a single shop to multi-location brands."}</p>
            </div>
            <ul className="gx-industries">
              <li><b>{"Clinics & healthcare"}</b><span>{"Doctors, dentists, physiotherapists, diagnostics"}</span></li>
              <li><b>{"Restaurants & cafés"}</b><span>{"Restaurants, cafés, bakeries"}</span></li>
              <li><b>{"Salons, spas & fitness"}</b><span>{"Beauty, wellness and studios"}</span></li>
              <li><b>{"Home & trade services"}</b><span>{"Plumbers, electricians, cleaners, pest control"}</span></li>
              <li><b>{"Professional services"}</b><span>{"Lawyers, accountants, consultants, real estate"}</span></li>
              <li><b>{"Retail & showrooms"}</b><span>{"Stores and brand showrooms"}</span></li>
              <li><b>{"Education"}</b><span>{"Coaching centres, schools, institutes"}</span></li>
              <li><b>{"Multi-location brands"}</b><span>{"Every branch managed consistently"}</span></li>
            </ul>
          </div>
        </section>

        {/* ================= BENGALURU ================= */}
        <section className="gx-section gx-tint" id="bengaluru">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label">{"Local focus · Bengaluru"}</span>
              <h2 className="gx-h2">{"Google Business Profile optimisation in "}<em>{"Bengaluru"}</em></h2>
              <p className="gx-p">{"Bengaluru (Bangalore) is one of the most competitive local search markets in India. Search “dentist near me” or “salon in Indiranagar” and you’ll see dozens of businesses competing within a few kilometres. Being listed isn’t enough. Your profile has to be the clearest, most complete and most active one nearby."}</p>
              <p className="gx-p">{"We help Bengaluru businesses set up their address or service area correctly, choose categories that match how local customers actually search, and keep their profiles accurate as the city changes, from new branches to festival-season hours."}</p>
            </div>
            <div className="gx-blr">
              <div className="gx-blr-card">
                <span className="gx-label">{"Areas we work with"}</span>
                <ul className="gx-blr-areas" aria-label="Bengaluru areas">
                  <li>{"Koramangala"}</li><li>{"Indiranagar"}</li><li>{"HSR Layout"}</li><li>{"Whitefield"}</li><li>{"Jayanagar"}</li><li>{"JP Nagar"}</li><li>{"Electronic City"}</li><li>{"Marathahalli"}</li><li>{"Hebbal"}</li><li>{"Yelahanka"}</li><li>{"Malleshwaram"}</li><li>{"Bellandur"}</li><li>{"Sarjapur Road"}</li><li>{"Rajajinagar"}</li><li>{"…and the rest of Bengaluru"}</li>
                </ul>
              </div>
              <ul className="gx-blr-points">
                <li><b>{"Neighbourhood-level relevance"}</b><span>{"Services, description and posts that reflect the areas you actually serve."}</span></li>
                <li><b>{"Correct storefront or service area"}</b><span>{"Set up the way Google expects, so you stay compliant and visible."}</span></li>
                <li><b>{"Consistent local citations"}</b><span>{"The same name, address and phone across the directories Bengaluru customers use."}</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gx-section gx-dark" id="why-effix">
          <div className="gx-wrap">
            <div className="gx-head gx-head-left">
              <span className="gx-label gx-label-dark">{"Why Effix Labs"}</span>
              <h2 className="gx-h2">{"Why choose us as your Google Business Profile "}<em>{"agency"}</em></h2>
            </div>
            <div className="gx-why">
              <div><span className="gx-why-n" aria-hidden="true">{"01"}</span><h3 className="gx-h3">{"Evidence first"}</h3><p className="gx-p-sm">{"We start with an audit and show you what we found before recommending anything."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"02"}</span><h3 className="gx-h3">{"Guideline-safe"}</h3><p className="gx-p-sm">{"No fake reviews, no keyword-stuffed names, no duplicate listings, nothing that risks suspension."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"03"}</span><h3 className="gx-h3">{"Honest about results"}</h3><p className="gx-p-sm">{"Google controls rankings. We improve what you can control and report what we can measure."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"04"}</span><h3 className="gx-h3">{"Part of a wider plan"}</h3><p className="gx-p-sm">{"Your profile works best alongside a strong site, "}<a href="/services/content-writing">{"helpful content"}</a>{", "}<a href="/services/seo-aeo-services">{"AI search"}</a>{" and "}<a href="/services/reddit-marketing">{"online communities"}</a>{"."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"05"}</span><h3 className="gx-h3">{"Plain-language reporting"}</h3><p className="gx-p-sm">{"You always know what was done, and why."}</p></div>
            </div>
            <p className="gx-disclaimer">{"Effix Labs is an independent agency, not affiliated with or endorsed by Google."}</p>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="gx-section" id="faq">
          <div className="gx-wrap gx-faq-grid">
            <div className="gx-faq-intro">
              <span className="gx-label">{"FAQ"}</span>
              <h2 className="gx-h2">{"Questions about Google Business Profile "}<em>{"optimisation"}</em></h2>
              <p className="gx-p">{"Can’t find your answer? "}<a href="#contact">{"Ask us directly"}</a>{"."}</p>
            </div>
            <div className="faq-accordion-wrap gx-faq">
              <ServiceFaq items={FAQS} />
            </div>
          </div>
        </section>

        {/* ================= RELATED ================= */}
        <section className="gx-section gx-related-sec" id="related">
          <div className="gx-wrap">
            <span className="gx-label">{"Related services"}</span>
            <div className="gx-related">
              <a href="/services/reddit-marketing"><span aria-hidden="true">{"02"}</span>{"Reddit Marketing"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
              <a href="/services/seo-aeo-services"><span aria-hidden="true">{"03"}</span>{"SEO & AEO Services"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
              <a href="/services/content-writing"><span aria-hidden="true">{"04"}</span>{"Content Writing"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
              <a href="/services/website-design-development"><span aria-hidden="true">{"05"}</span>{"Website Design & Development"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
            </div>
          </div>
        </section>

        <section className="cta-section" id="contact">
          {" "}
          <div className="container">
            {" "}
            <div className="cta-form-container gx-glass-stage">
              <span className="gx-orb gx-orb-1" aria-hidden="true"></span><span className="gx-orb gx-orb-2" aria-hidden="true"></span><span className="gx-orb gx-orb-3" aria-hidden="true"></span>
              {" "}
              {" "}
              <div className="cta-left-content">
                {" "}
                <div className="gx-glass-pill">
                  {" LET’S TALK "}
                </div>
                {" "}
                <h2 className="cta-title">
                  {" Make Your Business Easier to Find "}
                  <em>
                    {"on Google."}
                  </em>
                  {" "}
                </h2>
                {" "}
                <p className="cta-desc">
                  {" Find out exactly what’s holding your profile back. Tell us about your business and locations, and we’ll get back to you within one business day with clear next steps. No obligation. "}
                </p>
                {" "}
                <div className="gx-cta-facts">
                  {" "}
                  <div>
                    
                    <strong>
                      {"Direct Email:"}
                    </strong>
                    {" "}
                    <a href="mailto:hello@effixlabs.in">
                      {"hello@effixlabs.in"}
                    </a>
                  </div>
                  {" "}
                  <div>
                    
                    <strong>
                      {"Response Time:"}
                    </strong>
                    {" Within 1 business day"}
                  </div>
                  {" "}
                  <div>
                    
                    <strong>
                      {"Privacy:"}
                    </strong>
                    {" We never share or sell your business information"}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <form className="gbp-form" id="gbpEnquiryForm" data-effix-form="Google Business Profile">
                {" "}
                <div className="form-row-2">
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="fullName">
                      {"Full Name *"}
                    </label>
                    {" "}
                    <input className="form-input" type="text" id="fullName" name="fullName" autoComplete="name" required placeholder="Sarah Jenkins" />
                    {" "}
                  </div>
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="workEmail">
                      {"Work Email *"}
                    </label>
                    {" "}
                    <input className="form-input" type="email" id="workEmail" name="workEmail" autoComplete="email" required placeholder="sarah@business.com" />
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="form-row-2">
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="businessName">
                      {"Business Name *"}
                    </label>
                    {" "}
                    <input className="form-input" type="text" id="businessName" name="businessName" autoComplete="organization" required placeholder="Precision Dental" />
                    {" "}
                  </div>
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="websiteUrl">
                      {"Website URL"}
                    </label>
                    {" "}
                    <input className="form-input" type="url" id="websiteUrl" name="websiteUrl" autoComplete="url" placeholder="https://business.com" />
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="form-group">
                  {" "}
                  <label className="form-label" htmlFor="locationCount">
                    {"Number of Business Locations *"}
                  </label>
                  {" "}
                  <select className="form-select" id="locationCount" name="locationCount" required>
                    <option value="1">
                      {"1 Location (Single Storefront / SAB)"}
                    </option>
                    <option value="2-5">
                      {"2 to 5 Locations"}
                    </option>
                    <option value="6-15">
                      {"6 to 15 Locations"}
                    </option>
                    <option value="16+">
                      {"16+ Multi-Location Enterprise"}
                    </option>
                  </select>
                  {" "}
                </div>
                {" "}
                <div className="form-group">
                  {" "}
                  <label className="form-label" htmlFor="message">
                    {"Message or Requirements *"}
                  </label>
                  {" "}
                  <textarea className="form-textarea" id="message" name="message" rows={3} required placeholder="Tell us about your current Google Business Profile status, challenges, or goals..." defaultValue="" />
                  {" "}
                </div>
                {" "}
                <button type="submit" className="btn-submit" id="submitBtn">
                  {" Send enquiry → "}
                </button>
                {" "}
                <div id="formFeedback" style={{ display: "none", fontSize: "13.5px", padding: "12px", borderRadius: "6px", textAlign: "center", marginTop: "8px" }}></div>
                {" "}
              </form>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
      </main>
      <div className="ab">
        <SiteFooter />
      </div>
      <LegacyScripts id="google-business-profile" srcs={SCRIPTS} />
    </>
  );
}
