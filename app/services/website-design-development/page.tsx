// Website Design & Development — service page (shares the GBP/Reddit design system).
import type { Metadata } from "next";
import LegacyScripts from "@/components/LegacyScripts";
import "../google-business-profile/page.css";
import "../google-business-profile/gx.css";
import "../reddit-marketing/rm.css";
import "./wd.css";

export const metadata: Metadata = {
  "title": "Website Design & Development Services in India | EFFIX Labs",
  "description": "Website design & development services across India and Bengaluru: custom, mobile-first websites, e-commerce stores and redesigns built for speed and SEO.",
  "alternates": {
    "canonical": "https://effix.co.in/services/website-design-development"
  },
  "openGraph": {
    "title": "Website Design & Development Services in India | EFFIX Labs",
    "description": "Website design & development services across India and Bengaluru: custom, mobile-first websites, e-commerce stores and redesigns built for speed and SEO.",
    "url": "https://effix.co.in/services/website-design-development",
    "type": "website",
    "images": [
      "https://effix.co.in/images/services/service-05-web-dev.jpg"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Website Design & Development Services in India | EFFIX Labs",
    "description": "Website design & development services across India and Bengaluru: custom, mobile-first websites, e-commerce stores and redesigns built for speed and SEO.",
    "images": [
      "https://effix.co.in/images/services/service-05-web-dev.jpg"
    ]
  }
};

const SCRIPTS = [
  "/js/legacy-shim.js",
  "/js/google-business-profile/01.js",
  "/scripts/lenis.min.js",
  "/js/google-business-profile/02.js",
  "/js/google-business-profile/03.js",
  "/js/website-design-development/page.js"
];

const JSON_LD = "{\"@context\": \"https://schema.org\", \"@graph\": [{\"@type\": \"Service\", \"@id\": \"https://effix.co.in/services/website-design-development#service\", \"name\": \"Website Design & Development Services\", \"alternateName\": [\"Website design and development\", \"Web design and development services\", \"Website design company in Bangalore\"], \"serviceType\": \"Website design and web development\", \"provider\": {\"@type\": \"Organization\", \"name\": \"EFFIX Labs\", \"url\": \"https://effix.co.in/\", \"email\": \"effix.labs@gmail.com\"}, \"areaServed\": [{\"@type\": \"Country\", \"name\": \"India\"}, {\"@type\": \"City\", \"name\": \"Bengaluru\", \"alternateName\": \"Bangalore\", \"containedInPlace\": {\"@type\": \"State\", \"name\": \"Karnataka\"}}, {\"@type\": \"Place\", \"name\": \"Worldwide\"}], \"description\": \"Website design and development services for businesses across India and Bengaluru (Bangalore): custom website design, responsive website development, e-commerce development, landing pages, website redesign, and maintenance and support on WordPress, Shopify, WooCommerce, Webflow and Next.js.\", \"url\": \"https://effix.co.in/services/website-design-development\"}, {\"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"What do website design and development services include?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Website design and development services cover planning, UI/UX design, coding, CMS setup, mobile optimisation, on-page SEO, testing and launch. At EFFIX Labs this also includes forms and integrations, training for your team and optional maintenance after launch.\"}}, {\"@type\": \"Question\", \"name\": \"How much does website design and development cost in India?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Cost depends on the number of pages, custom features, e-commerce needs, content and integrations. A landing page costs far less than a custom store or web app. We share a fixed quote after understanding your scope, so there are no surprises.\"}}, {\"@type\": \"Question\", \"name\": \"How long does it take to build a website?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"A landing page usually takes one to two weeks, a business website three to six weeks, and an e-commerce store six to ten weeks. Ready content and quick feedback keep projects on schedule.\"}}, {\"@type\": \"Question\", \"name\": \"Do you offer website design and development in Bangalore?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes. EFFIX Labs works with businesses in Bengaluru (Bangalore) and across India. We can meet in person in Bengaluru when needed and work remotely everywhere else.\"}}, {\"@type\": \"Question\", \"name\": \"Will my website be mobile-friendly and SEO-friendly?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes. Every site is designed mobile-first and built with clean headings, metadata, structured data, fast loading and correct indexing settings, so it is ready to rank from launch.\"}}, {\"@type\": \"Question\", \"name\": \"Can you redesign my existing website without losing rankings?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes. We map every old URL to its new page with 301 redirects, keep the content that already ranks and check Search Console after launch.\"}}, {\"@type\": \"Question\", \"name\": \"Which platform should I choose: WordPress, Shopify or custom?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"WordPress suits content-rich business sites, Shopify suits online stores, and a custom Next.js build suits sites that need top speed or unique features. We recommend one after understanding your goals.\"}}, {\"@type\": \"Question\", \"name\": \"Do I own my website after it is built?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes. Once the project is paid for, the domain, design, code, content and admin access belong to you.\"}}]}, {\"@type\": \"BreadcrumbList\", \"itemListElement\": [{\"@type\": \"ListItem\", \"position\": 1, \"name\": \"Home\", \"item\": \"https://effix.co.in/\"}, {\"@type\": \"ListItem\", \"position\": 2, \"name\": \"Services\", \"item\": \"https://effix.co.in/#services\"}, {\"@type\": \"ListItem\", \"position\": 3, \"name\": \"Website Design & Development\", \"item\": \"https://effix.co.in/services/website-design-development\"}]}]}";

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
      <main className="gx-page rm-page wd-page">
        {/* ================= HERO ================= */}
        <section className="gx-hero wd-hero" id="hero">
          <div className="gx-wrap gx-hero-inner">
            <span className="gx-kicker"><span className="gx-kicker-dot wd-dot" aria-hidden="true"></span>{"Service 05 · India & Bengaluru"}</span>
            <h1 className="gx-hero-title">
              {"Website Design "}<em>{"& Development"}</em>
            </h1>
            <p className="gx-hero-sub">{"Fast, mobile-first websites that look sharp, rank well and turn visitors into enquiries."}</p>
            <p className="gx-hero-lede">
              {"EFFIX Labs offers website design and development services for businesses across India and in Bengaluru. We plan, design, build and launch custom websites, from business sites and landing pages to online stores, with SEO, speed and conversions built in from day one."}
            </p>
            <div className="gx-hero-ctas">
              <a href="#services" className="gx-btn gx-btn-ghost">{"See what we build"}</a>
            </div>
            <p className="gx-hero-trust">{"Custom design · Mobile-first · SEO-ready · Fast loading"}</p>
          </div>

          {/* Hero banner — midnight blueprint scene: copy on top, exploded 3D layers below */}
          <div className="gx-wrap-wide">
            <div className="wd-banner" id="wdBanner">
              <div className="wd-b-copy">
                <span className="wd-b-kicker">{"Design + Development"}</span>
                <p className="wd-b-title"><span className="wd-b-light">{"Designed to impress."}</span><br /><strong>{"BUILT TO PERFORM."}</strong></p>
                <p className="wd-b-sub"><b>{"From wireframe to live site."}</b>{" Every layer planned, designed and coded for speed, search and sales."}</p>
              </div>
              <div className="wd-scene" aria-hidden="true">
                <div className="wd-code">
                  <span className="wd-code-bar"><i></i><i></i><i></i></span>
                  <code><b className="k">{"<Hero"}</b>{" "}<b className="a">{"title"}</b>{"="}<b className="s">{"\"Grow online\""}</b><b className="k">{" />"}</b></code>
                  <code><b className="k">{"<Services"}</b>{" "}<b className="a">{"items"}</b>{"={"}<b className="s">{"6"}</b>{"}"}<b className="k">{" />"}</b></code>
                  <code><b className="k">{"<EnquiryForm"}</b><b className="k">{" />"}</b></code>
                </div>
                <div className="wd-stack">
                  <div className="wd-layer l1"><span className="wd-tag">{"Wireframe"}</span><i className="w1"></i><i className="w2"></i><i className="w3"></i><i className="w4"></i></div>
                  <div className="wd-layer l2"><span className="wd-tag">{"Design"}</span><i className="d1"></i><i className="d2"></i><i className="d3"></i><i className="d4"></i></div>
                  <div className="wd-layer l3"><span className="wd-tag">{"Live site"}</span><span className="wd-l3-bar"><i></i><i></i><i></i></span><i className="s1"></i><i className="s2"></i><i className="s3"></i><i className="s4"></i><i className="s5"></i></div>
                </div>
                <div className="wd-phone"><span className="wd-ph-notch"></span><i className="p1"></i><i className="p2"></i><i className="p3"></i><i className="p4"></i></div>
                <div className="wd-vitals"><b>{"Core Web Vitals"}</b><span><i></i><i></i><i></i>{"Good"}</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHAT IT IS — website anatomy ================= */}
        <section className="gx-section" id="what">
          <div className="gx-wrap wd-anatomy">
            <div className="wd-anat-copy">
              <span className="gx-label wd-label">{"What it includes"}</span>
              <h2 className="gx-h2">{"What is website design "}<em>{"& development?"}</em></h2>
              <p className="gx-p">{"Website design decides how your site looks and feels: layout, colours, typography and the path a visitor takes. Website development turns that design into a working site: clean code, a CMS you can edit, integrations and hosting. Done together, by one team, nothing gets lost between the two."}</p>
              <ol className="wd-anat-list">
                <li><span>{"1"}</span><div><b>{"A clear first screen"}</b>{" that says what you do and who it’s for."}</div></li>
                <li><span>{"2"}</span><div><b>{"Simple navigation"}</b>{" so visitors find services, prices and proof fast."}</div></li>
                <li><span>{"3"}</span><div><b>{"Mobile-first layouts"}</b>{", because Google uses the "}<a className="rm-ext" href="https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing" target="_blank" rel="noopener noreferrer">{"mobile version"}</a>{" of your site for indexing."}</div></li>
                <li><span>{"4"}</span><div><b>{"Fast, SEO-ready code"}</b>{" with proper headings, metadata and structured data."}</div></li>
                <li><span>{"5"}</span><div><b>{"An easy way to enquire"}</b>{": forms, WhatsApp and calls placed where people decide."}</div></li>
              </ol>
            </div>
            <div className="wd-browser" aria-hidden="true">
              <div className="wd-br-bar"><i></i><i></i><i></i><span>{"yourbusiness.in"}</span></div>
              <div className="wd-br-body">
                <div className="wd-br-nav"><b></b><i></i><i></i><i></i><em></em></div>
                <div className="wd-br-hero"><b></b><i></i><i></i><em></em></div>
                <div className="wd-br-cards"><i></i><i></i><i></i></div>
                <span className="wd-pin n1">{"1"}</span><span className="wd-pin n2">{"2"}</span><span className="wd-pin n3">{"3"}</span><span className="wd-pin n4">{"4"}</span><span className="wd-pin n5">{"5"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SERVICES — editorial index ================= */}
        <section className="gx-section gx-tint" id="services">
          <div className="gx-wrap">
            <div className="gx-head gx-head-left">
              <span className="gx-label wd-label">{"Our services"}</span>
              <h2 className="gx-h2">{"Website design and development "}<em>{"services we offer"}</em></h2>
            </div>
            <ul className="wd-index">
              <li><span className="wd-ix-n">{"01"}</span><h3>{"Custom website design"}</h3><p>{"Original UI/UX design built around your brand and customers, never a recycled template. Wireframes first, then pixel-perfect designs you approve."}</p></li>
              <li><span className="wd-ix-n">{"02"}</span><h3>{"Website development"}</h3><p>{"Responsive, accessible code on WordPress, Webflow, Shopify or Next.js, with a CMS your team can update without a developer."}</p></li>
              <li><span className="wd-ix-n">{"03"}</span><h3>{"E-commerce website development"}</h3><p>{"Online stores with product pages, payment gateways like Razorpay, shipping, GST-ready invoices and inventory."}</p></li>
              <li><span className="wd-ix-n">{"04"}</span><h3>{"Landing page design"}</h3><p>{"Focused pages for ads and campaigns, designed to turn clicks into leads."}</p></li>
              <li><span className="wd-ix-n">{"05"}</span><h3>{"Website redesign"}</h3><p>{"A modern rebuild of an outdated site, with redirects that protect your rankings. See Google’s "}<a className="rm-ext" href="https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes" target="_blank" rel="noopener noreferrer">{"site move guidance"}</a>{"."}</p></li>
              <li><span className="wd-ix-n">{"06"}</span><h3>{"Maintenance & support"}</h3><p>{"Updates, backups, security monitoring, speed fixes and content changes after launch."}</p></li>
            </ul>
          </div>
        </section>

        {/* ================= TABLE — website types ================= */}
        <section className="gx-section" id="types">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label wd-label">{"Choose the right build"}</span>
              <h2 className="gx-h2">{"Which website does "}<em>{"your business need?"}</em></h2>
            </div>
            <div className="wd-table-wrap">
              <table className="wd-table">
                <thead><tr><th>{"Website type"}</th><th>{"Best for"}</th><th>{"Typical size"}</th><th>{"Typical timeline"}</th></tr></thead>
                <tbody>
                  <tr><td><b>{"Landing page"}</b></td><td>{"Ad campaigns, launches, single offers"}</td><td>{"1 page"}</td><td>{"1–2 weeks"}</td></tr>
                  <tr><td><b>{"Business website"}</b></td><td>{"Service businesses, clinics, consultants"}</td><td>{"5–15 pages"}</td><td>{"3–6 weeks"}</td></tr>
                  <tr><td><b>{"Corporate website"}</b></td><td>{"Larger companies, multiple teams or locations"}</td><td>{"15–50+ pages"}</td><td>{"6–10 weeks"}</td></tr>
                  <tr><td><b>{"E-commerce store"}</b></td><td>{"D2C brands and retailers selling online"}</td><td>{"Catalogue + checkout"}</td><td>{"6–10 weeks"}</td></tr>
                  <tr><td><b>{"Web app or portal"}</b></td><td>{"Bookings, dashboards, customer logins"}</td><td>{"Custom features"}</td><td>{"10+ weeks"}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="wd-table-note">{"Timelines are typical for EFFIX Labs projects and depend on scope, content readiness and feedback rounds."}</p>
          </div>
        </section>

        {/* ================= STANDARDS — Core Web Vitals ================= */}
        <section className="gx-section wd-dark" id="standards">
          <div className="gx-wrap">
            <div className="gx-head">
              <span className="gx-label wd-label-dark">{"Built to standard"}</span>
              <h2 className="gx-h2">{"Fast, accessible and "}<em>{"ready for Google"}</em></h2>
              <p className="gx-lead wd-lead-dark">{"Every site we build targets the “good” thresholds in Google’s "}<a className="rm-ext" href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener noreferrer">{"Core Web Vitals"}</a>{", part of its "}<a className="rm-ext" href="https://developers.google.com/search/docs/appearance/page-experience" target="_blank" rel="noopener noreferrer">{"page experience"}</a>{" guidance."}</p>
            </div>
            <div className="wd-vitals-grid">
              <div className="wd-vt"><span className="wd-gauge g1"></span><b>{"LCP ≤ 2.5 s"}</b><small>{"Largest Contentful Paint: main content loads quickly."}</small></div>
              <div className="wd-vt"><span className="wd-gauge g2"></span><b>{"INP ≤ 200 ms"}</b><small>{"Interaction to Next Paint: taps and clicks respond fast."}</small></div>
              <div className="wd-vt"><span className="wd-gauge g3"></span><b>{"CLS ≤ 0.1"}</b><small>{"Cumulative Layout Shift: nothing jumps while loading."}</small></div>
            </div>
            <ul className="wd-std">
              <li><b>{"Mobile-first"}</b><span>{"Designed for phones, then scaled up."}</span></li>
              <li><b>{"Accessible"}</b><span>{"Built with "}<a className="rm-ext" href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer">{"WCAG"}</a>{" guidelines in mind."}</span></li>
              <li><b>{"Secure"}</b><span>{"HTTPS, updates and backups as standard."}</span></li>
              <li><b>{"Measurable"}</b><span>{"Tested in "}<a className="rm-ext" href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">{"PageSpeed Insights"}</a>{" before launch."}</span></li>
            </ul>
          </div>
        </section>

        {/* ================= PROCESS — interactive build studio ================= */}
        <section className="gx-section" id="process">
          <div className="gx-wrap">
            <div className="wd-flow-head">
              <div>
                <span className="gx-label wd-label">{"Our process"}</span>
                <h2 className="gx-h2">{"How we design and "}<em>{"develop your website"}</em></h2>
              </div>
              <p className="gx-p">{"Six clear stages, one team. You see progress at every step and approve before we move on."}</p>
            </div>
            <div className="wd-flow" id="wdFlow">
              <ol className="wd-flow-list">
                <li className="is-on" tabIndex={0}><span className="wd-fl-n">{"01"}</span><div><h3>{"Discover"}</h3><p>{"Goals, audience, competitors and the pages you need."}</p></div><span className="wd-fl-bar" aria-hidden="true"></span></li>
                <li tabIndex={0}><span className="wd-fl-n">{"02"}</span><div><h3>{"Plan & wireframe"}</h3><p>{"Sitemap, page structure and SEO keywords for each page."}</p></div><span className="wd-fl-bar" aria-hidden="true"></span></li>
                <li tabIndex={0}><span className="wd-fl-n">{"03"}</span><div><h3>{"Design"}</h3><p>{"Visual designs for desktop and mobile, refined with you."}</p></div><span className="wd-fl-bar" aria-hidden="true"></span></li>
                <li tabIndex={0}><span className="wd-fl-n">{"04"}</span><div><h3>{"Develop"}</h3><p>{"Clean code, CMS setup, forms and integrations."}</p></div><span className="wd-fl-bar" aria-hidden="true"></span></li>
                <li tabIndex={0}><span className="wd-fl-n">{"05"}</span><div><h3>{"Test & launch"}</h3><p>{"Speed, devices, browsers, SEO and security checked before go-live."}</p></div><span className="wd-fl-bar" aria-hidden="true"></span></li>
                <li tabIndex={0}><span className="wd-fl-n">{"06"}</span><div><h3>{"Support & grow"}</h3><p>{"Training, maintenance and improvements based on real data."}</p></div><span className="wd-fl-bar" aria-hidden="true"></span></li>
              </ol>
              <div className="wd-stage" aria-hidden="true">
                <div className="wd-stage-bar"><i></i><i></i><i></i><span className="wd-stage-url">{"effixlabs / your-website"}</span><span className="wd-stage-step" id="wdStageStep">{"01 / 06"}</span></div>
                <div className="wd-stage-body">
                  <div className="wd-sc sc1 is-on">
                    <div className="wd-note n-a"><b>{"Goals"}</b><i></i><i></i></div>
                    <div className="wd-note n-b"><b>{"Audience"}</b><i></i><i></i></div>
                    <div className="wd-note n-c"><b>{"Competitors"}</b><i></i><i></i></div>
                    <div className="wd-target"><span></span><span></span><span></span></div>
                  </div>
                  <div className="wd-sc sc2">
                    <div className="wd-map">
                      <span className="wd-node root">{"Home"}</span>
                      <div className="wd-map-row"><span className="wd-node">{"About"}</span><span className="wd-node">{"Services"}</span><span className="wd-node">{"Blog"}</span><span className="wd-node">{"Contact"}</span></div>
                    </div>
                  </div>
                  <div className="wd-sc sc3">
                    <div className="wd-swatches"><i></i><i></i><i></i><i></i><i></i></div>
                    <div className="wd-type"><b>{"Aa"}</b><span><i></i><i></i><i></i></span></div>
                    <div className="wd-dcard"><i></i><b></b><em></em></div>
                  </div>
                  <div className="wd-sc sc4">
                    <div className="wd-editor">
                      <code><b className="k">{"export default"}</b>{" function Home() {"}</code>
                      <code className="in1"><b className="k">{"return"}</b>{" ("}</code>
                      <code className="in2"><b className="t">{"<Hero />"}</b></code>
                      <code className="in2"><b className="t">{"<Services />"}</b></code>
                      <code className="in2"><b className="t">{"<EnquiryForm />"}</b></code>
                      <code className="in1">{");"}</code>
                      <code>{"}"}</code>
                    </div>
                    <span className="wd-build">{"✓ Build passed"}</span>
                  </div>
                  <div className="wd-sc sc5">
                    <ul className="wd-checks"><li>{"Page speed"}</li><li>{"Mobile & tablet"}</li><li>{"All browsers"}</li><li>{"SEO & metadata"}</li><li>{"Security & HTTPS"}</li></ul>
                    <span className="wd-live"><i></i>{"Live"}</span>
                  </div>
                  <div className="wd-sc sc6">
                    <div className="wd-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                    <span className="wd-toast t1">{"✓ Content updated"}</span>
                    <span className="wd-toast t2">{"✓ Backup complete"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PLATFORMS — illustrated bento ================= */}
        <section className="gx-section gx-tint" id="platforms">
          <div className="gx-wrap">
            <div className="wd-flow-head">
              <div>
                <span className="gx-label wd-label">{"Platforms"}</span>
                <h2 className="gx-h2">{"The right platform "}<em>{"for your goals"}</em></h2>
              </div>
              <p className="gx-p">{"We recommend technology based on what you need to do, not what we prefer to sell."}</p>
            </div>
            <div className="wd-bento">
              <article className="wd-pf pf-wp">
                <div className="wd-pf-art" aria-hidden="true">
                  <div className="wp-ed"><div className="wp-side"><i></i><i></i><i></i><i></i></div><div className="wp-page"><i className="h"></i><i></i><i></i><i className="img"></i><span className="wp-add">{"+"}</span></div></div>
                </div>
                <div className="wd-pf-txt"><span className="wd-pf-tag">{"Best for business sites"}</span><h3>{"WordPress"}</h3><p>{"Content-rich business sites your team can edit easily."}</p></div>
              </article>
              <article className="wd-pf pf-shop">
                <div className="wd-pf-art" aria-hidden="true">
                  <div className="sh-card"><i className="img"></i><i className="t"></i><i className="p"></i><span className="sh-btn">{"Add to cart"}</span></div>
                  <span className="sh-cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.4"></circle><circle cx="18" cy="20" r="1.4"></circle><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"></path></svg><b>{"1"}</b></span>
                </div>
                <div className="wd-pf-txt"><span className="wd-pf-tag">{"Best for online stores"}</span><h3>{"Shopify & WooCommerce"}</h3><p>{"Online stores with payments, shipping and inventory."}</p></div>
              </article>
              <article className="wd-pf pf-wf">
                <div className="wd-pf-art" aria-hidden="true">
                  <div className="wf-canvas"><i className="a"></i><div className="wf-sel"><i></i><i></i><i></i><i></i><span>{"Hero · Section"}</span></div><i className="b"></i></div>
                  <svg className="wf-cursor" viewBox="0 0 24 24"><path d="M4 3l7 18 2.5-7.5L21 11z" fill="#0a1022" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"></path></svg>
                </div>
                <div className="wd-pf-txt"><span className="wd-pf-tag">{"Best for marketing sites"}</span><h3>{"Webflow"}</h3><p>{"Design-led marketing sites with visual editing."}</p></div>
              </article>
              <article className="wd-pf pf-next">
                <div className="wd-pf-art" aria-hidden="true">
                  <div className="nx-term"><code><b>{"$"}</b>{" npm run build"}</code><code className="ok">{"✓ Compiled successfully"}</code><code className="ok">{"✓ Pages pre-rendered"}</code><code><b>{"▲"}</b>{" Ready"}<span className="nx-caret"></span></code></div>
                </div>
                <div className="wd-pf-txt"><span className="wd-pf-tag">{"Best for speed & web apps"}</span><h3>{"Next.js & React"}</h3><p>{"Very fast custom sites and web apps, built "}<a className="rm-ext" href="https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics" target="_blank" rel="noopener noreferrer">{"search-friendly"}</a>{"."}</p></div>
              </article>
            </div>
          </div>
        </section>

{/* ================= BENGALURU ================= */}
        <section className="gx-section" id="bengaluru">
          <div className="gx-wrap gx-split">
            <div>
              <span className="gx-label wd-label">{"Local focus · Bengaluru"}</span>
              <h2 className="gx-h2">{"Website design company "}<em>{"in Bengaluru"}</em></h2>
              <p className="gx-p">{"Bengaluru (Bangalore) businesses compete with some of India’s best-funded startups for attention online. Your website has to load fast on mobile data, explain your offer in seconds and make it easy to get in touch."}</p>
              <p className="gx-p">{"We work with Bengaluru startups, clinics, real estate firms, restaurants and B2B companies, and can meet in person when it helps. For local visibility we pair your site with "}<a href="/services/google-business-profile">{"Google Business Profile optimisation"}</a>{" and "}<a href="/services/seo-aeo-services">{"SEO & AEO"}</a>{"."}</p>
            </div>
            <div className="gx-blr">
              <div className="gx-blr-card">
                <span className="gx-label wd-label">{"Who we build for"}</span>
                <ul className="gx-blr-areas" aria-label="Industries">
                  <li>{"Startups & SaaS"}</li><li>{"Clinics"}</li><li>{"Real estate"}</li><li>{"D2C brands"}</li><li>{"Restaurants"}</li><li>{"Education"}</li><li>{"B2B services"}</li><li>{"…and more"}</li>
                </ul>
              </div>
              <ul className="gx-blr-points">
                <li><b>{"Content help included"}</b><span>{"Page copy from our "}<a href="/services/content-writing">{"content writing"}</a>{" team if you need it."}</span></li>
                <li><b>{"You own everything"}</b><span>{"Domain, code, content and logins stay in your name."}</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="gx-section gx-tint" id="faq">
          <div className="gx-wrap gx-faq-grid">
            <div className="gx-faq-intro">
              <span className="gx-label wd-label">{"FAQ"}</span>
              <h2 className="gx-h2">{"Website design & development "}<em>{"questions"}</em></h2>
              <p className="gx-p">{"Can’t find your answer? Use the form below and we’ll reply within one business day."}</p>
            </div>
            <div className="faq-accordion-wrap gx-faq">
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"What do website design and development services include?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"Website design and development services cover planning, UI/UX design, coding, CMS setup, mobile optimisation, on-page SEO, testing and launch. At EFFIX Labs this also includes forms and integrations, training for your team and optional maintenance after launch."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"How much does website design and development cost in India?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"Cost depends on the number of pages, custom features, e-commerce needs, content and integrations. A landing page costs far less than a custom store or web app. We share a fixed quote after understanding your scope, so there are no surprises."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"How long does it take to build a website?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"A landing page usually takes one to two weeks, a business website three to six weeks, and an e-commerce store six to ten weeks. Ready content and quick feedback keep projects on schedule."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"Do you offer website design and development in Bangalore?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"Yes. EFFIX Labs works with businesses in Bengaluru (Bangalore) and across India. We can meet in person in Bengaluru when needed and work remotely everywhere else."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"Will my website be mobile-friendly and SEO-friendly?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"Yes. Every site is designed mobile-first and built with clean headings, metadata, structured data, fast loading and correct indexing settings, so it is ready to rank from launch."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"Can you redesign my existing website without losing rankings?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"Yes. We map every old URL to its new page with 301 redirects, keep the content that already ranks and check Search Console after launch."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"Which platform should I choose: WordPress, Shopify or custom?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"WordPress suits content-rich business sites, Shopify suits online stores, and a custom Next.js build suits sites that need top speed or unique features. We recommend one after understanding your goals."}</p>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-question-btn" data-onclick="toggleFaq(this)">
                  <span>{"Do I own my website after it is built?"}</span>
                  <span className="faq-icon-cross">{"+"}</span>
                </button>
                <div className="faq-answer-panel">
                  <p>{"Yes. Once the project is paid for, the domain, design, code, content and admin access belong to you."}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RELATED ================= */}
        <section className="gx-section gx-related-sec" id="related">
          <div className="gx-wrap">
            <span className="gx-label wd-label">{"Related services"}</span>
            <div className="gx-related">
              <a href="/services/google-business-profile"><span>{"01"}</span>{"Google Business Profile Optimisation"}<i aria-hidden="true">{"→"}</i></a>
              <a href="/services/reddit-marketing"><span>{"02"}</span>{"Reddit Marketing"}<i aria-hidden="true">{"→"}</i></a>
              <a href="/services/seo-aeo-services"><span>{"03"}</span>{"SEO & AEO Services"}<i aria-hidden="true">{"→"}</i></a>
              <a href="/services/content-writing"><span>{"04"}</span>{"Content Writing"}<i aria-hidden="true">{"→"}</i></a>
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
                  {" LET’S BUILD YOUR WEBSITE "}
                </div>
                {" "}
                <h2 className="cta-title">
                  {" A Website That "}
                  <em>
                    {"Works as Hard as You Do."}
                  </em>
                  {" "}
                </h2>
                {" "}
                <p className="cta-desc">
                  {" Tell us about your business and the website you have in mind. We’ll reply within one business day with ideas, a timeline and a quote. "}
                </p>
                {" "}
                <div className="gx-cta-facts">
                  {" "}
                  <div>
                    
                    <strong>
                      {"Direct Email:"}
                    </strong>
                    {" "}
                    <a href="mailto:effix.labs@gmail.com">
                      {"effix.labs@gmail.com"}
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
              <form className="gbp-form" id="webEnquiryForm" data-onsubmit="handleWebSubmit(event)">
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
                    <option value="New business website">{"New business website"}</option>
                    <option value="E-commerce store">{"E-commerce store"}</option>
                    <option value="Website redesign">{"Website redesign"}</option>
                    <option value="Landing page">{"Landing page"}</option>
                    <option value="Web app / portal">{"Web app or portal"}</option>
                    <option value="Maintenance">{"Maintenance & support"}</option>
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
                  <textarea className="form-textarea" id="message" name="message" rows={3} required placeholder="What your business does, the pages or features you need, any sites you like, and your ideal launch date." defaultValue="" />
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
      <LegacyScripts id="website-design-development" srcs={SCRIPTS} />
    </>
  );
}
