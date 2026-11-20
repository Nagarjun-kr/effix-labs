// Generated from the original static page (index.html). Markup is rendered on the server;
// the page's original scripts are loaded in order by <LegacyScripts>.
import type { Metadata } from "next";
import LegacyScripts from "@/components/LegacyScripts";
import "./page.css";

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
    "siteName": "Effix Labs"
  }
};

const SCRIPTS = [
  "/js/legacy-shim.js",
  "/js/home/01.js",
  "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js",
  "/js/home/02.js",
  "/js/home/03.js",
  "/scripts/lenis.min.js",
  "/js/home/04.js"
];

export default function Page() {
  return (
    <>

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
            <a href="/discover" className="nav-cta-btn">
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
                <a href="#services" className="mobile-nav-link" id="mobileNavServicesBtn">
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
                <a href="/discover" className="nav-cta-btn" style={{ display: "inline-block", marginTop: "10px" }} data-onclick="toggleMobileDrawer()">
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
                  {"Free. No login. Checks Google organic search today."}
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
              <a href="/discover" className="window-content-anchor" aria-label="Explore Search Discovery on Effix Labs">
                {" "}
                <img src="/images/Refrnce_cropped.png?v=5" alt="Search is not one place anymore. Multiple places, real opportunities across Google, Online Communities and AI Search" className="window-display-image" loading="eager" />
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
          {" "}
          <div className="container">
            {" "}
            <h2 className="section-heading-editorial">
              {"Digital Discovery starts with three questions."}
            </h2>
            {" "}
            <p className="section-intro-text">
              {"Digital Discovery is the work of making a business easy to find and easy to trust at the moment someone searches. We begin by asking:"}
            </p>
            {" "}
            <div className="approach-grid">
              {" "}
              {" "}
              <div className="approach-col">
                {" "}
                <div className="approach-num">
                  {"01"}
                </div>
                {" "}
                <h3 className="approach-question-title">
                  {"Where do you show up today?"}
                </h3>
                {" "}
                <p className="approach-desc">
                  {"We look at what people actually see when they search for businesses like yours."}
                </p>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="approach-col">
                {" "}
                <div className="approach-num">
                  {"02"}
                </div>
                {" "}
                <h3 className="approach-question-title">
                  {"What are people asking?"}
                </h3>
                {" "}
                <p className="approach-desc">
                  {"We look at the questions your customers use to find, compare and choose."}
                </p>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="approach-col">
                {" "}
                <div className="approach-num">
                  {"03"}
                </div>
                {" "}
                <h3 className="approach-question-title">
                  {"What should change first?"}
                </h3>
                {" "}
                <p className="approach-desc">
                  {"We pick the few actions that matter most, instead of doing everything at once."}
                </p>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
            <div>
              {" "}
              <a href="/about" className="editorial-inline-link">
                {"Explore Our Approach →"}
              </a>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
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
                      <img src="/images/services/service-01-gbp.jpg" alt="Google Business Profile Optimisation service poster" className="service-poster-img" loading="eager" />
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
                      <img src="/images/services/service-02-reddit-quora.jpg" alt="Reddit Marketing service poster" className="service-poster-img" loading="eager" />
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
                  <a href="/services/ai-search-visibility" className="service-artwork-card" data-index="2" data-service-id="ai-search" aria-label="SEO & AEO Services">
                    {" "}
                    <div className="service-poster-wrapper">
                      {" "}
                      <img src="/images/services/service-03-ai-search.jpg" alt="SEO & AEO Services service poster" className="service-poster-img" loading="eager" />
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
                        {"Make your information clearer and easier to find when people use AI search."}
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
                      <img src="/images/services/service-04-blog-seo.jpg" alt="Content Writing service poster" className="service-poster-img" loading="eager" />
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
                      <img src="/images/services/service-05-web-dev.jpg" alt="Website Design & Development service poster" className="service-poster-img" loading="eager" />
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
                  {"Get discovered."}
                  <br />
                  {"Grow everywhere."}
                </h2>
                {" "}
                <p className="discover-desc">
                  {"EFFIX Labs unifies search, content, and AI within a single intelligence layer, ensuring your business is discoverable across every customer touchpoint."}
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
                  {"Fast, intelligent tools built for real visibility and measurable growth."}
                </p>
                {" "}
                {" "}
                <div className="discover-action-wrap">
                  {" "}
                  <a href="/discover" className="discover-cta-btn">
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
                    {" Illustrative preview · Audits Google organic search "}
                  </span>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="discover-visual-stage" aria-label="EFFIX Discover platform in action with real-time search visibility and AI insights">
                {" "}
                <div className="discover-showcase-frame" id="discoverShowcaseFrame">
                  {" "}
                  <div className="discover-slides-container">
                    {" "}
                    {" "}
                    <img src="/images/discover-slide-girl.jpg" alt="EFFIX Discover Platform Intelligence" className="discover-slide is-active" data-slide="girl" loading="eager" />
                    {" "}
                    {" "}
                    <img src="/images/discover-slide-boy.jpg" alt="EFFIX Discover Search, Content and AI Intelligence" className="discover-slide" data-slide="boy" loading="eager" />
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
                      <div className="art-stage-wrap" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
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
                                {"Your business"}
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
                                  <img src="/images/services/google-business-profile.png" alt="Business storefront" className="ref-profile-thumb" />
                                  {" "}
                                  <div className="ref-profile-meta">
                                    {" "}
                                    <span className="ref-profile-name">
                                      {"Your Business Name"}
                                    </span>
                                    {" "}
                                    <div className="ref-profile-rating">
                                      {" "}
                                      <span className="ref-rating-num">
                                        {"4.3"}
                                      </span>
                                      {" "}
                                      <span className="ref-stars">
                                        {"★★★★★"}
                                      </span>
                                      {" "}
                                      <span className="ref-reviews">
                                        {"(120)"}
                                      </span>
                                      {" "}
                                    </div>
                                    {" "}
                                    <span className="ref-profile-sub">
                                      {"Business category · "}
                                      <span className="ref-open-badge">
                                        {"Open"}
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
                                  {"Overview"}
                                </span>
                                {" "}
                                <span className="ref-tab-pill">
                                  {"Reviews"}
                                </span>
                                {" "}
                                <span className="ref-tab-pill">
                                  {"Photos"}
                                </span>
                                {" "}
                                <span className="ref-tab-pill">
                                  {"About"}
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
                                    {"Online presence"}
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-amber">
                                  {"Needs work"}
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
                                    {"Business profile"}
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-green">
                                  {"Good"}
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
                                    {"Local mentions"}
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-purple">
                                  {"Limited"}
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
                                    {"Website visibility"}
                                  </span>
                                  {" "}
                                </div>
                                {" "}
                                <span className="ref-status-pill pill-amber">
                                  {"Needs work"}
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
                      <div className="art-stage-wrap" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
                        {" "}
                        <div className="ref-plan-wrap">
                          {" "}
                          {" "}
                          <div className="ref-plan-card">
                            {" "}
                            <div className="ref-plan-header">
                              {"Your action plan"}
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
                                  {"Improve Google Business Profile"}
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
                                  {"Add helpful content"}
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-plan-item item-unchecked">
                                {" "}
                                <div className="ref-checkbox"></div>
                                {" "}
                                <span className="ref-plan-label">
                                  {"Get mentioned in relevant sites"}
                                </span>
                                {" "}
                              </div>
                              {" "}
                              <div className="ref-plan-item item-unchecked">
                                {" "}
                                <div className="ref-checkbox"></div>
                                {" "}
                                <span className="ref-plan-label">
                                  {"Answer customer questions"}
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
                              {"Priority"}
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
                                  {"High impact"}
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
                                  {"Quick wins"}
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
                                  {"Long term"}
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
                      <div className="art-stage-wrap" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
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
                                {"Business Profile"}
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
                              {"★★★★★"}
                            </div>
                            {" "}
                            <div className="ref-pub-thumb-wrap">
                              {" "}
                              <img src="/images/services/google-business-profile.png" alt="Profile storefront" className="ref-pub-thumb" />
                              {" "}
                            </div>
                            {" "}
                            <div className="ref-pub-bottom-stars">
                              {"★★★★★"}
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
                                {"Helpful content"}
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
                              <img src="/images/services/ai-blog-seo.png" alt="Architecture content" className="ref-pub-mini-photo" />
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
                                {"AI answer"}
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
                      <div className="art-stage-wrap" data-parallax="y" data-parallax-speed="0.14" data-parallax-range="90" data-parallax-direction="-1">
                        {" "}
                        <div className="ref-measure-wrap">
                          {" "}
                          {" "}
                          <div className="ref-measure-card">
                            {" "}
                            <div className="ref-measure-header">
                              {" "}
                              <span className="ref-measure-title">
                                {"Search visibility"}
                              </span>
                              {" "}
                              <span className="ref-measure-badge">
                                {"↑ 38%"}
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
                              {"Search impressions"}
                            </div>
                            {" "}
                            <div className="ref-stat-val">
                              {"12.4K"}
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
                              {"Profile views"}
                            </div>
                            {" "}
                            <div className="ref-stat-val">
                              {"3.8K"}
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
                      <h3 className="pc-card-title"><span className="pc-grad">{"Four steps from guesswork"}</span><br />{"to a plan."}</h3>
                      <p className="pc-card-text">{"We turn uncertainty into a clear plan. See where you stand, focus on what matters, make the improvements, and track what changed."}</p>
                      <p className="pc-card-note"><span className="pc-note-dot" aria-hidden="true"></span>{"We report what we can measure. We say so when we can’t."}</p>
                      <div className="pc-card-ctas">
                        <a href="/discover" className="pc-btn-primary">{"Run a Visibility Audit →"}</a>
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
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a1" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"What does the free audit check?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a1" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" It checks Google organic search results for queries related to your business. It records where your brand appears and points out possible gaps. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a2" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Do I need to log in or pay?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a2" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" No. The audit is free and needs no login. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a3" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Does the audit cover AI answers, Google Maps, Reddit or Quora?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a3" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" Not yet. Today it covers Google organic search only. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a4" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"What happens to the website I enter?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a4" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" We read your public website to understand your business and create search queries. Our Privacy Policy explains what we store. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a6" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Do you guarantee rankings or leads?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a6" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" No. Google and other platforms make their own decisions. We focus on useful work and honest reporting. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a7" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Do I need special SEO to appear in AI search?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a7" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" For Google’s AI features, Google says no special optimization is needed. Good content and standard SEO basics still apply. We don’t promise a trick that guarantees inclusion. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a8" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Do you use fake reviews or fake accounts?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a8" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" Never. Reviews should come from real customers. Google can restrict profiles that break its rules on fake engagement. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a9" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"How do you work on Reddit and Quora?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a9" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" We disclose our client relationships and follow each community’s rules. We try to give useful, relevant answers. We avoid undisclosed promotion. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a10" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Who writes your blog content?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a10" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" AI helps with drafting. A person reviews every article. We cite reliable sources for factual claims. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a11" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"Do you work with businesses in India and abroad?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a11" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" Yes. We work with businesses in India and internationally. "}
                  </div>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
              {" "}
              <div className="faq-item">
                {" "}
                <button className="faq-button" type="button" aria-expanded="false" aria-controls="faq-a12" data-onclick="toggleFaq(this)">
                  {" "}
                  <span>
                    {"How do I contact Effix Labs?"}
                  </span>
                  {" "}
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {" "}
                    <polyline points="6 9 12 15 18 9"></polyline>
                    {" "}
                  </svg>
                  {" "}
                </button>
                {" "}
                <div className="faq-answer-panel" id="faq-a12" role="region">
                  {" "}
                  <div className="faq-answer-content">
                    {" Email "}
                    <a href="mailto:effix.labs@gmail.com">
                      {"effix.labs@gmail.com"}
                    </a>
                    {" or use the contact page. "}
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
                <a href="/discover" className="submit-pill-btn" style={{ textDecoration: "none" }}>
                  {"Run a Visibility Audit →"}
                </a>
                {" "}
                <a href="/contact" className="secondary-cta-btn">
                  {"Contact Effix Labs →"}
                </a>
                {" "}
              </div>
              {" "}
              <a href="mailto:effix.labs@gmail.com" className="cta-email-link">
                {"effix.labs@gmail.com"}
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
                  <a href="/services/ai-search-visibility">
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
                  <a href="/discover">
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
            <a href="mailto:effix.labs@gmail.com">
              {"effix.labs@gmail.com"}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </footer>
      {" "}
      {" "}
      <div className="effix-orbit-stage" id="effixServicesOrbitStage" role="dialog" aria-modal="true" aria-label="Services Interactive Orbital Exploration">
        {" "}
        <div className="orbit-stage-scrim"></div>
        {" "}
        {" "}
        <header className="orbit-stage-header">
          {" "}
          <button type="button" className="orbit-top-back-btn" id="orbitTopBackBtn" aria-label="Back to homepage">
            {" "}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {" "}
              <line x1="19" y1="12" x2="5" y2="12"></line>
              {" "}
              <polyline points="12 19 5 12 12 5"></polyline>
              {" "}
            </svg>
            {" "}
          </button>
          {" "}
        </header>
        {" "}
        {" "}
        <div className="orbit-wheel-stage-viewport" id="orbitStageViewport">
          {" "}
          {" "}
          <div className="orbit-wheel-container" id="orbitWheelContainer">
            {" "}
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      {" "}
      {" "}
      {" "}
      {" "}
      {" "}
      {" "}
      {" "}
      {" "}
      {" "}
      <LegacyScripts id="home" srcs={SCRIPTS} />
    </>
  );
}
