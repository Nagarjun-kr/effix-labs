// Content Writing Services — service page (shares the GBP/Reddit design system).
import type { Metadata } from "next";
import LegacyScripts from "@/components/LegacyScripts";
import ServiceFaq, { faqPageLd, type FaqItem } from "@/components/ServiceFaq";
import { ORG_ID, ldString } from "@/lib/site";
import "../google-business-profile/page.css";
import "../google-business-profile/gx.css";
import "../reddit-marketing/rm.css";
import "./cw.css";
import "./cw-flow.css";

export const metadata: Metadata = {
  "title": "Content Writing Services in India | Effix Labs",
  "description": "Content writing services for brands across India and Bengaluru: SEO blogs, website copy, service pages and more. Human-written, fact-checked, SEO-ready.",
  "alternates": {
    "canonical": "https://effix.co.in/services/content-writing"
  },
  "openGraph": {
    "title": "Content Writing Services in India | Effix Labs",
    "description": "Content writing services for brands across India and Bengaluru: SEO blogs, website copy, service pages and more. Human-written, fact-checked, SEO-ready.",
    "url": "https://effix.co.in/services/content-writing",
    "type": "website",
    "images": [
      "https://effix.co.in/images/services/service-04-content-writing.jpg"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Content Writing Services in India | Effix Labs",
    "description": "Content writing services for brands across India and Bengaluru: SEO blogs, website copy, service pages and more. Human-written, fact-checked, SEO-ready.",
    "images": [
      "https://effix.co.in/images/services/service-04-content-writing.jpg"
    ]
  }
};

const SCRIPTS = [
  "/js/legacy-shim.js",
  "/js/google-business-profile/01.js",
  "/scripts/lenis.min.js",
  "/js/google-business-profile/02.js",
  "/js/google-business-profile/03.js",
  "/js/content-writing/page.js"
];

const FAQS: FaqItem[] = [
  {
    "q": "What are content writing services?",
    "a": [
      "Content writing services cover the research, planning, writing and editing of content for your website and marketing: blog posts, web pages, service and landing pages, product descriptions, case studies, newsletters and more. Good content writing services also handle keyword research and on-page SEO, so your content gets found by the right people."
    ]
  },
  {
    "q": "How much do content writing services cost in India?",
    "a": [
      "Cost depends on the type of content, research depth, length, volume and turnaround. A short product description costs far less than a researched long-form guide or a full website. Effix Labs quotes per project after understanding your scope, so you know the price before any work starts."
    ]
  },
  {
    "q": "Do you offer content writing services in Bengaluru?",
    "a": [
      "Yes. Effix Labs works with startups, SaaS companies, fintechs, D2C brands and local businesses in Bengaluru (Bangalore), and we can meet in person where needed. We also write location and service pages that support local search visibility."
    ]
  },
  {
    "q": "Do you use AI to write content?",
    "a": [
      "Our writers may use tools to help with research, but every piece is written, edited and fact-checked by people. Google’s guidance focuses on whether content is helpful and reliable, not on how it is produced, and human expertise is what makes content genuinely useful.",
      " See ",
      {
        "text": "Google Search and AI-generated content",
        "href": "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content"
      },
      "."
    ]
  },
  {
    "q": "Is the content original and plagiarism-free?",
    "a": [
      "Yes. Every piece is written from scratch for you and checked for plagiarism before delivery. We cite sources where we use facts, data or quotes.",
      " Original content also keeps you clear of Google’s ",
      {
        "text": "spam policies",
        "href": "https://developers.google.com/search/docs/essentials/spam-policies"
      },
      "."
    ]
  },
  {
    "q": "Who owns the content you write?",
    "a": [
      "You do. Once the work is paid for, the content belongs to your business to publish, edit and reuse as you like."
    ]
  },
  {
    "q": "How long does it take to write and deliver content?",
    "a": [
      "A typical blog post takes a few working days after the brief is approved. Larger projects, like full website copy or a content calendar, are delivered on an agreed schedule. Rush delivery is possible depending on scope."
    ]
  },
  {
    "q": "Do you include revisions?",
    "a": [
      "Yes. Every piece includes revisions within the agreed brief, so the final version reads exactly the way you want."
    ]
  },
  {
    "q": "Can you write for my industry?",
    "a": [
      "Most likely. We write for SaaS, ecommerce, fintech, healthcare, education, real estate, B2B services and local businesses. For specialist topics, we work with your team to make sure every detail is accurate."
    ]
  },
  {
    "q": "Will your content help my website rank on Google?",
    "a": [
      "Our content is built to rank, with keyword research, search intent and on-page SEO in every piece. No one can guarantee rankings, because Google controls them, but helpful, well-optimised content is the foundation of organic growth.",
      " We measure progress in ",
      {
        "text": "Google Search Console",
        "href": "https://search.google.com/search-console/about"
      },
      "."
    ]
  },
  {
    "q": "Can you improve or rewrite our existing content?",
    "a": [
      "Yes. Refreshing underperforming pages is often the fastest way to win more traffic. We review what you have, update and improve it, and fix titles, structure and internal links."
    ]
  },
  {
    "q": "Do you work with businesses across India and abroad?",
    "a": [
      "Yes. We work with businesses all over India and internationally. Content writing is done remotely, with clear briefs, shared drafts and regular check-ins."
    ]
  }
];

const SERVICE_LD = {
  "@type": "Service",
  "@id": "https://effix.co.in/services/content-writing#service",
  "name": "Content Writing Services",
  "serviceType": "SEO content writing, website copywriting and editorial services",
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
  "description": "Content writing services for brands across India and Bengaluru: SEO blog writing, website copywriting, service and landing pages, product descriptions, pillar pages, case studies, newsletters, LinkedIn content, content refreshes, editing and on-page SEO.",
  "url": "https://effix.co.in/services/content-writing"
};

const BREADCRUMB_LD = {
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://effix.co.in/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://effix.co.in/#services"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Content Writing Services",
      "item": "https://effix.co.in/services/content-writing"
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
      <main className="gx-page rm-page cw-page">
        {/* ================= HERO ================= */}
        <section className="gx-hero" id="hero">
          <div className="gx-wrap gx-hero-inner">
            <h1 className="gx-hero-title">
              {"Content "}<em>{"Writing"}</em>{" Services"}
            </h1>
            <p className="gx-hero-sub">{"Content that ranks, reads well and turns readers into customers."}</p>
            <p className="gx-hero-lede">
              {"Effix Labs provides content writing services for brands across India and in Bengaluru: SEO blog posts, website copy, service pages, product descriptions, case studies and more. Every piece is researched, written and edited by people, built for search engines and AI answers, and written to sound like your brand."}
            </p>
            <div className="gx-hero-ctas">
              <a href="#included" className="gx-btn gx-btn-ghost">{"See what we write"}</a>
            </div>
            <p className="gx-hero-trust">{"Human-written · SEO-ready · Fact-checked · Original"}</p>
          </div>

          {/* Hero banner — original 3D scene built in CSS */}
          <div className="gx-wrap-wide">
            <div className="cw-banner" id="cwBanner">
              <div className="cw-b-copy">
                <span className="cw-b-kicker">{"Content writing"}</span>
                <p className="cw-b-title"><span className="cw-b-light">{"Words that get found."}</span><br /><strong>{"WRITTEN TO CONVERT."}</strong></p>
                <p className="cw-b-sub"><b>{"Researched, written and edited by people."}</b>{" Built around what your customers search for, and what they need to hear before they buy."}</p>
                <a href="#process" className="cw-b-btn">{"See how we write"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"></path></svg></a>
              </div>
              <div className="cw-b-scene" aria-hidden="true">
                <div className="cw-doc">
                  <div className="cw-doc-bar"><i></i><i></i><i></i><span><bdi data-t={"blog-post-draft.doc"}></bdi></span></div>
                  <div className="cw-doc-body">
                    <span className="cw-doc-h"></span>
                    <span className="cw-doc-l"></span><span className="cw-doc-l"></span><span className="cw-doc-l s"></span>
                    <p className="cw-typing"><span id="cwTyped"><bdi data-t={"How to choose the right CRM for a small team"}></bdi></span><span className="cw-caret"></span></p>
                    <span className="cw-doc-l"></span><span className="cw-doc-l m"></span>
                  </div>
                </div>
                <div className="cw-pen-badge"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l4-1 10-10-3-3L5 16z"></path><path d="M14 7l3 3"></path><path d="M4 20l3.5-3.5"></path></svg></div>
                <span className="cw-chip cw-chip-a"><b><bdi data-t={"✓"}></bdi></b><bdi data-t={" Fact-checked"}></bdi></span>
                <span className="cw-chip cw-chip-b"><bdi data-t={"SEO score · Ready"}></bdi></span>
                <span className="cw-chip cw-chip-c"><bdi data-t={"✍ Human-written"}></bdi></span>
                <span className="cw-orb cw-orb-1"></span><span className="cw-orb cw-orb-2"></span>
                <span className="cw-cone"></span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MARQUEE ================= */}
        <div className="gx-marquee" id="gxMarquee">
          <div className="gx-marquee-track">
            <div className="gx-marquee-set"><span>{"Blog posts"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Website copy"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Service pages"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Landing pages"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Product descriptions"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Case studies"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"Newsletters"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i><span>{"LinkedIn posts"}</span><i aria-hidden="true"><bdi data-t={"—"}></bdi></i></div>
          </div>
        </div>

        {/* ================= WHAT IS ================= */}
        <section className="gx-section" id="what-is">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label">{"What it is"}</span>
              <h2 className="gx-h2">{"What are content writing "}<em>{"services?"}</em></h2>
            </div>
            <div className="gx-split-body">
              <p className="gx-statement">
                {"Content writing services cover the planning, research, writing and editing of the words on your website and marketing channels: blog articles, web pages, product copy, guides and more, written so the right people find them and act on them."}
              </p>
              <p className="gx-p">{"Good content does three jobs at once. It answers a real question better than the other results. It shows search engines and AI tools that your business is a reliable source. And it moves the reader one step closer to choosing you. Most content does only the first job, if that. Ours is planned for all three."}</p>
              <p className="gx-p">{"That’s why our content writing services combine "}<b>{"SEO content writing"}</b>{", "}<b>{"copywriting"}</b>{" and "}<b>{"editorial standards"}</b>{" in one team, so you don’t have to brief three different people to get one good page. Everything follows Google’s "}<a className="rm-ext" href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noopener noreferrer">{"SEO Starter Guide"}</a>{"."}</p>
              <ul className="gx-chips" aria-label="What content writing covers">
                <li>{"Keyword & intent research"}</li><li>{"Content briefs"}</li><li>{"SEO blog writing"}</li><li>{"Website copywriting"}</li><li>{"Editing & proofreading"}</li><li>{"Fact-checking"}</li><li>{"On-page SEO"}</li><li>{"Content refreshes"}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= SPLIT 1 · PROBLEMS ================= */}
        <section className="gx-section gx-tint rm-split-sec" id="problems">
          <div className="gx-wrap rm-split">
            <div className="rm-split-copy">
              <span className="gx-label">{"Sound familiar?"}</span>
              <h2 className="gx-h2">{"Content that isn’t "}<em>{"pulling its weight"}</em></h2>
              <p className="rm-split-sub">{"Does this sound like your website?"}</p>
              <ul className="rm-bullets">
                <li>{"We publish blogs regularly, but they get "}<b>{"almost no traffic"}</b>{" from Google."}</li>
                <li>{"Our content sounds "}<b>{"generic"}</b>{", like it could be from any company, or obviously written by AI. (Google’s "}<a className="rm-ext" href="https://developers.google.com/search/docs/essentials/spam-policies" target="_blank" rel="noopener noreferrer">{"spam policies"}</a>{" warn against mass-produced, low-value content.)"}</li>
                <li>{"Writers don’t understand our "}<b>{"product or industry"}</b>{", so we end up rewriting everything ourselves."}</li>
                <li>{"Our service pages get visits but "}<b>{"don’t convert"}</b>{", and we’re not showing up in "}<b>{"AI answers"}</b>{" either."}</li>
              </ul>
            </div>
            <div className="rm-card cw-card-pain" aria-hidden="true">
              <div className="cw-gsc">
                <div className="cw-gsc-head"><span><bdi data-t={"Search performance · last 3 months"}></bdi></span><em><bdi data-t={"Illustrative"}></bdi></em></div>
                <div className="cw-gsc-stats"><div><small><bdi data-t={"Clicks"}></bdi></small><b><bdi data-t={"38"}></bdi></b></div><div><small><bdi data-t={"Impressions"}></bdi></small><b><bdi data-t={"2.1k"}></bdi></b></div><div><small><bdi data-t={"Avg. position"}></bdi></small><b><bdi data-t={"46.8"}></bdi></b></div></div>
                <svg className="cw-gsc-line" viewBox="0 0 300 70" preserveAspectRatio="none"><path d="M0 52 C40 50 60 56 90 51 S150 55 180 50 S240 54 300 52" fill="none" stroke="#a5a8b5" strokeWidth="2.4"></path></svg>
              </div>
              <div className="cw-post"><span className="cw-post-tag"><bdi data-t={"Blog"}></bdi></span><b><bdi data-t={"10 Tips for Business Growth"}></bdi></b><span className="cw-post-meta"><bdi data-t={"Published 8 months ago · 0 conversions"}></bdi></span></div>
              <div className="rm-pain-row"><span className="rm-pain-chip rm-chip-red"><bdi data-t={"Generic, no expertise"}></bdi></span><span className="rm-pain-chip rm-chip-amber"><bdi data-t={"No search intent"}></bdi></span></div>
            </div>
          </div>
        </section>

        {/* ================= SPLIT 2 · HOW WE FIX ================= */}
        <section className="gx-section rm-split-sec" id="fix">
          <div className="gx-wrap rm-split rm-split-rev">
            <div className="rm-split-copy">
              <span className="gx-label">{"Our answer"}</span>
              <h2 className="gx-h2">{"How we write content "}<em>{"that works"}</em></h2>
              <p className="rm-split-sub">{"Every piece starts with a brief, not a blank page."}</p>
              <ul className="rm-bullets">
                <li>{"We research "}<b>{"what people actually search for"}</b>{", and why, before a single word is written."}</li>
                <li>{"Writers work from a "}<b>{"detailed content brief"}</b>{": keyword, search intent, outline, sources, and your brand voice."}</li>
                <li>{"Your team’s "}<b>{"real expertise"}</b>{" goes into every piece through a short interview or notes, so content shows first-hand knowledge, not filler: the experience and expertise Google’s "}<a className="rm-ext" href="https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf" target="_blank" rel="noopener noreferrer">{"quality rater guidelines"}</a>{" describe."}</li>
                <li>{"Every draft is "}<b>{"edited, fact-checked and optimised"}</b>{" for search and AI answers, then refreshed as results come in."}</li>
              </ul>
            </div>
            <div className="rm-card cw-card-brief" aria-hidden="true">
              <p className="rm-sys-title"><bdi data-t={"Content brief"}></bdi></p>
              <div className="cw-brief-row"><small><bdi data-t={"Primary keyword"}></bdi></small><b><bdi data-t={"crm for small business"}></bdi></b></div>
              <div className="cw-brief-row"><small><bdi data-t={"Search intent"}></bdi></small><b className="cw-pill"><bdi data-t={"Commercial · comparing options"}></bdi></b></div>
              <div className="cw-brief-outline">
                <small><bdi data-t={"Outline"}></bdi></small>
                <span><i><bdi data-t={"H1"}></bdi></i><bdi data-t={"Best CRM for Small Businesses in India"}></bdi></span>
                <span><i><bdi data-t={"H2"}></bdi></i><bdi data-t={"What a small team actually needs"}></bdi></span>
                <span><i><bdi data-t={"H2"}></bdi></i><bdi data-t={"Comparison table: price, features, support"}></bdi></span>
                <span><i><bdi data-t={"H2"}></bdi></i><bdi data-t={"FAQs from real buyers"}></bdi></span>
              </div>
              <div className="cw-brief-checks"><span><bdi data-t={"✓ Expert quote"}></bdi></span><span><bdi data-t={"✓ Sources cited"}></bdi></span><span><bdi data-t={"✓ Brand voice"}></bdi></span><span><bdi data-t={"✓ Internal links"}></bdi></span></div>
            </div>
          </div>
        </section>

        {/* ================= WHY NOW (bento) ================= */}
        <section className="gx-section gx-tint" id="why">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"Why it matters now"}</span>
              <h2 className="gx-h2">{"Why quality content writing "}<em>{"matters more than ever"}</em></h2>
            </div>
            <div className="cw-bento">
              <article className="cw-bento-card cw-bento-main">
                <div className="cw-bento-copy">
                  <span className="cw-bento-tag">{"Search"}</span>
                  <h3 className="cw-bento-t">{"Google rewards helpful content"}</h3>
                  <p className="cw-bento-p">{"Google says its ranking systems aim to show helpful, reliable content created for people, not content made to game rankings. Thin, generic articles struggle; original, expert, well-structured pages earn the visibility."}</p>
                  <a className="rm-ext" href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" target="_blank" rel="noopener noreferrer">{"Read Google’s guidance"}</a>
                </div>
                <div className="cw-serp" aria-hidden="true">
                  <div className="cw-serp-bar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg><span><bdi data-t={"best crm for small business india"}></bdi></span></div>
                  <div className="cw-serp-res cw-serp-top">
                    <span className="cw-serp-url"><bdi data-t={"yourbrand.com › guides"}></bdi></span>
                    <b><bdi data-t={"Best CRM for Small Businesses in India (2026 Guide)"}></bdi></b>
                    <span className="cw-serp-desc"><bdi data-t={"We compared 8 CRMs on price, setup time and support for small teams…"}></bdi></span>
                    <div className="cw-serp-badges"><i><bdi data-t={"Helpful"}></bdi></i><i><bdi data-t={"Expert"}></bdi></i><i><bdi data-t={"Original"}></bdi></i></div>
                  </div>
                  <div className="cw-serp-res cw-serp-dim"><span className="cw-serp-url"><bdi data-t={"genericblog.com"}></bdi></span><b><bdi data-t={"10 Best CRMs You Need to Know"}></bdi></b></div>
                </div>
              </article>
              <article className="cw-bento-card cw-bento-ai">
                <span className="cw-bento-tag">{"AI answers"}</span>
                <h3 className="cw-bento-t">{"AI tools quote clear sources"}</h3>
                <p className="cw-bento-p">{"AI Overviews and assistants summarise pages that answer questions directly, with clean structure and real expertise. See "}<a className="rm-ext" href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">{"AI features and your website"}</a>{"."}</p>
                <div className="cw-ai" aria-hidden="true">
                  <span className="cw-ai-tag"><bdi data-t={"✦ AI overview"}></bdi></span>
                  <span className="cw-ai-l"></span><span className="cw-ai-l s"></span>
                  <span className="cw-ai-src"><i></i><bdi data-t={"yourbrand.com"}></bdi><em><bdi data-t={"cited"}></bdi></em></span>
                </div>
              </article>
              <article className="cw-bento-card cw-bento-journey">
                <span className="cw-bento-tag">{"Buyers"}</span>
                <h3 className="cw-bento-t">{"Decisions start long before the call"}</h3>
                <p className="cw-bento-p">{"Buyers read, compare and shortlist on their own. The content they find decides whether you make the list."}</p>
                <ol className="cw-journey" aria-label="Buyer journey">
                  <li><span>{"Read"}</span></li><li><span>{"Compare"}</span></li><li><span>{"Shortlist"}</span></li><li className="is-goal"><span>{"Contact"}</span></li>
                </ol>
              </article>
            </div>
          </div>
        </section>

        {/* ================= CONTENT TYPES TABLE ================= */}
        <section className="gx-section" id="types">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"Content types"}</span>
              <h2 className="gx-h2">{"What we write, and "}<em>{"what each one is for"}</em></h2>
              <p className="gx-lead">{"Different goals need different content. Here’s how each type fits into your marketing."}</p>
            </div>
            <div className="gx-table-wrap" role="region" aria-label="Types of content we write" tabIndex={0}>
              <table className="gx-table">
                <thead><tr><th scope="col">{"Content type"}</th><th scope="col">{"Best for"}</th><th scope="col">{"Typical length"}</th></tr></thead>
                <tbody>
                  <tr><td>{"SEO blog posts & articles"}</td><td data-label="Best for">{"Organic traffic, answering buyer questions, topical authority"}</td><td data-label="Typical length">{"1,200–2,500 words"}</td></tr>
                  <tr><td>{"Website copy (home, about)"}</td><td data-label="Best for">{"First impressions, positioning, trust"}</td><td data-label="Typical length">{"400–1,000 words per page"}</td></tr>
                  <tr><td>{"Service & landing pages"}</td><td data-label="Best for">{"Ranking for commercial keywords, enquiries and sales"}</td><td data-label="Typical length">{"800–2,500 words"}</td></tr>
                  <tr><td>{"Product & category descriptions"}</td><td data-label="Best for">{"Ecommerce visibility and conversion"}</td><td data-label="Typical length">{"100–400 words each"}</td></tr>
                  <tr><td>{"Pillar pages & long-form guides"}</td><td data-label="Best for">{"Owning a topic, earning links, AI citations"}</td><td data-label="Typical length">{"2,500–5,000 words"}</td></tr>
                  <tr><td>{"Case studies"}</td><td data-label="Best for">{"Proof for buyers in the decision stage"}</td><td data-label="Typical length">{"800–1,500 words"}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= WHAT'S INCLUDED ================= */}
        <section className="gx-section gx-tint" id="included">
          <div className="gx-wrap">
            <div className="gx-head gx-head-left">
              <span className="gx-label">{"What’s included"}</span>
              <h2 className="gx-h2">{"Our content writing "}<em>{"services"}</em></h2>
            </div>
            <ol className="gx-services">
              <li><span className="gx-svc-n" aria-hidden="true">{"01"}</span><h3 className="gx-svc-t">{"SEO blog & article writing"}</h3><p>{"Articles planned around real search demand, written to answer the question better than anything else on page one."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"02"}</span><h3 className="gx-svc-t">{"Website copywriting"}</h3><p>{"Clear, confident copy for your home, about and core pages that explains what you do and why it matters."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"03"}</span><h3 className="gx-svc-t">{"Service & landing page content"}</h3><p>{"Pages built to rank for commercial keywords and turn visitors into enquiries, like the page you’re reading."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"04"}</span><h3 className="gx-svc-t">{"Product & category descriptions"}</h3><p>{"Unique, benefit-led descriptions for ecommerce stores, written at scale without sounding repetitive."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"05"}</span><h3 className="gx-svc-t">{"Pillar pages & long-form guides"}</h3><p>{"In-depth resources that build topical authority and give other sites and AI tools a reason to cite you."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"06"}</span><h3 className="gx-svc-t">{"Case studies & whitepapers"}</h3><p>{"Proof-driven B2B content built from interviews with your team and customers."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"07"}</span><h3 className="gx-svc-t">{"Email newsletters"}</h3><p>{"Regular emails people actually open, with one clear message and one clear next step."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"08"}</span><h3 className="gx-svc-t">{"LinkedIn & social content"}</h3><p>{"Posts for founders and brands that share genuine insight, not engagement bait."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"09"}</span><h3 className="gx-svc-t">{"Content refresh & rewrites"}</h3><p>{"Updating and improving existing pages that have slipped in rankings, often the fastest win available."}</p></li>
              <li><span className="gx-svc-n" aria-hidden="true">{"10"}</span><h3 className="gx-svc-t">{"Editing, proofreading & on-page SEO"}</h3><p>{"Polishing drafts you already have: structure, clarity, headings and internal links, plus "}<a className="rm-ext" href="https://developers.google.com/search/docs/appearance/title-link" target="_blank" rel="noopener noreferrer">{"titles"}</a>{" and "}<a className="rm-ext" href="https://developers.google.com/search/docs/appearance/snippet" target="_blank" rel="noopener noreferrer">{"meta descriptions"}</a>{" written the way Google displays them."}</p></li>
            </ol>
          </div>
        </section>


        {/* ================= PROCESS — the page writes itself (scrubber) ================= */}
        <section className="gx-section gx-tint" id="process">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label">{"Our process"}</span>
              <h2 className="gx-h2">{"How our content writing "}<em>{"process works"}</em></h2>
              <p className="gx-lead">{"Drag the slider and watch a blank page become a published, ranking piece."}</p>
            </div>
            <div className="cf at-1" id="cwFlow">
              <ol className="cf-steps">
                <li className="cf-step is-on"><div className="cf-num" aria-hidden="true"><b><bdi data-t={"01"}></bdi></b><span><bdi data-t={"/ 06"}></bdi></span></div><h3 className="cf-t">{"Discovery"}</h3><p className="cf-d">{"Your business, audience, goals, competitors and brand voice, captured in one short session."}</p></li>
                <li className="cf-step"><div className="cf-num" aria-hidden="true"><b><bdi data-t={"02"}></bdi></b><span><bdi data-t={"/ 06"}></bdi></span></div><h3 className="cf-t">{"Keyword & intent research"}</h3><p className="cf-d">{"What your buyers search for, what Google ranks for it today, and the gaps we can win."}</p></li>
                <li className="cf-step"><div className="cf-num" aria-hidden="true"><b><bdi data-t={"03"}></bdi></b><span><bdi data-t={"/ 06"}></bdi></span></div><h3 className="cf-t">{"Content brief"}</h3><p className="cf-d">{"Keyword, intent, outline, sources and voice notes, agreed with you before writing starts."}</p></li>
                <li className="cf-step"><div className="cf-num" aria-hidden="true"><b><bdi data-t={"04"}></bdi></b><span><bdi data-t={"/ 06"}></bdi></span></div><h3 className="cf-t">{"Writing"}</h3><p className="cf-d">{"Experienced writers draft the piece, adding your team’s expertise and real examples."}</p></li>
                <li className="cf-step"><div className="cf-num" aria-hidden="true"><b><bdi data-t={"05"}></bdi></b><span><bdi data-t={"/ 06"}></bdi></span></div><h3 className="cf-t">{"Editing & fact-checking"}</h3><p className="cf-d">{"An editor checks accuracy, clarity, structure, originality and on-page SEO."}</p></li>
                <li className="cf-step"><div className="cf-num" aria-hidden="true"><b><bdi data-t={"06"}></bdi></b><span><bdi data-t={"/ 06"}></bdi></span></div><h3 className="cf-t">{"Publish, measure & refresh"}</h3><p className="cf-d">{"We track clicks and rankings in "}<a className="rm-ext" href="https://search.google.com/search-console/about" target="_blank" rel="noopener noreferrer">{"Google Search Console"}</a>{", and refresh content as results and searches change."}</p></li>
              </ol>
              <div className="cf-doc" aria-hidden="true">
                <div className="cf-bar"><i></i><i></i><i></i><span className="cf-file"><bdi data-t={"how-to-choose-a-crm.doc"}></bdi></span><span className="cf-status" id="cfStatus"><bdi data-t={"Discovery"}></bdi></span></div>
                <div className="cf-page">
                  <div className="cf-layer cf-notes"><span className="cf-note n1"><bdi data-t={"Audience"}></bdi></span><span className="cf-note n2"><bdi data-t={"Goal"}></bdi></span><span className="cf-note n3"><bdi data-t={"Brand voice"}></bdi></span></div>
                  <div className="cf-layer cf-kw"><span><bdi data-t={"crm for small teams"}></bdi></span><span><bdi data-t={"best crm india"}></bdi></span><span><bdi data-t={"crm pricing"}></bdi></span><span className="intent"><bdi data-t={"Intent · commercial"}></bdi></span></div>
                  <div className="cf-layer cf-outline">
                    <i className="cf-h1"></i>
                    <div className="cf-sec"><span className="cf-h2"><bdi data-t={"What a small team needs"}></bdi></span><div className="cf-lines"><i></i><i></i><i></i></div></div>
                    <div className="cf-sec"><span className="cf-h2"><bdi data-t={"Comparing the options"}></bdi></span><div className="cf-lines"><i></i><i></i><i></i></div></div>
                    <div className="cf-sec"><span className="cf-h2"><bdi data-t={"FAQs"}></bdi><span className="cf-caret"></span></span><div className="cf-lines"><i></i><i></i><i></i></div></div>
                  </div>
                  <div className="cf-layer cf-edit"><span className="cf-del"><bdi data-t={"very unique"}></bdi></span><span className="cf-ins"><bdi data-t={"distinctive"}></bdi></span><span className="cf-check"><bdi data-t={"Fact-checked"}></bdi></span><span className="cf-check"><bdi data-t={"Sources cited"}></bdi></span><span className="cf-check"><bdi data-t={"On-page SEO"}></bdi></span></div>
                  <div className="cf-layer cf-chart"><svg viewBox="0 0 300 44" preserveAspectRatio="none"><path d="M0 40 C 50 38, 80 34, 120 30 S 190 18, 230 12 S 280 4, 300 2"></path></svg><em><bdi data-t={"Clicks ↑"}></bdi></em></div>
                  <span className="cf-stamp"><bdi data-t={"Published"}></bdi></span>
                </div>
              </div>
              <div className="cf-scrub">
                <div className="cf-track">
                  <input className="cf-range" id="cfRange" type="range" min="1" max="6" step="1" defaultValue="1" aria-label="Content writing process step" aria-valuetext="Step 1 of 6: Discovery" />
                  <div className="cf-ticks" aria-hidden="true"><button type="button" className="cf-tick is-on" tabIndex={-1} data-step="1"><b><bdi data-t={"01"}></bdi></b><span><bdi data-t={"Discover"}></bdi></span></button><button type="button" className="cf-tick" tabIndex={-1} data-step="2"><b><bdi data-t={"02"}></bdi></b><span><bdi data-t={"Research"}></bdi></span></button><button type="button" className="cf-tick" tabIndex={-1} data-step="3"><b><bdi data-t={"03"}></bdi></b><span><bdi data-t={"Brief"}></bdi></span></button><button type="button" className="cf-tick" tabIndex={-1} data-step="4"><b><bdi data-t={"04"}></bdi></b><span><bdi data-t={"Write"}></bdi></span></button><button type="button" className="cf-tick" tabIndex={-1} data-step="5"><b><bdi data-t={"05"}></bdi></b><span><bdi data-t={"Edit"}></bdi></span></button><button type="button" className="cf-tick" tabIndex={-1} data-step="6"><b><bdi data-t={"06"}></bdi></b><span><bdi data-t={"Publish"}></bdi></span></button></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHO ================= */}
        <section className="gx-section" id="audience">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label">{"Who we help"}</span>
              <h2 className="gx-h2">{"Content writing for businesses "}<em>{"across India"}</em></h2>
              <p className="gx-p">{"From early-stage startups building their first content library to established brands that need content at scale."}</p>
            </div>
            <ul className="gx-industries">
              <li><b>{"SaaS & technology"}</b><span>{"Product pages, comparisons, documentation-style guides"}</span></li>
              <li><b>{"Ecommerce & D2C"}</b><span>{"Product descriptions, category pages, buying guides"}</span></li>
              <li><b>{"Fintech & BFSI"}</b><span>{"Accurate, compliant, trust-building content"}</span></li>
              <li><b>{"Healthcare & wellness"}</b><span>{"Carefully researched, reviewed health content"}</span></li>
              <li><b>{"Education & edtech"}</b><span>{"Course pages, career guides, student FAQs"}</span></li>
              <li><b>{"Real estate"}</b><span>{"Project pages, locality guides, buyer content"}</span></li>
              <li><b>{"B2B & professional services"}</b><span>{"Service pages, case studies, whitepapers"}</span></li>
              <li><b>{"Local businesses"}</b><span>{"Location pages that support local search"}</span></li>
            </ul>
          </div>
        </section>

        {/* ================= BENGALURU ================= */}
        <section className="gx-section gx-tint" id="bengaluru">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label">{"Local focus · Bengaluru"}</span>
              <h2 className="gx-h2">{"Content writing services in "}<em>{"Bengaluru"}</em></h2>
              <p className="gx-p">{"Bengaluru (Bangalore) is home to thousands of startups, SaaS companies, fintechs and fast-growing D2C brands, and almost all of them compete for attention online. That makes content one of the most competitive marketing channels in the city."}</p>
              <p className="gx-p">{"We help Bengaluru businesses stand out with content that explains complex products simply, ranks for the searches their buyers use, and supports their sales teams. For local businesses, we also write location and service pages that support "}<a href="/services/google-business-profile">{"local search visibility"}</a>{" across the city’s neighbourhoods."}</p>
            </div>
            <div className="gx-blr">
              <div className="gx-blr-card">
                <span className="gx-label">{"Bengaluru businesses we write for"}</span>
                <ul className="gx-blr-areas" aria-label="Bengaluru industries">
                  <li>{"SaaS"}</li><li>{"Fintech"}</li><li>{"D2C brands"}</li><li>{"AI startups"}</li><li>{"Edtech"}</li><li>{"Healthtech"}</li><li>{"Developer tools"}</li><li>{"Real estate"}</li><li>{"Clinics"}</li><li>{"Restaurants & cafés"}</li><li>{"…and more"}</li>
                </ul>
              </div>
              <ul className="gx-blr-points">
                <li><b>{"Fluent in tech and startup language"}</b><span>{"We can explain technical products to non-technical buyers."}</span></li>
                <li><b>{"Local search support"}</b><span>{"Area and service pages for Koramangala, Whitefield, HSR Layout and beyond."}</span></li>
                <li><b>{"Same time zone, fast reviews"}</b><span>{"Quick feedback loops and deadlines that fit your launch calendar."}</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= WHY EFFIX ================= */}
        <section className="gx-section gx-dark" id="why-effix">
          <div className="gx-wrap">
            <div className="gx-head gx-head-left">
              <span className="gx-label gx-label-dark">{"Why Effix Labs"}</span>
              <h2 className="gx-h2">{"Why choose us as your content writing "}<em>{"agency"}</em></h2>
            </div>
            <div className="gx-why">
              <div><span className="gx-why-n" aria-hidden="true">{"01"}</span><h3 className="gx-h3">{"Written by people"}</h3><p className="gx-p-sm">{"Tools may help with research, but every piece is written, edited and fact-checked by humans. Read "}<a className="rm-ext" href="https://developers.google.com/search/blog/2023/02/google-search-and-ai-content" target="_blank" rel="noopener noreferrer">{"Google on AI content"}</a>{"."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"02"}</span><h3 className="gx-h3">{"SEO built in"}</h3><p className="gx-p-sm">{"Keyword research, intent and on-page SEO are part of the writing, not an afterthought."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"03"}</span><h3 className="gx-h3">{"Real expertise"}</h3><p className="gx-p-sm">{"We capture what your team knows, so content shows genuine experience."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"04"}</span><h3 className="gx-h3">{"Original & yours"}</h3><p className="gx-p-sm">{"Plagiarism-checked, original content. Once paid for, it belongs to you."}</p></div>
              <div><span className="gx-why-n" aria-hidden="true">{"05"}</span><h3 className="gx-h3">{"Connected to growth"}</h3><p className="gx-p-sm">{"Content linked with "}<a href="/services/seo-aeo-services">{"SEO & AEO"}</a>{", "}<a href="/services/reddit-marketing">{"Reddit"}</a>{" and "}<a href="/services/website-design-development">{"your website"}</a>{"."}</p></div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="gx-section" id="faq">
          <div className="gx-wrap gx-faq-grid">
            <div className="gx-faq-intro">
              <span className="gx-label">{"FAQ"}</span>
              <h2 className="gx-h2">{"Questions about content writing "}<em>{"services"}</em></h2>
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
            <span className="gx-label">{"Related services"}</span>
            <div className="gx-related">
              <a href="/services/google-business-profile"><span aria-hidden="true">{"01"}</span>{"Google Business Profile Optimisation"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
              <a href="/services/reddit-marketing"><span aria-hidden="true">{"02"}</span>{"Reddit Marketing"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
              <a href="/services/seo-aeo-services"><span aria-hidden="true">{"03"}</span>{"SEO & AEO Services"}<i aria-hidden="true"><bdi data-t={"→"}></bdi></i></a>
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
                  {" LET’S TALK CONTENT "}
                </div>
                {" "}
                <h2 className="cta-title">
                  {" Let’s Write Something "}
                  <em>
                    {"Worth Reading."}
                  </em>
                  {" "}
                </h2>
                {" "}
                <p className="cta-desc">
                  {" Tell us what you need: blogs, web pages, product copy or something else. We’ll reply within one business day with ideas, timelines and a quote. "}
                </p>
                {" "}
                <div className="gx-cta-facts">
                  {" "}
                  <div>
                    
                    <strong>
                      {"Direct Email:"}
                    </strong>
                    {" "}
                    <a href="mailto:hello@effix.co.in">
                      {"hello@effix.co.in"}
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
              <form className="gbp-form" id="contentEnquiryForm" data-onsubmit="handleContentSubmit(event)">
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
                    <option value="SEO blog content">{"SEO blogs & articles"}</option>
                    <option value="Website copy">{"Website copy & service pages"}</option>
                    <option value="Product descriptions">{"Product & category descriptions"}</option>
                    <option value="Case studies / whitepapers">{"Case studies & whitepapers"}</option>
                    <option value="Content refresh">{"Refresh existing content"}</option>
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
                  <textarea className="form-textarea" id="message" name="message" rows={3} required placeholder="What do you sell, who are your readers, and what content do you need (topics, volume, deadlines)?" defaultValue="" />
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
      <LegacyScripts id="content-writing" srcs={SCRIPTS} />
    </>
  );
}
