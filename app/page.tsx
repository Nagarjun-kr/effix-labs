// Generated from the original static page (index.html). Markup is rendered on the server;
// the page's original scripts are loaded in order by <LegacyScripts>.
import type { Metadata } from "next";
import LegacyScripts from "@/components/LegacyScripts";
import { faqPageLd, type FaqItem } from "@/components/ServiceFaq";
import { ldString } from "@/lib/site";
import "./page.css";
import "./home-dq.css";

export const metadata: Metadata = {
  "title": "Effix Labs | Get Found Where Your Customers Search",
  "description": "Effix Labs helps businesses improve visibility across Google search, online communities and AI search. Start with a free Google organic visibility audit.",
  "alternates": {
    "canonical": "https://effix.co.in/"
  },
  "openGraph": {
    "title": "Effix Labs | Get Found Where Your Customers Search",
    "description": "Effix Labs helps businesses improve visibility across Google search, online communities and AI search. Start with a free Google organic visibility audit.",
    "url": "https://effix.co.in/",
    "type": "website",
    "siteName": "Effix Labs",
    "images": [{ "url": "https://effix.co.in/images/og-home.jpg", "width": 1200, "height": 630, "alt": "Effix Labs: Get found where your customers search" }]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Effix Labs | Get Found Where Your Customers Search",
    "description": "Effix Labs helps businesses improve visibility across Google search, online communities and AI search.",
    "images": ["https://effix.co.in/images/og-home.jpg"]
  }
};


const HOME_FAQS: FaqItem[] = [
  {
    "q": "What does the free audit check?",
    "a": [
      "It reads your website, finds your brand name and the social profiles you link to, then shows live Google results for your brand on YouTube, Instagram, Facebook, LinkedIn, X, Reddit, Quora and Threads. ",
      {
        "text": "Run the free audit",
        "href": "/#audit"
      },
      "."
    ]
  },
  {
    "q": "Do I need to log in or pay?",
    "a": [
      "No. The audit is free and needs no login."
    ]
  },
  {
    "q": "Does the audit cover AI answers, Google Maps, Reddit or Quora?",
    "a": [
      "Reddit and Quora, yes: they’re two of the eight platforms we search through Google. AI answers and Google Maps aren’t covered yet."
    ]
  },
  {
    "q": "Is every result an official account?",
    "a": [
      "No. Google shows pages that mention your brand. Some will be your own profiles and some will be posts by other people, so open each result to check it."
    ]
  },
  {
    "q": "What happens to the website I enter?",
    "a": [
      "We read that one public page to find your brand name and the profiles it links to. Nothing is saved, and you don’t need an account."
    ]
  },
  {
    "q": "Do you guarantee rankings or leads?",
    "a": [
      "No. Google and other platforms make their own decisions. We focus on useful work and honest reporting."
    ]
  },
  {
    "q": "Do I need special SEO to appear in AI search?",
    "a": [
      "There’s no trick that guarantees it. Google says its AI features rely on the same SEO fundamentals as regular search, so what helps is strong technical SEO, clear direct answers, structured data and trusted mentions across the web. That’s the work our ",
      {
        "text": "SEO & AEO services",
        "href": "/services/seo-aeo-services"
      },
      " cover. We don’t promise inclusion, because no one controls Google or AI tools."
    ]
  },
  {
    "q": "Do you use fake reviews or fake accounts?",
    "a": [
      "Never. Reviews should come from real customers. Google can restrict profiles that break its rules on fake engagement."
    ]
  },
  {
    "q": "How do you work on Reddit?",
    "a": [
      "Through clearly identified accounts, with client relationships disclosed and each community’s rules followed. We focus on useful, relevant answers and never use undisclosed promotion. See our ",
      {
        "text": "Reddit marketing",
        "href": "/services/reddit-marketing"
      },
      " approach."
    ]
  },
  {
    "q": "Who writes your content?",
    "a": [
      "People do. Experienced writers research, write and edit every piece, and an editor fact-checks it before delivery. We may use tools to help with research, and we cite reliable sources for factual claims. See our ",
      {
        "text": "content writing services",
        "href": "/services/content-writing"
      },
      "."
    ]
  },
  {
    "q": "Do you work with businesses in India and abroad?",
    "a": [
      "Yes. We work with businesses in India and internationally."
    ]
  },
  {
    "q": "How do I contact Effix Labs?",
    "a": [
      "Email ",
      {
        "text": "hello@effix.co.in",
        "href": "mailto:hello@effix.co.in"
      },
      ". We reply within one business day."
    ]
  }
];

const HOME_LD = ldString([faqPageLd(HOME_FAQS)]);

const SCRIPTS = [
  "/js/legacy-shim.js",
  "/js/home/01.js",
  "/js/home/02.js",
  "/js/home/03.js",
  "/scripts/lenis.min.js",
  "/js/home/04.js",
  "/js/home/05.js"
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: HOME_LD }} />

      {" "}
      {" "}
      <header className="navbar">
        {" "}
        <div className="container navbar-inner">
          {" "}
          {" "}
          <a href="/" className="brand-logo" aria-label="Effix Labs Home">
            {" "}
            <svg className="effix-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {" "}
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"></path>
              {" "}
              <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></path>
              {" "}
            </svg>
            {" "}
            <span className="brand-name">
              {"Effix Labs"}
            </span>
            {" "}
          </a>
          {" "}
          {" "}
          <nav aria-label="Main Navigation">
            {" "}
            <ul className="nav-menu">
              {" "}
              {" "}
              <li className="nav-item">
                {" "}
                <a href="/about" className="nav-link">
                  {"About"}
                </a>
                {" "}
              </li>
              {" "}
              {" "}
              <li className="nav-item">
                {" "}
                <a href="/blog" className="nav-link">
                  {"Blog"}
                </a>
                {" "}
              </li>
              {" "}
              {" "}
              <li className="nav-item">
                {" "}
                <a href="#services" className="nav-link" id="navServicesBtn">
                  {"Services"}
                </a>
                {" "}
              </li>
              {" "}
              {" "}
              <li className="nav-item">
                {" "}
                <a href="/work" className="nav-link">
                  {"Work"}
                </a>
                {" "}
              </li>
              {" "}
              {" "}
              <li className="nav-item">
                {" "}
                <a href="/contact" className="nav-link">
                  {"Contact"}
                </a>
                {" "}
              </li>
              {" "}
            </ul>
            {" "}
          </nav>
          {" "}
          {" "}
          <div className="navbar-cta-wrap">
            {" "}
            <a href="#audit" className="nav-cta-btn">
              {"Run a Visibility Audit"}
            </a>
            {" "}
          </div>
          {" "}
          {" "}
          <button className="mobile-menu-btn" id="mobileMenuBtn" data-onclick="toggleMobileDrawer()" aria-label="Toggle Navigation">
            {" "}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {" "}
              <line x1="3" y1="12" x2="21" y2="12"></line>
              {" "}
              <line x1="3" y1="6" x2="21" y2="6"></line>
              {" "}
              <line x1="3" y1="18" x2="21" y2="18"></line>
              {" "}
            </svg>
            {" "}
          </button>
          {" "}
          {" "}
          <div className="mobile-drawer" id="mobileDrawer">
            {" "}
            <ul className="mobile-nav-list">
              {" "}
              <li>
                <a href="/about" className="mobile-nav-link" data-onclick="toggleMobileDrawer()">
                  {"About"}
                </a>
              </li>
              {" "}
              <li>
                <a href="/blog" className="mobile-nav-link" data-onclick="toggleMobileDrawer()">
                  {"Blog"}
                </a>
              </li>
              {" "}
              <li>
                <a href="#services" className="mobile-nav-link" id="mobileNavServicesBtn" data-onclick="toggleMobileDrawer()">
                  {"Services"}
                </a>
              </li>
              {" "}
              <li>
                <a href="/work" className="mobile-nav-link" data-onclick="toggleMobileDrawer()">
                  {"Work"}
                </a>
              </li>
              {" "}
              <li>
                <a href="/contact" className="mobile-nav-link" data-onclick="toggleMobileDrawer()">
                  {"Contact"}
                </a>
              </li>
              {" "}
              <li>
                <a href="#audit" className="nav-cta-btn" style={{ display: "inline-block", marginTop: "10px" }} data-onclick="toggleMobileDrawer()">
                  {"Run a Visibility Audit"}
                </a>
              </li>
              {" "}
            </ul>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </header>
      {" "}
      {" "}
      {" "}
      <main>
        {" "}
        {" "}
        <section className="hero-section" id="hero">
          {" "}
          <div className="container hero-content">
            {" "}
            {" "}
            <div className="hero-tags-row">
              {" "}
              <svg className="pin-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {" "}
                <circle cx="12" cy="6.75" r="4.5" fill="var(--token-blue)"></circle>
                {" "}
                <path d="M12 11.25V21.75" stroke="var(--token-blue)" strokeWidth="1.6" strokeLinecap="round"></path>
                {" "}
              </svg>
              {" "}
              <div className="hero-tags-text">
                {" "}
                <span>
                  {"Google search"}
                </span>
                {" "}
                <span className="bullet">
                  {"·"}
                </span>
                {" "}
                <span>
                  {"Online communities"}
                </span>
                {" "}
                <span className="bullet">
                  {"·"}
                </span>
                {" "}
                <span>
                  {"AI search"}
                </span>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            {" "}
            <h1 className="hero-title">
              {" Get "}
              <span className="accent-italic">
                {"found"}
              </span>
              {" where your customers search. "}
            </h1>
            {" "}
            {" "}
            <p className="hero-supporting-text">
              {" People look for businesses on Google. They read community discussions. They ask AI tools. Effix Labs helps you show up in those places. We start with evidence. "}
            </p>
            {" "}
            {" "}
            <div className="audit-box-label">
              {"Know where your brand is visible."}
            </div>
            {" "}
            {" "}
            <div className="audit-form-container" id="audit">
              {" "}
              <form className="search-pill" data-onsubmit="handleAuditSubmit(event)">
                {" "}
                <svg className="globe-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {" "}
                  <circle cx="12" cy="12" r="10"></circle>
                  {" "}
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  {" "}
                  <path d="M2 12h20"></path>
                  {" "}
                </svg>
                {" "}
                <label htmlFor="urlInput" className="visually-hidden" style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: "0" }}>
                  {"Website URL"}
                </label>
                {" "}
                <input id="urlInput" type="text" placeholder="Enter your website URL (for example, effix.co.in)" autoComplete="url" spellCheck="false" required />
                {" "}
                <button type="submit" className="submit-pill-btn" id="submitBtn">
                  {" "}
                  <span id="btnText">
                    {"Run a Visibility Audit →"}
                  </span>
                  {" "}
                </button>
                {" "}
              </form>
              {" "}
              {" "}
              <div className="search-guarantee-row">
                {" "}
                <span>
                  {"Free. No login. Checks your brand on eight platforms through Google."}
                </span>
                {" "}
              </div>
              {" "}
              <div className="audit-feedback" id="auditFeedback" role="status"></div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        {" "}
        <section className="window-reveal-section" id="why-discovery">
          {" "}
          {" "}
          <div className="window-reveal-backdrop" aria-hidden="true"></div>
          {" "}
          {" "}
          <div className="window-top-white-blend" aria-hidden="true"></div>
          {" "}
          {" "}
          <div className="window-purple-aurora-backdrop" id="windowPurpleAurora" aria-hidden="true"></div>
          {" "}
          {" "}
          <div className="window-stage-container">
            {" "}
            <div className="window-scroll-card" id="windowScrollCard">
              {" "}
              <a href="#audit" className="window-content-anchor" aria-label="Explore Search Discovery on Effix Labs">
                {" "}
                <img src="/images/search-everywhere.webp" alt="Search is not one place anymore. Multiple places, real opportunities across Google, Online Communities and AI Search" className="window-display-image" width={2000} height={1026} loading="eager" decoding="async" />
                {" "}
              </a>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          {" "}
          <div className="window-bottom-transition-fade" aria-hidden="true"></div>
          {" "}
        </section>
        {" "}
        {" "}
        <section className="section-padding" id="our-approach">
          <div className="container">
            <span className="dq-eyebrow">{"Digital Discovery"}</span>
            <h2 className="section-heading-editorial">
              {"Digital Discovery starts with three questions."}
            </h2>
            <p className="section-intro-text">
              {"Digital Discovery is the work of making a business easy to find and easy to trust at the moment someone searches. We begin by asking:"}
            </p>
            <div className="dq" id="dqWrap">
              <ol className="dq-list">
              <li className="dq-item is-on" tabIndex={0}>
                <span className="dq-num" aria-hidden="true">{"01"}</span>
                <div>
                  <h3 className="dq-q">{"Where do you show up today?"}</h3>
                  <div className="dq-a-wrap"><p className="dq-a"><span>{"We look at what people actually see when they search for businesses like yours."}</span></p></div>
                </div>
                <span className="dq-bar" aria-hidden="true"></span>
              </li>
              <li className="dq-item" tabIndex={0}>
                <span className="dq-num" aria-hidden="true">{"02"}</span>
                <div>
                  <h3 className="dq-q">{"What are people asking?"}</h3>
                  <div className="dq-a-wrap"><p className="dq-a"><span>{"We look at the questions your customers use to find, compare and choose."}</span></p></div>
                </div>
                <span className="dq-bar" aria-hidden="true"></span>
              </li>
              <li className="dq-item" tabIndex={0}>
                <span className="dq-num" aria-hidden="true">{"03"}</span>
                <div>
                  <h3 className="dq-q">{"What should change first?"}</h3>
                  <div className="dq-a-wrap"><p className="dq-a"><span>{"We pick the few actions that matter most, instead of doing everything at once."}</span></p></div>
                </div>
                <span className="dq-bar" aria-hidden="true"></span>
              </li>
              </ol>
              <div className="dq-lens" aria-hidden="true">
                <div className="dq-lens-top"><span><b id="dqStep"><bdi data-t={"01"}></bdi></b><bdi data-t={" / 03"}></bdi></span><span><bdi data-t={"Illustrative"}></bdi></span></div>
                <div className="dq-scene s1 is-on">
                  <div className="dq-card dq-row"><span className="dq-ch g"><bdi data-t={"G"}></bdi></span><span className="dq-row-t"><bdi data-t={"Google search"}></bdi><small><bdi data-t={"Your website and profile"}></bdi></small></span><span className="dq-status ok"><bdi data-t={"Visible"}></bdi></span></div>
                  <div className="dq-card dq-row"><span className="dq-ch r"><bdi data-t={"r/"}></bdi></span><span className="dq-row-t"><bdi data-t={"Online communities"}></bdi><small><bdi data-t={"Reddit threads about your category"}></bdi></small></span><span className="dq-status mid"><bdi data-t={"Rarely"}></bdi></span></div>
                  <div className="dq-card dq-row"><span className="dq-ch a"><bdi data-t={"✦"}></bdi></span><span className="dq-row-t"><bdi data-t={"AI answers"}></bdi><small><bdi data-t={"ChatGPT, Gemini, AI Overviews"}></bdi></small></span><span className="dq-status no"><bdi data-t={"Missing"}></bdi></span></div>
                </div>
                <div className="dq-scene s2">
                  <div className="dq-bubble"><b><bdi data-t={"Who’s the best option near me?"}></bdi></b><em><bdi data-t={"Google"}></bdi></em></div>
                  <div className="dq-bubble"><b><bdi data-t={"Is it worth the price?"}></bdi></b><em><bdi data-t={"Reddit"}></bdi></em></div>
                  <div className="dq-bubble"><b><bdi data-t={"This one or that one, which is better?"}></bdi></b><em><bdi data-t={"ChatGPT"}></bdi></em></div>
                  <div className="dq-bubble"><b><bdi data-t={"Can I trust them?"}></bdi></b><em><bdi data-t={"Reviews"}></bdi></em></div>
                </div>
                <div className="dq-scene s3">
                  <div className="dq-card dq-task done"><span className="dq-tick"></span><span className="dq-task-t"><bdi data-t={"Fix the basics on your profile"}></bdi></span><span className="dq-pill hi"><bdi data-t={"High impact"}></bdi></span></div>
                  <div className="dq-card dq-task done"><span className="dq-tick"></span><span className="dq-task-t"><bdi data-t={"Answer your top customer questions"}></bdi></span><span className="dq-pill hi"><bdi data-t={"High impact"}></bdi></span></div>
                  <div className="dq-card dq-task"><span className="dq-tick"></span><span className="dq-task-t"><bdi data-t={"Earn mentions on trusted sites"}></bdi></span><span className="dq-pill next"><bdi data-t={"Next"}></bdi></span></div>
                  <p className="dq-note"><bdi data-t={"Few actions, in the right order"}></bdi></p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {" "}
        {" "}
        <section className="services-scroll-section" id="services">
          {" "}
          <div className="services-sticky-stage" id="servicesStickyStage">
            {" "}
            <div className="container services-stage-inner">
              {" "}
              <div className="services-header-wrap" id="servicesHeaderWrap">
                {" "}
                <div className="services-title-row">
                  {" "}
                  <h2 className="services-display-title">
                    {" "}
                    <span className="title-roman">
                      {"Ser"}
                    </span>
                    <span className="title-italic">
                      {"vices"}
                    </span>
                    <span className="title-count">
                      {"(05)"}
                    </span>
                    {" "}
                  </h2>
                  {" "}
                </div>
                {" "}
                <p className="services-subheading-editorial">
                  {"Five ways we help you get found."}
                </p>
                {" "}
                <div className="services-scroll-indicator" id="servicesScrollIndicator" aria-hidden="true">
                  {" "}
                  <span className="indicator-label">
                    {"Scroll to explore"}
                  </span>
                  {" "}
                  <div className="indicator-line-wrap">
                    {" "}
                    <div className="indicator-line-pulse"></div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              <div className="services-gallery-wrap" id="servicesGalleryWrap">
                {" "}
                <div className="services-cards-grid" id="servicesCardsGrid">
                  {" "}
                  {" "}
                  <a href="/services/google-business-profile" className="service-artwork-card" data-index="0" data-service-id="gbp" aria-label="Google Business Profile Optimisation">
                    {" "}
                    <div className="service-poster-wrapper">
                      {" "}
                      <img src="/images/services/service-01-gbp.jpg" alt="Google Business Profile Optimisation service poster" className="service-poster-img" width={723} height={1024} loading="lazy" decoding="async" />
                      {" "}
                      <div className="service-poster-overlay">
                        {" "}
                        <span className="service-explore-pill">
                          {"Explore Service →"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="visually-hidden" style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: "0" }}>
                      {" "}
                      <h3>
                        {"Google Business Profile Optimisation"}
                      </h3>
                      {" "}
                      <p>
                        {"Help nearby customers find your business on Google and feel sure about choosing you."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </a>
                  {" "}
                  {" "}
                  <a href="/services/reddit-marketing" className="service-artwork-card" data-index="1" data-service-id="reddit-quora" aria-label="Reddit Marketing">
                    {" "}
                    <div className="service-poster-wrapper">
                      {" "}
                      <img src="/images/services/service-02-reddit-marketing.jpg" alt="Reddit Marketing service poster" className="service-poster-img" width={723} height={1024} loading="lazy" decoding="async" />
                      {" "}
                      <div className="service-poster-overlay">
                        {" "}
                        <span className="service-explore-pill">
                          {"Explore Service →"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="visually-hidden" style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: "0" }}>
                      {" "}
                      <h3>
                        {"Reddit Marketing"}
                      </h3>
                      {" "}
                      <p>
                        {"Take part in the conversations where people ask for advice."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </a>
                  {" "}
                  {" "}
                  <a href="/services/seo-aeo-services" className="service-artwork-card" data-index="2" data-service-id="ai-search" aria-label="SEO & AEO Services">
                    {" "}
                    <div className="service-poster-wrapper">
                      {" "}
                      <img src="/images/services/float/service-03-seo-aeo-base.jpg" alt="SEO & AEO Services service poster" className="service-poster-img" width={723} height={1024} loading="lazy" decoding="async" />
                      <div className="poster-float" aria-hidden="true">
                        <img className="poster-float-layer" src="/images/services/float/service-03-seo-aeo-search.png" alt="" data-depth="16" loading="lazy" decoding="async" style={{ left: "51.071%", top: "48.224%", width: "22.912%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-03-seo-aeo-bars.png" alt="" data-depth="26" loading="lazy" decoding="async" style={{ left: "78.48%", top: "40.212%", width: "12.741%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-03-seo-aeo-spark.png" alt="" data-depth="30" loading="lazy" decoding="async" style={{ left: "77.73%", top: "62.132%", width: "10.493%" }} />
                      </div>
                      {" "}
                      <div className="service-poster-overlay">
                        {" "}
                        <span className="service-explore-pill">
                          {"Explore Service →"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="visually-hidden" style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: "0" }}>
                      {" "}
                      <h3>
                        {"SEO & AEO Services"}
                      </h3>
                      {" "}
                      <p>
                        {"Rank higher on Google and get cited when people ask AI tools for answers."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </a>
                  {" "}
                  {" "}
                  <a href="/services/content-writing" className="service-artwork-card" data-index="3" data-service-id="blog-seo" aria-label="Content Writing">
                    {" "}
                    <div className="service-poster-wrapper">
                      {" "}
                      <img src="/images/services/float/service-04-content-writing-base.jpg" alt="Content Writing service poster" className="service-poster-img" width={723} height={1024} loading="lazy" decoding="async" />
                      <div className="poster-float" aria-hidden="true">
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-doc.png" alt="" data-depth="12" loading="lazy" decoding="async" style={{ left: "53.383%", top: "44.124%", width: "31.794%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-chip-ranked.png" alt="" data-depth="20" loading="lazy" decoding="async" style={{ left: "70.677%", top: "35.633%", width: "26.423%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-chip-engaging.png" alt="" data-depth="18" loading="lazy" decoding="async" style={{ left: "43.824%", top: "65.353%", width: "30.075%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-cloud-a.png" alt="" data-depth="28" loading="lazy" decoding="async" style={{ left: "52.846%", top: "39.879%", width: "15.145%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-cloud-b.png" alt="" data-depth="30" loading="lazy" decoding="async" style={{ left: "80.236%", top: "42.608%", width: "13.641%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-cloud-c.png" alt="" data-depth="26" loading="lazy" decoding="async" style={{ left: "44.898%", top: "56.027%", width: "10.311%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-ball-a.png" alt="" data-depth="34" loading="lazy" decoding="async" style={{ left: "47.905%", top: "46.929%", width: "5.048%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-ball-b.png" alt="" data-depth="32" loading="lazy" decoding="async" style={{ left: "77.229%", top: "63.23%", width: "9.345%" }} />
                        <img className="poster-float-layer" src="/images/services/float/service-04-content-writing-cone.png" alt="" data-depth="24" loading="lazy" decoding="async" style={{ left: "83.673%", top: "57.165%", width: "9.882%" }} />
                      </div>
                      {" "}
                      <div className="service-poster-overlay">
                        {" "}
                        <span className="service-explore-pill">
                          {"Explore Service →"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="visually-hidden" style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: "0" }}>
                      {" "}
                      <h3>
                        {"Content Writing"}
                      </h3>
                      {" "}
                      <p>
                        {"Publish helpful articles that answer real customer questions."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </a>
                  {" "}
                  {" "}
                  <a href="/services/website-design-development" className="service-artwork-card" data-index="4" data-service-id="web-dev" aria-label="Website Design & Development">
                    {" "}
                    <div className="service-poster-wrapper">
                      {" "}
                      <img src="/images/services/service-05-web-dev.jpg" alt="Website Design & Development service poster" className="service-poster-img" width={723} height={1024} loading="lazy" decoding="async" />
                      {" "}
                      <div className="service-poster-overlay">
                        {" "}
                        <span className="service-explore-pill">
                          {"Explore Service →"}
                        </span>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="visually-hidden" style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: "0" }}>
                      {" "}
                      <h3>
                        {"Website Design & Development"}
                      </h3>
                      {" "}
                      <p>
                        {"Build a modern, responsive, SEO-ready website that performs."}
                      </p>
                      {" "}
                    </div>
                    {" "}
                  </a>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        {" "}
        <section className="section-padding" id="discover-product">
          {" "}
          <div className="container">
            {" "}
            <div className="discover-box">
              {" "}
              {" "}
              <div className="discover-left">
                {" "}
                <h2 className="discover-headline">
                  {"Get discovered. "}
                  <br />
                  {"Grow everywhere."}
                </h2>
                {" "}
                <p className="discover-desc">
                  {"Effix Labs brings your Google presence, community conversations and AI search visibility into one clear plan, so customers can find you wherever they look."}
                </p>
                {" "}
                {" "}
                <div className="discover-pillars-list" role="tablist" aria-label="Effix Discover Platform Pillars">
                  {" "}
                  <button type="button" className="discover-pillar-item is-active" role="tab" aria-selected="true" data-pillar="search">
                    {" "}
                    <span className="pillar-name">
                      {"Search"}
                    </span>
                    {" "}
                  </button>
                  {" "}
                  <button type="button" className="discover-pillar-item" role="tab" aria-selected="false" data-pillar="content">
                    {" "}
                    <span className="pillar-name">
                      {"Content"}
                    </span>
                    {" "}
                  </button>
                  {" "}
                  <button type="button" className="discover-pillar-item" role="tab" aria-selected="false" data-pillar="ai">
                    {" "}
                    <span className="pillar-name">
                      {"AI"}
                    </span>
                    {" "}
                  </button>
                  {" "}
                </div>
                {" "}
                {" "}
                <div className="discover-pillar-divider" aria-hidden="true"></div>
                {" "}
                {" "}
                <p className="discover-subtext">
                  {"Clear audits, practical plans and honest reports you can act on."}
                </p>
                {" "}
                {" "}
                <div className="discover-action-wrap">
                  {" "}
                  <a href="#audit" className="discover-cta-btn">
                    {" "}
                    <span>
                      {"Run a Visibility Audit"}
                    </span>
                    {" "}
                    <span className="cta-arrow" aria-hidden="true">
                      {"→"}
                    </span>
                    {" "}
                  </a>
                  {" "}
                  <span className="discover-subtle-note">
                    {" "}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {" "}
                      <circle cx="12" cy="12" r="10"></circle>
                      {" "}
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      {" "}
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      {" "}
                    </svg>
                    {" Free · Live Google results on eight platforms "}
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="discover-visual-stage" aria-label="Effix Discover platform in action with real-time search visibility and AI insights">
                {" "}
                <div className="discover-showcase-frame" id="discoverShowcaseFrame">
                  {" "}
                  <div className="discover-slides-container">
                    {" "}
                    {" "}
                    <img src="/images/discover-slide-girl.jpg" alt="Effix Discover Platform Intelligence" className="discover-slide is-active" width={1024} height={1024} loading="lazy" decoding="async" data-slide="girl" />
                    {" "}
                    {" "}
                    <img src="/images/discover-slide-boy.jpg" alt="Effix Discover Search, Content and AI Intelligence" className="discover-slide" width={1024} height={1024} loading="lazy" decoding="async" data-slide="boy" />
                    {" "}
                  </div>
                  {" "}
                  <div className="discover-visual-backlight" aria-hidden="true"></div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        {" "}
        <section className="section-timeline-outer" id="process">
          {" "}
          <div className="timeline_card_container">
            {" "}
            {" "}
            <div className="timeline_main-box">
              {" "}
              <div className="timeline-content">
                {" "}
                {" "}
                <div className="timeline_custom-line hide-tablet" aria-hidden="true">
                  {" "}
                  <div className="timeline_progress-bar"></div>
                  {" "}
                </div>
                {" "}
                {" "}
                <div className="timeline_content-slot">
                  {" "}
                  {" "}
                  <div className="timeline-item" data-step="1">
                    {" "}
                    <div className="timeline_item-left">
                      {" "}
                      <div className="timeline_heading">
                        {" "}
                        <h3><span className="timeline_accent">{"Audit"}</span>{" your visibility"}</h3>
                        {" "}
                      </div>
                      {" "}
                      <div className="timeline_desc">
                        {" "}
                        <p>
                          {"We look at where your business appears today."}
                        </p>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_item-right">
                      {" "}
                      <div className="art-ambient-glow glow-audit" aria-hidden="true"></div>
                      {" "}
                      <div className="art-stage-wrap" aria-hidden="true" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
                        {" "}
                        <div className="ref-audit-wrap">
                          {" "}
                          {" "}
                          <div className="ref-search-bar">
                            {" "}
                            <div className="ref-search-left">
                              {" "}
                              <svg className="ref-g-icon" viewBox="0 0 24 24">
                                {" "}
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"></path>
                                {" "}
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"></path>
                                {" "}
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"></path>
                                {" "}
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"></path>
                                {" "}
                              </svg>
                              {" "}
                              <span className="ref-search-text">
                                <bdi data-t={"Your business"}></bdi>
                              </span>
                              {" "}
                            </div>
                            {" "}
                            <svg className="ref-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              {" "}
                              <circle cx="11" cy="11" r="8"></circle>
                              {" "}
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              {" "}
                            </svg>
                            {" "}
                          </div>
                          {" "}
                          {" "}
                          <div className="ref-audit-row">
                            {" "}
                            {" "}
                            <div className="ref-profile-card">
                              {" "}
                              <div>
                                {" "}
                                <div className="ref-profile-top">
                                  {" "}
                                  <img src="/images/services/thumb-storefront.webp" alt="" className="ref-profile-thumb" width={256} height={384} loading="lazy" decoding="async" />
                                  {" "}
                                  <div className="ref-profile-meta">
                                    {" "}
                                    <span className="ref-profile-name">
                                      <bdi data-t={"Your Business Name"}></bdi>
                                    </span>
                                    {" "}
                                    <div className="ref-profile-rating">
                                      {" "}
                                      <span className="ref-rating-num">
                                        <bdi data-t={"4.3"}></bdi>
                                      </span>
                                      {" "}
                                      <span className="ref-stars">
                                        <bdi data-t={"★★★★★"}></bdi>
                                      </span>
                                      {" "}
                                      <span className="ref-reviews">
                                        <bdi data-t={"(120)"}></bdi>
                                      </span>
                                      {" "}
                                    </div>
                                    {" "}
                                    <span className="ref-profile-sub">
                                      <bdi data-t={"Business category · "}></bdi>
                                      <span className="ref-open-badge">
                                        <bdi data-t={"Open"}></bdi>
                                      </span>
                                    </span>
                                    {" "}
                                  </div>
                                  {" "}
                                </div>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-profile-tabs">
                                {" "}
                                <span className="ref-tab-pill tab-active">
                                  <bdi data-t={"Overview"}></bdi>
                                </span>
                                {" "}
                                <span className="ref-tab-pill">
                                  <bdi data-t={"Reviews"}></bdi>
                                </span>
                                {" "}
                                <span className="ref-tab-pill">
                                  <bdi data-t={"Photos"}></bdi>
                                </span>
                                {" "}
                                <span className="ref-tab-pill">
                                  <bdi data-t={"About"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                            </div>
                            {" "}
                            {" "}
                            <div className="ref-status-card">
                              {" "}
                              <div className="ref-status-row">
                                {" "}
                                <div className="ref-status-left">
                                  {" "}
                                  <svg className="ref-status-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {" "}
                                    <circle cx="12" cy="12" r="10"></circle>
                                    {" "}
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    {" "}
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                                      {" "}
                                    </path>
                                    {" "}
                                  </svg>
                                  {" "}
                                  <span>
                                    <bdi data-t={"Online presence"}></bdi>
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-amber">
                                  <bdi data-t={"Needs work"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-status-row">
                                {" "}
                                <div className="ref-status-left">
                                  {" "}
                                  <svg className="ref-status-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {" "}
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    {" "}
                                    <circle cx="12" cy="7" r="4"></circle>
                                    {" "}
                                  </svg>
                                  {" "}
                                  <span>
                                    <bdi data-t={"Business profile"}></bdi>
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-green">
                                  <bdi data-t={"Good"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-status-row">
                                {" "}
                                <div className="ref-status-left">
                                  {" "}
                                  <svg className="ref-status-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {" "}
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    {" "}
                                    <circle cx="9" cy="7" r="4"></circle>
                                    {" "}
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    {" "}
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    {" "}
                                  </svg>
                                  {" "}
                                  <span>
                                    <bdi data-t={"Local mentions"}></bdi>
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-purple">
                                  <bdi data-t={"Limited"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-status-row">
                                {" "}
                                <div className="ref-status-left">
                                  {" "}
                                  <svg className="ref-status-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {" "}
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                    {" "}
                                    <line x1="8" y1="21" x2="16" y2="21"></line>
                                    {" "}
                                    <line x1="12" y1="17" x2="12" y2="21"></line>
                                    {" "}
                                  </svg>
                                  {" "}
                                  <span>
                                    <bdi data-t={"Website visibility"}></bdi>
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-amber">
                                  <bdi data-t={"Needs work"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_point-element hide-tablet"></div>
                    {" "}
                  </div>
                  {" "}
                  {" "}
                  <div className="timeline-item" data-step="2">
                    {" "}
                    <div className="timeline_item-left">
                      {" "}
                      <div className="timeline_heading">
                        {" "}
                        <h3><span className="timeline_accent">{"Plan"}</span>{" what matters"}</h3>
                        {" "}
                      </div>
                      {" "}
                      <div className="timeline_desc">
                        {" "}
                        <p>
                          {"We choose the actions that matter most."}
                        </p>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_item-right">
                      {" "}
                      <div className="art-ambient-glow glow-plan" aria-hidden="true"></div>
                      {" "}
                      <div className="art-stage-wrap" aria-hidden="true" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
                        {" "}
                        <div className="ref-plan-wrap">
                          {" "}
                          {" "}
                          <div className="ref-plan-card">
                            {" "}
                            <div className="ref-plan-header">
                              <bdi data-t={"Your action plan"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-plan-list">
                              {" "}
                              <div className="ref-plan-item item-checked">
                                {" "}
                                <div className="ref-checkbox">
                                  {" "}
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    {" "}
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                    {" "}
                                  </svg>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-plan-label">
                                  <bdi data-t={"Improve Google Business Profile"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-plan-item item-checked">
                                {" "}
                                <div className="ref-checkbox">
                                  {" "}
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    {" "}
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                    {" "}
                                  </svg>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-plan-label">
                                  <bdi data-t={"Add helpful content"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-plan-item item-unchecked">
                                {" "}
                                <div className="ref-checkbox"></div>
                                {" "}
                                <span className="ref-plan-label">
                                  <bdi data-t={"Get mentioned in relevant sites"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-plan-item item-unchecked">
                                {" "}
                                <div className="ref-checkbox"></div>
                                {" "}
                                <span className="ref-plan-label">
                                  <bdi data-t={"Answer customer questions"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                          {" "}
                          <div className="ref-priority-card">
                            {" "}
                            <div className="ref-priority-header">
                              <bdi data-t={"Priority"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-priority-list">
                              {" "}
                              <div className="ref-priority-item">
                                {" "}
                                <div className="ref-prio-icon">
                                  {" "}
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    {" "}
                                    <path d="M4 19h4V9H4v10zm6 0h4V5h-4v14zm6 0h4v-7h-4v7z"></path>
                                    {" "}
                                  </svg>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-prio-label">
                                  <bdi data-t={"High impact"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-priority-item">
                                {" "}
                                <div className="ref-prio-icon">
                                  {" "}
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                    {" "}
                                    <path d="M7 2v11h3v9l7-12h-4l4-8z"></path>
                                    {" "}
                                  </svg>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-prio-label">
                                  <bdi data-t={"Quick wins"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-priority-item">
                                {" "}
                                <div className="ref-prio-icon">
                                  {" "}
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    {" "}
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    {" "}
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    {" "}
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    {" "}
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                    {" "}
                                  </svg>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-prio-label">
                                  <bdi data-t={"Long term"}></bdi>
                                </span>
                                {" "}
                              </div>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_point-element hide-tablet"></div>
                    {" "}
                  </div>
                  {" "}
                  {" "}
                  <div className="timeline-item" data-step="3">
                    {" "}
                    <div className="timeline_item-left">
                      {" "}
                      <div className="timeline_heading">
                        {" "}
                        <h3><span className="timeline_accent">{"Publish"}</span>{" improvements"}</h3>
                        {" "}
                      </div>
                      {" "}
                      <div className="timeline_desc">
                        {" "}
                        <p>
                          {"We create and improve profiles, answers and content."}
                        </p>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_item-right">
                      {" "}
                      <div className="art-ambient-glow glow-publish" aria-hidden="true"></div>
                      {" "}
                      <div className="art-stage-wrap" aria-hidden="true" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
                        {" "}
                        <div className="ref-publish-wrap">
                          {" "}
                          {" "}
                          <div className="ref-publish-card card-biz">
                            {" "}
                            <div className="ref-pub-card-header">
                              {" "}
                              <svg width="15" height="15" viewBox="0 0 24 24">
                                {" "}
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"></path>
                                {" "}
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"></path>
                                {" "}
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"></path>
                                {" "}
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"></path>
                                {" "}
                              </svg>
                              {" "}
                              <span className="ref-pub-title">
                                <bdi data-t={"Business Profile"}></bdi>
                              </span>
                              {" "}
                              <span className="ref-pub-chat">
                                {" "}
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                  {" "}
                                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
                                  {" "}
                                </svg>
                                {" "}
                              </span>
                              {" "}
                            </div>
                            {" "}
                            <div className="ref-pub-mini-stars">
                              <bdi data-t={"★★★★★"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-pub-thumb-wrap">
                              {" "}
                              <img src="/images/services/thumb-storefront.webp" alt="" className="ref-pub-thumb" width={256} height={384} loading="lazy" decoding="async" />
                              {" "}
                            </div>
                            {" "}
                            <div className="ref-pub-bottom-stars">
                              <bdi data-t={"★★★★★"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-pub-skeleton">
                              {" "}
                              <span className="sk-line sk-w100"></span>
                              {" "}
                              <span className="sk-line sk-w75"></span>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                          {" "}
                          <div className="ref-publish-card card-content">
                            {" "}
                            <div className="ref-pub-card-header">
                              {" "}
                              <span className="ref-doc-icon">
                                {" "}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                  {" "}
                                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
                                  {" "}
                                </svg>
                                {" "}
                              </span>
                              {" "}
                              <span className="ref-pub-title">
                                <bdi data-t={"Helpful content"}></bdi>
                              </span>
                              {" "}
                            </div>
                            {" "}
                            <div className="ref-pub-content-body">
                              {" "}
                              <div className="ref-pub-lines">
                                {" "}
                                <span className="sk-line sk-w100"></span>
                                {" "}
                                <span className="sk-line sk-w90"></span>
                                {" "}
                                <span className="sk-line sk-w60"></span>
                                {" "}
                              </div>
                              {" "}
                              <img src="/images/services/thumb-architecture.webp" alt="" className="ref-pub-mini-photo" width={256} height={384} loading="lazy" decoding="async" />
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                          {" "}
                          <div className="ref-publish-card card-ai">
                            {" "}
                            <div className="ref-pub-card-header">
                              {" "}
                              <span className="ref-ai-icon">
                                {" "}
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  {" "}
                                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                                  {" "}
                                  <path d="M12 6a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"></path>
                                  {" "}
                                </svg>
                                {" "}
                              </span>
                              {" "}
                              <span className="ref-pub-title-light">
                                <bdi data-t={"AI answer"}></bdi>
                              </span>
                              {" "}
                            </div>
                            {" "}
                            <div className="ref-ai-skeleton">
                              {" "}
                              <span className="ai-sk-line ai-w100"></span>
                              {" "}
                              <span className="ai-sk-line ai-w90"></span>
                              {" "}
                              <span className="ai-sk-line ai-w75"></span>
                              {" "}
                              <span className="ai-sk-line ai-w55"></span>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_point-element hide-tablet"></div>
                    {" "}
                  </div>
                  {" "}
                  {" "}
                  <div className="timeline-item" data-step="4">
                    {" "}
                    <div className="timeline_item-left">
                      {" "}
                      <div className="timeline_heading">
                        {" "}
                        <h3><span className="timeline_accent">{"Measure"}</span>{" what changed"}</h3>
                        {" "}
                      </div>
                      {" "}
                      <div className="timeline_desc">
                        {" "}
                        <p>
                          {"We check what changed and adjust the plan."}
                        </p>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_item-right">
                      {" "}
                      <div className="art-ambient-glow glow-measure" aria-hidden="true"></div>
                      {" "}
                      <div className="art-stage-wrap" aria-hidden="true" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
                        {" "}
                        <div className="ref-measure-wrap">
                          {" "}
                          {" "}
                          <div className="ref-measure-card">
                            {" "}
                            <div className="ref-measure-header">
                              {" "}
                              <span className="ref-measure-title">
                                <bdi data-t={"Search visibility"}></bdi>
                              </span>
                              {" "}
                              <span className="ref-measure-badge">
                                <bdi data-t={"↑ 38%"}></bdi>
                              </span>
                              {" "}
                            </div>
                            {" "}
                            <div className="ref-measure-chart">
                              {" "}
                              <svg className="ref-chart-svg" viewBox="0 0 160 85" preserveAspectRatio="none">
                                {" "}
                                <path d="M 0 75 Q 40 70, 70 52 T 130 25 T 160 8" fill="none" stroke="#a5b4fc" strokeWidth="2.5"></path>
                                {" "}
                                <circle cx="152" cy="12" r="3.5" fill="#8886ff"></circle>
                                {" "}
                              </svg>
                              {" "}
                              <div className="ref-chart-bars">
                                {" "}
                                <span className="ref-cbar" style={{ height: "28%" }}></span>
                                {" "}
                                <span className="ref-cbar" style={{ height: "38%" }}></span>
                                {" "}
                                <span className="ref-cbar" style={{ height: "48%" }}></span>
                                {" "}
                                <span className="ref-cbar" style={{ height: "60%" }}></span>
                                {" "}
                                <span className="ref-cbar" style={{ height: "76%" }}></span>
                                {" "}
                                <span className="ref-cbar active-bar" style={{ height: "94%" }}></span>
                                {" "}
                              </div>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                          {" "}
                          <div className="ref-measure-card">
                            {" "}
                            <div className="ref-stat-header">
                              <bdi data-t={"Search impressions"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-stat-val">
                              <bdi data-t={"12.4K"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-mini-sparkline">
                              {" "}
                              <svg viewBox="0 0 100 35" preserveAspectRatio="none">
                                {" "}
                                <path d="M 0 30 Q 30 26, 50 16 T 100 6" fill="none" stroke="#8886ff" strokeWidth="2"></path>
                                {" "}
                              </svg>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                          {" "}
                          <div className="ref-measure-card">
                            {" "}
                            <div className="ref-stat-header">
                              <bdi data-t={"Profile views"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-stat-val">
                              <bdi data-t={"3.8K"}></bdi>
                            </div>
                            {" "}
                            <div className="ref-mini-sparkline">
                              {" "}
                              <svg viewBox="0 0 100 35" preserveAspectRatio="none">
                                {" "}
                                <path d="M 0 30 Q 30 24, 60 14 T 100 4" fill="none" stroke="#8886ff" strokeWidth="2"></path>
                                {" "}
                              </svg>
                              {" "}
                            </div>
                            {" "}
                          </div>
                          {" "}
                        </div>
                        {" "}
                      </div>
                      {" "}
                    </div>
                    {" "}
                    <div className="timeline_point-element hide-tablet"></div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="timeline_content-outside">
                {" "}
                {" "}
                <div className="timeline_point-element closing-node hide-tablet" aria-hidden="true">
                  {" "}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {" "}
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="#ffffff"></path>
                    {" "}
                  </svg>
                  {" "}
                </div>
                {" "}
                <div className="pc-card" id="processClosingCard">
                  <div className="pc-card-inner">
                    <div className="pc-card-copy">
                      <span className="pc-eyebrow">{"The Effix method"}</span>
                      <h3 className="pc-card-title"><span className="pc-grad">{"Four steps from guesswork "}</span><br />{"to a plan."}</h3>
                      <p className="pc-card-text">{"We turn uncertainty into a clear plan. See where you stand, focus on what matters, make the improvements, and track what changed."}</p>
                      <p className="pc-card-note"><span className="pc-note-dot" aria-hidden="true"></span>{"We report what we can measure. We say so when we can’t."}</p>
                      <div className="pc-card-ctas">
                        <a href="#audit" className="pc-btn-primary">{"Run a Visibility Audit →"}</a>
                        <a href="#services" className="pc-btn-ghost">{"Explore services"}</a>
                      </div>
                    </div>
                    <div className="pc-loop" role="img" aria-label="Audit, plan, publish and measure, repeated as a loop">
                      <div className="pc-loop-glow" aria-hidden="true"></div>
                      <svg className="pc-ring" viewBox="0 0 400 400" aria-hidden="true">
                        <circle className="pc-ring-track" cx="200" cy="200" r="150"></circle>
                        <g className="pc-ring-arcs">
                          <circle className="pc-arc pc-arc-1" cx="200" cy="200" r="150"></circle>
                          <circle className="pc-arc pc-arc-2" cx="200" cy="200" r="150"></circle>
                          <circle className="pc-arc pc-arc-3" cx="200" cy="200" r="150"></circle>
                          <circle className="pc-arc pc-arc-4" cx="200" cy="200" r="150"></circle>
                        </g>
                        <g className="pc-orbit"><circle cx="200" cy="50" r="7" className="pc-orbit-dot"></circle></g>
                        <circle className="pc-ring-inner" cx="200" cy="200" r="104"></circle>
                      </svg>
                      <div className="pc-loop-center" aria-hidden="true">
                        <span className="pc-loop-kicker">{"Your"}</span>
                        <span className="pc-loop-big">{"visibility loop"}</span>
                        <span className="pc-loop-small">{"Measure → adjust → repeat"}</span>
                      </div>
                      <div className="pc-node pc-node-1" aria-hidden="true"><span className="pc-node-ico">{"01"}</span><div><b>{"Audit"}</b><small>{"Visibility snapshot"}</small></div></div>
                      <div className="pc-node pc-node-2" aria-hidden="true"><span className="pc-node-ico">{"02"}</span><div><b>{"Plan"}</b><small>{"Action plan"}</small></div></div>
                      <div className="pc-node pc-node-3" aria-hidden="true"><span className="pc-node-ico">{"03"}</span><div><b>{"Publish"}</b><small>{"Improvements live"}</small></div></div>
                      <div className="pc-node pc-node-4" aria-hidden="true"><span className="pc-node-ico">{"04"}</span><div><b>{"Measure"}</b><small>{"What changed"}</small></div></div>
                    </div>
                  </div>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        {" "}
        <section className="principles-section" id="why-effix">
          {" "}
          {" "}
          <div className="principles-aura-container" aria-hidden="true">
            {" "}
            <div className="principles-orb principles-orb-champagne"></div>
            {" "}
            <div className="principles-orb principles-orb-slate"></div>
            {" "}
            <div className="principles-orb principles-orb-blend"></div>
            {" "}
            <div className="principles-grain-overlay"></div>
            {" "}
          </div>
          {" "}
          <div className="principles-stage-wrapper">
            {" "}
            {" "}
            <div className="principles-editorial-panel">
              {" "}
              {" "}
              <div className="principles-panel-header">
                {" "}
                <div className="principles-eyebrow">
                  {"PRINCIPLES"}
                </div>
                {" "}
                <h2 className="principles-headline">
                  {"Plain work. Real evidence."}
                </h2>
                {" "}
                <p className="principles-intro">
                  {"Our work is guided by a set of principles that shape every project we take on at Effix Labs."}
                </p>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="principles-columns-grid">
                {" "}
                {" "}
                <div className="principles-col">
                  {" "}
                  <div className="principles-col-top">
                    {" "}
                    <span className="principles-col-num">
                      {"01"}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div className="principles-col-bottom">
                    {" "}
                    <h3 className="principles-col-title">
                      {"Evidence first"}
                    </h3>
                    {" "}
                    <p className="principles-col-desc">
                      {"We look at your current visibility before we recommend anything."}
                    </p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                {" "}
                <div className="principles-col">
                  {" "}
                  <div className="principles-col-top">
                    {" "}
                    <span className="principles-col-num">
                      {"02"}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div className="principles-col-bottom">
                    {" "}
                    <h3 className="principles-col-title">
                      {"Genuine work"}
                    </h3>
                    {" "}
                    <p className="principles-col-desc">
                      {"No fake reviews. No fake accounts. No hidden promotion. When we take part in a community, we say who we work for."}
                    </p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
                {" "}
                <div className="principles-col">
                  {" "}
                  <div className="principles-col-top">
                    {" "}
                    <span className="principles-col-num">
                      {"03"}
                    </span>
                    {" "}
                  </div>
                  {" "}
                  <div className="principles-col-bottom">
                    {" "}
                    <h3 className="principles-col-title">
                      {"Honest limits"}
                    </h3>
                    {" "}
                    <p className="principles-col-desc">
                      {"Nobody controls Google or AI tools. We don’t promise rankings, leads or AI mentions."}
                    </p>
                    {" "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        {" "}
        {" "}
        {" "}
        <section className="section-padding section-surface" id="faqs">
          {" "}
          <div className="container">
            {" "}
            <div className="section-eyebrow" style={{ textAlign: "center" }}>
              {"FAQs"}
            </div>
            {" "}
            <h2 className="section-heading-editorial" style={{ textAlign: "center", marginBottom: "48px" }}>
              {"Questions people ask first "}
            </h2>
            {" "}
            <div className="faq-container">
              {HOME_FAQS.map((it, i) => (
                <div className="faq-item" key={i}>
                  <button className="faq-button" type="button" aria-expanded="false" aria-controls={`faq-a${i + 1}`} id={`faq-q${i + 1}`} data-onclick="toggleFaq(this)">
                    <span>{it.q}</span>
                    <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <div className="faq-answer-panel" id={`faq-a${i + 1}`} role="region" aria-labelledby={`faq-q${i + 1}`}>
                    <div className="faq-answer-content">
                      {it.a.map((p, k) => (typeof p === "string" ? <span key={k}>{p}</span> : <a key={k} href={p.href}>{p.text}</a>))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
        {" "}
        <section className="section-padding" id="final-cta">
          {" "}
          <div className="container">
            {" "}
            <div className="cta-box-card">
              {" "}
              <h2 className="cta-heading">
                {"Find out where you show up."}
              </h2>
              {" "}
              <p className="cta-desc">
                {"Start with the free audit. Or tell us about your business and we will reply by email."}
              </p>
              {" "}
              <div className="cta-actions-row">
                {" "}
                <a href="#audit" className="submit-pill-btn" style={{ textDecoration: "none" }}>
                  {"Run a Visibility Audit →"}
                </a>
                {" "}
                <a href="/contact" className="secondary-cta-btn">
                  {"Contact Effix Labs →"}
                </a>
                {" "}
              </div>
              {" "}
              <a href="mailto:hello@effix.co.in" className="cta-email-link">
                {"hello@effix.co.in"}
              </a>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </section>
        {" "}
      </main>
      {" "}
      {" "}
      <footer className="site-footer">
        {" "}
        <div className="container">
          {" "}
          <div className="footer-grid">
            {" "}
            {" "}
            <div className="footer-brand-col">
              {" "}
              <a href="/" className="brand-logo" aria-label="Effix Labs Home">
                {" "}
                <svg className="effix-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {" "}
                  <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"></path>
                  {" "}
                  <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></path>
                  {" "}
                </svg>
                {" "}
                <span className="brand-name">
                  {"Effix Labs"}
                </span>
                {" "}
              </a>
              {" "}
              <p className="footer-tagline">
                {"Get found where your customers search."}
              </p>
              {" "}
              <p className="footer-desc">
                {"Effix Labs helps businesses get found on Google, in online communities and in AI search."}
              </p>
              {" "}
            </div>
            {" "}
            {" "}
            <div className="footer-col">
              {" "}
              <h3 className="footer-col-title">
                {"Services"}
              </h3>
              {" "}
              <ul className="footer-nav-list">
                {" "}
                <li>
                  <a href="/services/google-business-profile">
                    {"Google Business Profile Optimisation"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/services/reddit-marketing">
                    {"Reddit Marketing"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/services/seo-aeo-services">
                    {"SEO & AEO Services"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/services/content-writing">
                    {"Content Writing"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/services/website-design-development">
                    {"Website Design & Development"}
                  </a>
                </li>
                {" "}
              </ul>
              {" "}
            </div>
            {" "}
            {" "}
            <div className="footer-col">
              {" "}
              <h3 className="footer-col-title">
                {"Product"}
              </h3>
              {" "}
              <ul className="footer-nav-list">
                {" "}
                <li>
                  <a href="#audit">
                    {"Effix Discover"}
                  </a>
                </li>
                {" "}
              </ul>
              {" "}
            </div>
            {" "}
            {" "}
            <div className="footer-col">
              {" "}
              <h3 className="footer-col-title">
                {"Company"}
              </h3>
              {" "}
              <ul className="footer-nav-list">
                {" "}
                <li>
                  <a href="/about">
                    {"About"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/blog">
                    {"Blog"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/work">
                    {"Work"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/contact">
                    {"Contact"}
                  </a>
                </li>
                {" "}
              </ul>
              {" "}
            </div>
            {" "}
            {" "}
            <div className="footer-col">
              {" "}
              <h3 className="footer-col-title">
                {"Legal"}
              </h3>
              {" "}
              <ul className="footer-nav-list">
                {" "}
                <li>
                  <a href="/privacy">
                    {"Privacy Policy"}
                  </a>
                </li>
                {" "}
                <li>
                  <a href="/terms">
                    {"Terms of Service"}
                  </a>
                </li>
                {" "}
              </ul>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
          <div className="footer-bottom-row">
            {" "}
            <span>
              {"© 2026 Effix Labs"}
            </span>
            {" "}
            <a href="mailto:hello@effix.co.in">
              {"hello@effix.co.in"}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </footer>
      {" "}
      {" "}
      <LegacyScripts id="home" srcs={SCRIPTS} />
    </>
  );
}
