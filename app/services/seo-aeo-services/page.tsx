// SEO & AEO Services — service page (shares the GBP/Reddit design system).
import type { Metadata } from "next";
import LegacyScripts from "@/components/LegacyScripts";
import ServiceFaq, { faqPageLd, type FaqItem } from "@/components/ServiceFaq";
import { ORG_ID, ldString } from "@/lib/site";
import "../google-business-profile/page.css";
import "../google-business-profile/gx.css";
import "../reddit-marketing/rm.css";
import "./sa.css";

export const metadata: Metadata = {
  "title": "SEO & AEO Services in India | Effix Labs",
  "description": "SEO & AEO services for businesses across India and Bangalore (Bengaluru). Rank on Google and get cited in AI Overviews, ChatGPT and Perplexity answers.",
  "alternates": {
    "canonical": "https://effixlabs.in/services/seo-aeo-services"
  },
  "openGraph": {
    "title": "SEO & AEO Services in India | Effix Labs",
    "description": "SEO & AEO services for businesses across India and Bangalore (Bengaluru). Rank on Google and get cited in AI Overviews, ChatGPT and Perplexity answers.",
    "url": "https://effixlabs.in/services/seo-aeo-services",
    "type": "website",
    "images": [
      "https://effixlabs.in/images/services/service-03-seo-aeo.jpg"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "SEO & AEO Services in India | Effix Labs",
    "description": "SEO & AEO services for businesses across India and Bangalore (Bengaluru). Rank on Google and get cited in AI Overviews, ChatGPT and Perplexity answers.",
    "images": [
      "https://effixlabs.in/images/services/service-03-seo-aeo.jpg"
    ]
  }
};

const SCRIPTS = [
  "/js/legacy-shim.js",
  "/js/google-business-profile/01.js",
  "/scripts/lenis.min.js",
  "/js/google-business-profile/02.js",
  "/js/google-business-profile/03.js",
  "/js/seo-aeo-services/page.js"
];

const FAQS: FaqItem[] = [
  {
    "q": "What are SEO & AEO services?",
    "a": [
      "SEO & AEO services combine search engine optimisation, which helps your pages rank in Google and Bing, with answer engine optimisation, which helps your business get quoted and recommended in AI answers from Google AI Overviews, ChatGPT, Perplexity and Gemini. The work covers technical fixes, keyword and question research, answer-first content, schema markup, authority building and tracking."
    ]
  },
  {
    "q": "What is the difference between SEO and AEO?",
    "a": [
      "SEO aims to rank your pages so people click through to your website. AEO aims to make your business the answer that AI tools and featured snippets show, often before anyone clicks. They share the same foundations: a fast, crawlable site, helpful content and trusted mentions."
    ]
  },
  {
    "q": "Does AEO replace SEO?",
    "a": [
      "No. AI answers draw heavily on pages that already rank and on sources search engines trust. Google says its AI features rely on the same core SEO practices as regular search, so strong SEO is the base that AEO builds on."
    ]
  },
  {
    "q": "Do you offer SEO & AEO services in Bangalore?",
    "a": [
      "Yes. Effix Labs works with startups, SaaS companies, clinics, real estate firms, D2C brands and local businesses in Bangalore (Bengaluru), and we can meet in person where needed. We also work with businesses across India and abroad."
    ]
  },
  {
    "q": "How long do SEO & AEO take to show results?",
    "a": [
      "Technical fixes and content updates can show early movement within weeks, but meaningful ranking and citation gains usually take three to six months, depending on your site, competition and how much content needs work."
    ]
  },
  {
    "q": "Can you guarantee a #1 ranking or a ChatGPT mention?",
    "a": [
      "No honest agency can. Google and AI companies control their results. What we can do is fix what holds your site back, publish genuinely useful answers and build trust signals, then report progress transparently every month."
    ]
  },
  {
    "q": "How do you measure AI visibility?",
    "a": [
      "We track a set of prompts your buyers are likely to ask across ChatGPT, Perplexity, Gemini and Google AI Overviews, and record whether your brand is mentioned or cited. We combine this with Search Console data, rankings and AI referral traffic in analytics."
    ]
  },
  {
    "q": "How much do SEO & AEO services cost?",
    "a": [
      "Cost depends on the size of your website, how competitive your market is and how much content and technical work is needed. We share a clear monthly scope and quote after reviewing your site and goals."
    ]
  }
];

const SERVICE_LD = {
  "@type": "Service",
  "@id": "https://effixlabs.in/services/seo-aeo-services#service",
  "name": "SEO & AEO Services",
  "alternateName": [
    "SEO and AEO services",
    "Answer engine optimisation services"
  ],
  "serviceType": "Search engine optimisation and answer engine optimisation",
  "provider": {
    "@id": ORG_ID
  },
  "areaServed": [
    {
      "@type": "Country",
      "name": "India"
    },
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
      "@type": "Place",
      "name": "Worldwide"
    }
  ],
  "description": "SEO & AEO services for businesses across India and Bangalore (Bengaluru): technical SEO and AI crawlability, keyword and question research, answer-first content optimisation, schema markup, entity and authority building, and rank and AI visibility tracking across Google, AI Overviews, ChatGPT, Perplexity, Gemini and Bing.",
  "url": "https://effixlabs.in/services/seo-aeo-services"
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
      "name": "SEO & AEO Services",
      "item": "https://effixlabs.in/services/seo-aeo-services"
    }
  ]
};

const JSON_LD = ldString([SERVICE_LD, faqPageLd(FAQS), BREADCRUMB_LD]);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
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
      <main className="gx-page rm-page sa-page">
        {/* ================= HERO ================= */}
        <section className="gx-hero sa-hero" id="hero">
          <div className="gx-wrap gx-hero-inner">
            <h1 className="gx-hero-title">
              {"SEO & "}<em>{"AEO"}</em>{" Services"}
            </h1>
            <p className="gx-hero-sub">{"Rank on Google. Get cited in AI answers."}</p>
            <p className="gx-hero-lede">
              {"People now search in two places: classic Google results and AI answers from Google’s AI Overviews, ChatGPT, Perplexity and Gemini. Effix Labs provides SEO & AEO services that make your business easy to find, easy to understand and easy to recommend in both, for brands across India and in Bangalore."}
            </p>
            <div className="gx-hero-ctas">
              <a href="#lanes" className="gx-btn gx-btn-ghost">{"See how it works"}</a>
            </div>
            <p className="gx-hero-trust">{"Technical SEO · Answer-first content · Schema · AI visibility tracking"}</p>
          </div>

          {/* Hero banner — emerald radar scene (visual left, copy right) */}
          <div className="gx-wrap-wide">
            <div className="sa-banner" id="saBanner">
              <div className="sa-scene" aria-hidden="true">
                <div className="sa-radar">
                  <span className="sa-ring r1"></span><span className="sa-ring r2"></span><span className="sa-ring r3"></span>
                  <span className="sa-sweep"></span>
                  <span className="sa-blip b1"></span><span className="sa-blip b2"></span><span className="sa-blip b3"></span>
                  <span className="sa-core"><b><bdi data-t={"yourbrand"}></bdi></b><small><bdi data-t={".com"}></bdi></small></span>
                </div>
                <span className="sa-orbit-chip c1"><bdi data-t={"Google"}></bdi></span>
                <span className="sa-orbit-chip c2"><bdi data-t={"AI Overviews"}></bdi></span>
                <span className="sa-orbit-chip c3"><bdi data-t={"ChatGPT"}></bdi></span>
                <span className="sa-orbit-chip c4"><bdi data-t={"Perplexity"}></bdi></span>
                <span className="sa-orbit-chip c5"><bdi data-t={"Gemini"}></bdi></span>
                <div className="sa-result">
                  <span className="sa-result-rank"><bdi data-t={"#1"}></bdi></span>
                  <div><b><bdi data-t={"Best SEO agency in Bangalore?"}></bdi></b><small><i></i><bdi data-t={"yourbrand.com · cited in AI answer"}></bdi></small></div>
                </div>
              </div>
              <div className="sa-b-copy">
                <span className="sa-b-kicker">{"SEO + AEO"}</span>
                <p className="sa-b-title"><span className="sa-b-light">{"Rank on Google."}</span><br /><strong>{"GET CITED BY AI."}</strong></p>
                <p className="sa-b-sub"><b>{"One strategy, two kinds of search."}</b>{" We optimise your site so search engines rank it and AI tools trust it enough to recommend it."}</p>
                <a href="#lanes" className="sa-b-btn">{"See how it works"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"></path></svg></a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SEO vs AEO — two lanes ================= */}
        <section className="gx-section" id="lanes">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label sa-label">{"SEO vs AEO"}</span>
              <h2 className="gx-h2">{"What are SEO & AEO services, "}<em>{"and why you need both"}</em></h2>
              <p className="gx-lead">{"SEO (search engine optimisation) helps your pages rank in search results. AEO (answer engine optimisation) helps your business become the answer that AI tools and featured snippets quote. Same foundations, different finish line."}</p>
            </div>
            <div className="sa-lanes">
              <article className="sa-lane">
                <span className="sa-lane-tag">{"SEO"}</span>
                <h3 className="sa-lane-t">{"Get ranked"}</h3>
                <ul>
                  <li><b>{"Goal:"}</b>{" appear on page one for the searches your buyers use"}</li>
                  <li><b>{"Shows up as:"}</b>{" blue links, local results, product listings"}</li>
                  <li><b>{"Built on:"}</b>{" technical health, keywords, content, links"}</li>
                  <li><b>{"Measured by:"}</b>{" rankings, clicks, organic leads"}</li>
                </ul>
              </article>
              <div className="sa-lane-plus" aria-hidden="true"><bdi data-t={"+"}></bdi></div>
              <article className="sa-lane sa-lane-aeo">
                <span className="sa-lane-tag">{"AEO"}</span>
                <h3 className="sa-lane-t">{"Get cited"}</h3>
                <ul>
                  <li><b>{"Goal:"}</b>{" be named and quoted when people ask AI tools a question"}</li>
                  <li><b>{"Shows up as:"}</b>{" AI Overviews, ChatGPT and Perplexity answers, featured snippets"}</li>
                  <li><b>{"Built on:"}</b>{" direct answers, structured data, entity clarity, trusted mentions"}</li>
                  <li><b>{"Measured by:"}</b>{" citations, brand mentions, AI referral traffic"}</li>
                </ul>
              </article>
            </div>
            <p className="sa-lanes-foot">
              {"Google says its AI features rely on the same core SEO practices and helpful content as regular search, which is why we treat SEO and AEO as one programme. Read "}
              <a className="rm-ext" href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">{"AI features and your website"}</a>{"."}
            </p>
          </div>
        </section>

        {/* ================= WHERE WE MAKE YOU VISIBLE ================= */}
        <section className="gx-section gx-dark sa-dark-sec" id="platforms">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label gx-label-dark sa-label-dark">{"Where we make you visible"}</span>
              <h2 className="gx-h2">{"Every place your customers "}<em>{"search and ask"}</em></h2>
            </div>
            <div className="sa-platforms">
              <div className="sa-plat"><b>{"Google Search"}</b><span>{"Technical SEO, keywords and content that earn page-one rankings."}</span></div>
              <div className="sa-plat"><b>{"AI Overviews & AI Mode"}</b><span>{"Clear, well-structured answers Google’s AI features can summarise."}</span></div>
              <div className="sa-plat"><b>{"ChatGPT"}</b><span>{"Accurate brand information and mentions across sources it draws on."}</span></div>
              <div className="sa-plat"><b>{"Perplexity"}</b><span>{"Citable pages with direct answers, data and clear sources."}</span></div>
              <div className="sa-plat"><b>{"Gemini"}</b><span>{"Consistent entity details so Google’s assistant describes you correctly."}</span></div>
              <div className="sa-plat"><b>{"Bing & Copilot"}</b><span>{"Indexing and visibility through "}<a className="rm-ext" href="https://www.bing.com/webmasters/about" target="_blank" rel="noopener noreferrer">{"Bing Webmaster Tools"}</a>{"."}</span></div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}
        <section className="gx-section" id="included">
          <div className="gx-wrap">
            <div className="gx-head gx-head-left">
              <span className="gx-label sa-label">{"What’s included"}</span>
              <h2 className="gx-h2">{"Our SEO & AEO "}<em>{"services"}</em></h2>
            </div>
            <div className="sa-services">
              <article className="sa-svc"><span className="sa-svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V7z"></path><path d="M9 12l2 2 4-4"></path></svg></span><h3>{"Technical SEO & AI crawlability"}</h3><p>{"Site speed, indexing, crawl errors, mobile experience and clean HTML, plus checking that search and AI crawlers can reach your key pages. See "}<a className="rm-ext" href="https://developers.google.com/search/docs/crawling-indexing/robots/intro" target="_blank" rel="noopener noreferrer">{"robots.txt"}</a>{" and "}<a className="rm-ext" href="https://platform.openai.com/docs/bots" target="_blank" rel="noopener noreferrer">{"OpenAI’s crawlers"}</a>{"."}</p></article>
              <article className="sa-svc"><span className="sa-svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6.5"></circle><path d="M20 20l-4-4"></path><path d="M9.5 9.2a1.8 1.8 0 1 1 2.3 1.7c-.5.2-.8.6-.8 1.1"></path></svg></span><h3>{"Keyword & question research"}</h3><p>{"The keywords people type and the questions they ask AI tools and “People also ask”, mapped to the right page."}</p></article>
              <article className="sa-svc"><span className="sa-svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h10M4 18h7"></path></svg></span><h3>{"Answer-first content optimisation"}</h3><p>{"Pages that lead with a direct answer, then the detail: headings, lists, tables and FAQs that both readers and AI can use. Written with our "}<a href="/services/content-writing">{"content writing"}</a>{" team."}</p></article>
              <article className="sa-svc"><span className="sa-svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4L3 12l5 8M16 4l5 8-5 8"></path></svg></span><h3>{"Schema & structured data"}</h3><p>{"Organization, LocalBusiness, Service, FAQ, Product and Article markup so search engines understand your pages. See Google’s "}<a className="rm-ext" href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" target="_blank" rel="noopener noreferrer">{"structured data guide"}</a>{"."}</p></article>
              <article className="sa-svc"><span className="sa-svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="3"></circle><circle cx="5" cy="18" r="2.5"></circle><circle cx="19" cy="18" r="2.5"></circle><path d="M10.5 9.5L6.5 16M13.5 9.5l4 6.5M7.5 18h9"></path></svg></span><h3>{"Entity & authority building"}</h3><p>{"Consistent brand details across your site, profiles and directories, plus genuine mentions on trusted sites, "}<a href="/services/google-business-profile">{"Google Business Profile"}</a>{" and "}<a href="/services/reddit-marketing">{"Reddit"}</a>{"."}</p></article>
              <article className="sa-svc"><span className="sa-svc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16"></path><path d="M7 16v-4M12 16V8M17 16V5"></path></svg></span><h3>{"Rank & AI visibility tracking"}</h3><p>{"Monthly reporting on rankings, clicks, AI citations and brand mentions, using "}<a className="rm-ext" href="https://search.google.com/search-console/about" target="_blank" rel="noopener noreferrer">{"Google Search Console"}</a>{" and prompt tracking across AI tools."}</p></article>
            </div>
          </div>
        </section>

        {/* ================= PROCESS — vertical timeline ================= */}
        <section className="gx-section sa-tint" id="process">
          <div className="gx-wrap sa-process">
            <div className="sa-process-head">
              <span className="gx-label sa-label">{"Our process"}</span>
              <h2 className="gx-h2">{"How our SEO & AEO "}<em>{"process works"}</em></h2>
              <p className="gx-p">{"A clear, repeatable programme. You always know what we’re working on and why."}</p>
            </div>
            <ol className="sa-timeline" id="saTimeline">
              <li><span className="sa-tl-n" aria-hidden="true">{"01"}</span><div><h3>{"Audit"}</h3><p>{"Technical health, rankings, content gaps, and how AI tools currently describe your brand and competitors."}</p></div></li>
              <li><span className="sa-tl-n" aria-hidden="true">{"02"}</span><div><h3>{"Map keywords & questions"}</h3><p>{"Every important search and question assigned to one page, existing or new."}</p></div></li>
              <li><span className="sa-tl-n" aria-hidden="true">{"03"}</span><div><h3>{"Fix & build"}</h3><p>{"Technical fixes, answer-first content updates and schema, in prioritised monthly sprints."}</p></div></li>
              <li><span className="sa-tl-n" aria-hidden="true">{"04"}</span><div><h3>{"Grow authority"}</h3><p>{"Consistent entity details and genuine mentions on the sites search engines and AI tools trust."}</p></div></li>
              <li><span className="sa-tl-n" aria-hidden="true">{"05"}</span><div><h3>{"Track & refine"}</h3><p>{"Rankings, clicks and AI citations reviewed monthly, then the plan is adjusted."}</p></div></li>
            </ol>
          </div>
        </section>

        {/* ================= BANGALORE ================= */}
        <section className="gx-section" id="bangalore">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label sa-label">{"Local focus · Bangalore"}</span>
              <h2 className="gx-h2">{"SEO & AEO services in "}<em>{"Bangalore"}</em></h2>
              <p className="gx-p">{"Bangalore (Bengaluru) is one of India’s most competitive search markets. Startups, SaaS companies, clinics, real estate firms and D2C brands all compete for the same searches, and increasingly for the same AI recommendations."}</p>
              <p className="gx-p">{"We help Bangalore businesses rank for local and national searches, appear in “near me” and map results, and get named when buyers ask AI tools for recommendations in the city."}</p>
            </div>
            <div className="gx-blr">
              <div className="gx-blr-card">
                <span className="gx-label sa-label">{"Bangalore businesses we help"}</span>
                <ul className="gx-blr-areas sa-areas" aria-label="Bangalore industries">
                  <li>{"SaaS"}</li><li>{"Fintech"}</li><li>{"D2C brands"}</li><li>{"AI startups"}</li><li>{"Clinics"}</li><li>{"Real estate"}</li><li>{"Edtech"}</li><li>{"Restaurants"}</li><li>{"Professional services"}</li><li>{"…and more"}</li>
                </ul>
              </div>
              <ul className="gx-blr-points">
                <li><b>{"Local + national"}</b><span>{"Rank in Koramangala, Whitefield and HSR, and across India."}</span></li>
                <li><b>{"Local AI recommendations"}</b><span>{"Clear entity details so AI tools recommend you for city searches."}</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="gx-section sa-tint" id="faq">
          <div className="gx-wrap gx-faq-grid">
            <div className="gx-faq-intro">
              <span className="gx-label sa-label">{"FAQ"}</span>
              <h2 className="gx-h2">{"Questions about SEO & AEO "}<em>{"services"}</em></h2>
              <p className="gx-p">{"Can’t find your answer? Use the form below and we’ll reply within one business day."}</p>
            </div>
            <div className="faq-accordion-wrap gx-faq">
              <ServiceFaq items={FAQS} />
            </div>
          </div>
        </section>

        {/* ================= RELATED ================= */}
        <section className="gx-section gx-related-sec" id="related">
          <div className="gx-wrap">
            <span className="gx-label sa-label">{"Related services"}</span>
            <div className="gx-related">
              <a href="/services/google-business-profile"><span aria-hidden="true">{"01"}</span>{"Google Business Profile Optimisation"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
              <a href="/services/reddit-marketing"><span aria-hidden="true">{"02"}</span>{"Reddit Marketing"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
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
                  {" LET’S TALK SEARCH "}
                </div>
                {" "}
                <h2 className="cta-title">
                  {" Get Found on Google "}
                  <em>
                    {"and in AI Answers."}
                  </em>
                  {" "}
                </h2>
                {" "}
                <p className="cta-desc">
                  {" Tell us about your website, your market and the searches you want to win. We’ll reply within one business day with our first observations and next steps. "}
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
              <form className="gbp-form" id="seoAeoEnquiryForm" data-onsubmit="handleSeoAeoSubmit(event)">
                {" "}
                <div className="form-row-2">
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="fullName">
                      {"Full Name *"}
                    </label>
                    {" "}
                    <input className="form-input" type="text" id="fullName" name="fullName" required placeholder="Sarah Jenkins" />
                    {" "}
                  </div>
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="workEmail">
                      {"Work Email *"}
                    </label>
                    {" "}
                    <input className="form-input" type="email" id="workEmail" name="workEmail" required placeholder="sarah@business.com" />
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
                      {"Brand / Company *"}
                    </label>
                    {" "}
                    <input className="form-input" type="text" id="businessName" name="businessName" required placeholder="Acme Labs" />
                    {" "}
                  </div>
                  {" "}
                  <div className="form-group">
                    {" "}
                    <label className="form-label" htmlFor="websiteUrl">
                      {"Website URL"}
                    </label>
                    {" "}
                    <input className="form-input" type="url" id="websiteUrl" name="websiteUrl" placeholder="https://business.com" />
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                <div className="form-group">
                  {" "}
                  <label className="form-label" htmlFor="locationCount">
                    {"What do you need? *"}
                  </label>
                  {" "}
                  <select className="form-select" id="locationCount" name="need" required>
                    <option value="SEO and AEO">{"SEO & AEO together"}</option>
                    <option value="SEO only">{"SEO (Google rankings)"}</option>
                    <option value="AEO only">{"AEO (AI answers & citations)"}</option>
                    <option value="Local SEO Bangalore">{"Local SEO in Bangalore"}</option>
                    <option value="Not sure yet">{"Not sure yet"}</option>
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
                  <textarea className="form-textarea" id="message" name="message" rows={3} required placeholder="Your website, your main services or products, where your customers are, and the searches you want to show up for." defaultValue="" />
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
      <LegacyScripts id="seo-aeo-services" srcs={SCRIPTS} />
    </>
  );
}
