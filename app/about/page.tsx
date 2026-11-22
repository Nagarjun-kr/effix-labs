// About Effix Labs: the founder (Nagarjun), why Effix Labs exists, how it differs from typical agencies,
// an interactive journey roadmap, mission and vision, goals, services and principles.
import type { Metadata } from "next";

import AppIcon from "@/lib/discover/app-icon";
import { ORG_ID, SITE_URL, ldString } from "@/lib/site";
import { Mark, SiteFooter, SiteNav } from "./chrome";
import Road, { type Milestone } from "./road";
import "./about.css";

const TITLE = "About Effix Labs | Founded by Nagarjun";
const DESC =
  "Meet Nagarjun, who founded Effix Labs to make honest businesses easy to find on Google, in online communities and in AI answers, with evidence, not empty promises.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}/about`, type: "profile", images: [{ url: `${SITE_URL}/images/og-home.jpg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/images/og-home.jpg`] },
};

const LINKEDIN = "https://www.linkedin.com/in/nagarjuna-k-r-977ba1329/";

const LD = ldString({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about#page`,
  url: `${SITE_URL}/about`,
  name: TITLE,
  description: DESC,
  about: { "@id": ORG_ID },
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/about#nagarjun`,
    name: "Nagarjun",
    jobTitle: "Founder",
    worksFor: { "@id": ORG_ID },
    sameAs: [LINKEDIN],
  },
});

const JOURNEY: Milestone[] = [
  { tag: "Curiosity", title: "Learning how search works", text: "It began with questions. Why does Google show this business and not that one? I spent my time learning SEO and performance marketing, testing ideas and studying what actually changes visibility, and what only looks good in a report." },
  { tag: "The gap", title: "Seeing what businesses miss", text: "A pattern kept repeating. Good businesses were losing customers simply because they were hard to find or hard to trust online, while many agencies offered them expensive, one-size-fits-all packages." },
  { tag: "Founding Effix Labs", title: "Starting Effix Labs", text: "I founded Effix Labs with one rule: evidence before recommendations. No fake reviews, no bought engagement and no promises that nobody can keep." },
  { tag: "Building", title: "Five services, one plan", text: "Google Business Profile optimisation, Reddit marketing, SEO & AEO, content writing, and website design and development. Each covers a place where customers search, and together they work as one plan." },
  { tag: "Effix Discover", title: "A free tool for every business", text: "I built Effix Discover so any business can see where it shows up, free and without a login. It reads your website, searches your brand on eight platforms through Google and turns the results into a clear report." },
  { tag: "What’s next", title: "Visible everywhere people search", next: true, text: "The next chapter: helping businesses across India appear in AI answers as clearly as on Google, making Effix Discover more capable, and sharing what we learn openly along the way." },
];

const COMPARE: [string, string, string][] = [
  ["Pricing", "Big fixed packages and high monthly fees", "A plan priced around the few actions that will move your results"],
  ["Starting point", "The same checklist for every client", "Evidence first: we study your current visibility before recommending anything"],
  ["Commitment", "Long contracts and lock-ins", "No lock-in. You stay because the work is useful"],
  ["Promises", "Guaranteed rankings in 30 days", "Honest limits. Nobody controls Google or AI tools, so we never promise rankings"],
  ["Tactics", "Fake reviews, bots and bought engagement", "Genuine work only. In communities, we say who we work for"],
  ["Reporting", "Long reports full of vanity numbers", "Clear reports: what changed, what didn’t, and what we do next"],
];

const SERVICES = [
  { href: "/services/google-business-profile", title: "Google Business Profile", text: "Help nearby customers find you on Google and feel sure about choosing you.", icon: "Google" },
  { href: "/services/reddit-marketing", title: "Reddit Marketing", text: "Take part in the conversations where people ask for advice.", icon: "Reddit" },
  { href: "/services/seo-aeo-services", title: "SEO & AEO", text: "Rank higher on Google and get cited when people ask AI tools.", icon: "seo" },
  { href: "/services/content-writing", title: "Content Writing", text: "Helpful articles and pages that answer real customer questions.", icon: "pen" },
  { href: "/services/website-design-development", title: "Website Design & Development", text: "A modern, responsive, SEO-ready website that performs.", icon: "web" },
  { href: "/#audit", title: "Effix Discover", text: "Free visibility audit: see your brand on eight platforms in about a minute.", icon: "radar" },
];

const GENERIC: Record<string, string> = {
  seo: "M3 17l6-6 4 4 8-8M15 7h6v6",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  web: "M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01",
  radar: "M12 12 19 5M21 12a9 9 0 1 1-9-9M16.5 12a4.5 4.5 0 1 1-4.5-4.5",
};

export default function AboutPage() {
  return (
    <div className="ab">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: LD }} />

      <SiteNav current="about" />

      <main>
        {/* HERO */}
        <section className="hx">
          <div className="hx-ghost" aria-hidden="true">NAGARJUN</div>
          <span className="hx-fl f1"><AppIcon name="Google" size={52} float /></span>
          <span className="hx-fl f2"><AppIcon name="Reddit" size={44} float /></span>
          <span className="hx-fl f3"><AppIcon name="YouTube" size={46} float /></span>
          <span className="hx-fl f4"><AppIcon name="LinkedIn" size={42} float /></span>
          <span className="hx-fl f5"><AppIcon name="Instagram" size={40} float /></span>
          <div className="ab-wrap hx-in">
            <span className="ab-eyebrow">About Effix Labs</span>
            <h1>I’m Nagarjun. I started Effix Labs to make good businesses <em>easy to find.</em></h1>
            <p className="hx-lead">I founded Effix Labs with one simple belief: if you do honest, useful work, people should be able to find you. Today, finding you happens on Google, inside online communities and in AI answers. My job is to make sure you show up in all three, with evidence instead of empty promises.</p>
            <div className="hx-founder">
              <span className="hx-avatar" aria-hidden="true">N</span>
              <span className="hx-who"><b>Nagarjun</b><small>Founder, Effix Labs</small></span>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hx-in-link">LinkedIn ↗</a>
            </div>
            <div className="ab-actions hx-actions">
              <a href="/#audit" className="ab-btn ab-btn-dark">Run a free visibility audit →</a>
              <a href="mailto:hello@effixlabs.in" className="ab-btn ab-btn-ghost">Email me</a>
            </div>
          </div>
          <a href="#journey" className="hx-cue"><span>Scroll to start the journey</span><i aria-hidden="true" /></a>
        </section>

        {/* ROAD JOURNEY (scroll-driven) */}
        <div id="journey">
          <Road steps={JOURNEY} />
        </div>

        {/* WHO I AM */}
        <section className="wx">
          <div className="ab-wrap wx-grid">
            <div className="wx-big" aria-hidden="true"><b>1:1</b><span>every client works<br />directly with me</span></div>
            <div>
              <span className="ab-label">01 · Who I am</span>
              <h2>Who <em>I am</em></h2>
              <div className="wx-prose">
                <p className="wx-first">I’m Nagarjun, the founder of Effix Labs. I came into this work through search: how people look for things, what Google decides to show them, and why some businesses get picked while equally good ones stay invisible. The more I learned about SEO and performance marketing, the clearer one pattern became. Visibility rarely depends on how good a business is. It depends on whether that business is clear, consistent and present in the places people actually look.</p>
                <p>Search has never been new to me: I grew up with search, online communities and now AI tools as a normal part of everyday decisions. I don’t treat them as trends to sell. I treat them as the new front door of every business.</p>
                <blockquote>“I built every page, every service and Effix Discover myself, because I wanted Effix Labs to show what it believes, not just say it.”</blockquote>
                <p>Building Effix Labs has meant long nights of writing, designing, testing and rebuilding. Every page on this website, every service and the free Effix Discover tool came out of that work.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="yx">
          <div className="ab-wrap">
            <span className="ab-label">02 · The problem</span>
            <h2>Why Effix Labs <em>exists</em></h2>
            <p className="yx-lead">Think about how you choose a dentist, a café, a software tool or an agency.</p>
            <ol className="yx-moments">
              <li><span className="yx-ic"><AppIcon name="Google" size={40} /></span><b>You search on Google</b><p>You glance at the map and the reviews.</p></li>
              <li><span className="yx-ic"><AppIcon name="Reddit" size={40} /></span><b>You read what people say</b><p>On Reddit and in online communities, before you decide.</p></li>
              <li><span className="yx-ic yx-ai" aria-hidden="true">✦</span><b>You ask an AI tool</b><p>More and more, ChatGPT or Gemini recommends for you.</p></li>
            </ol>
            <div className="yx-grid">
              <p>Each of those moments is a chance to be chosen, and most businesses miss many of them. Their Google profile is half finished. Nobody answers the questions customers ask in communities. AI tools describe them vaguely, or not at all. And when they turn to an agency for help, they’re often handed a large package, a long contract and a monthly report full of numbers that explain nothing.</p>
              <p className="yx-pull">Effix Labs exists to fix that. We call the work <strong>Digital Discovery</strong>: making a business easy to find and easy to trust at the exact moment someone searches.</p>
            </div>
          </div>
        </section>

        {/* DIFFERENT */}
        <section className="cx">
          <div className="ab-wrap">
            <div className="cx-head">
              <span className="ab-label">03 · How we’re different</span>
              <h2>Not another <em>expensive agency</em></h2>
              <p>Many agencies sell size: bigger packages, higher fees, more deliverables. I built Effix Labs around something else: results you can see, at a cost that matches the work that actually moves them.</p>
            </div>
            <div className="cx-duel">
              <div className="cx-side cx-them">
                <span className="cx-who">Typical agency</span>
                <ul>{COMPARE.map(([k, them]) => <li key={k}><small>{k}</small><span>{them}</span></li>)}</ul>
              </div>
              <span className="cx-vs" aria-hidden="true">VS</span>
              <div className="cx-side cx-us">
                <span className="cx-who"><Mark /> Effix Labs</span>
                <ul>{COMPARE.map(([k, , us]) => <li key={k}><small>{k}</small><span><i aria-hidden="true">✓</i>{us}</span></li>)}</ul>
              </div>
            </div>
            <p className="cx-note">“Designed results” means exactly that: we design the work around the outcome you need, not around a package we want to sell.</p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="mx">
          <div className="ab-wrap">
            <span className="ab-label">04 · Mission & vision</span>
            <div className="mx-row">
              <span className="mx-k">Mission</span>
              <p>Make honest businesses easy to find and easy to trust, everywhere their customers search: on Google, in communities and in AI answers.</p>
            </div>
            <div className="mx-row is-vision">
              <span className="mx-k">Vision</span>
              <p>A web where visibility is earned through real quality and clear information, not bought through fake reviews or hidden promotion, and where a small business in India can be found as easily as a global brand.</p>
            </div>
          </div>
        </section>

        {/* GOALS */}
        <section className="gx2">
          <div className="ab-wrap">
            <span className="ab-label">05 · What I’m going to achieve</span>
            <h2>What I’m <em>building toward</em></h2>
            <div className="gx2-grid">
              <article className="gx2-card is-wide"><span>01</span><b>Help more Indian businesses get found</b><p>Starting in Bengaluru and growing across India, bringing local businesses, startups and brands into Google, community and AI search with plans they can understand.</p></article>
              <article className="gx2-card is-violet"><span>02</span><b>Make Effix Discover more powerful</b><p>Today it checks eight platforms. Next, I want it to show how AI tools and Google Maps describe a business too, and keep it free to use.</p></article>
              <article className="gx2-card is-lime"><span>03</span><b>Prove that honest marketing works</b><p>Every result we report will be one we can show. If something doesn’t work, we’ll say so and change the plan.</p></article>
              <article className="gx2-card is-wide"><span>04</span><b>Build a team that thinks this way</b><p>As Effix Labs grows, every person on the team will share the same principles: evidence first, genuine work and honest limits.</p></article>
            </div>
          </div>
        </section>

        {/* WHAT EFFIX LABS DOES */}
        <section className="sx">
          <div className="ab-wrap">
            <div className="sx-head">
              <div>
                <span className="ab-label">06 · About Effix Labs</span>
                <h2>What Effix Labs <em>does</em></h2>
              </div>
              <p>Effix Labs brings your Google presence, community conversations and AI search visibility into one clear plan, so customers can find you wherever they look. We work with local businesses, startups and growing brands in Bengaluru and across India, and every service connects to the same goal: being found, and being trusted, by the people already searching for what you offer.</p>
            </div>
            <div className="sx-bento">
              {SERVICES.map((sv, i) => (
                <a key={sv.href} href={sv.href} className={`sx-card s${i + 1}`}>
                  <span className="sx-ic">
                    {sv.icon === "Google" || sv.icon === "Reddit" ? (
                      <AppIcon name={sv.icon} size={46} />
                    ) : (
                      <span className="sx-gen"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={GENERIC[sv.icon]} /></svg></span>
                    )}
                  </span>
                  <strong>{sv.title}</strong>
                  <p>{sv.text}</p>
                  <span className="sx-go" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* HOW A PROJECT WORKS */}
        <section className="px">
          <div className="ab-wrap">
            <span className="ab-label">07 · How we work</span>
            <h2>How a project <em>works</em></h2>
            <p className="px-lead">Every engagement follows the same clear cycle, so you always know what we’re doing and why.</p>
            <ol className="px-track">
              <li><span>01</span><b>Audit</b><p>We look at where your business appears today on Google, in communities and in AI answers, and what customers see when they search.</p></li>
              <li><span>02</span><b>Plan</b><p>We choose the few actions that will matter most, in the right order, instead of doing everything at once.</p></li>
              <li><span>03</span><b>Improve</b><p>We create and improve your profiles, answers, content and website, with genuine work you can check.</p></li>
              <li><span>04</span><b>Measure</b><p>We report what changed and what didn’t, explain why, and adjust the plan for the next round.</p></li>
            </ol>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="qx">
          <div className="ab-wrap">
            <span className="ab-label">08 · Principles</span>
            <h2>The principles I <em>won’t bend</em></h2>
            <div className="qx-grid">
              <article><span>01</span><h3>Evidence first</h3><p>We look at your current visibility before we recommend anything.</p></article>
              <article><span>02</span><h3>Genuine work</h3><p>No fake reviews. No fake accounts. No hidden promotion. When we take part in a community, we say who we work for.</p></article>
              <article><span>03</span><h3>Honest limits</h3><p>Nobody controls Google or AI tools. We don’t promise rankings, leads or AI mentions.</p></article>
            </div>
          </div>
        </section>

        {/* FOUNDER NOTE */}
        <section className="lx">
          <div className="ab-wrap">
            <div className="lx-paper">
              <span className="ab-label">A note from me</span>
              <p className="lx-text">If you’ve read this far, thank you. Effix Labs is a focused studio, and I’m proud of that. It means every client gets my full attention, every plan is built on real evidence, and every promise is one I can keep. Run a free visibility audit to see where you stand today, or email me about your business. I read every message, and I’ll tell you honestly whether we can help.</p>
              <div className="lx-sign">
                <span className="lx-name">Nagarjun</span>
                <span className="lx-role">Founder, Effix Labs</span>
              </div>
              <div className="ab-actions">
                <a href="/#audit" className="ab-btn ab-btn-dark">Run a Visibility Audit →</a>
                <a href="mailto:hello@effixlabs.in" className="ab-btn ab-btn-ghost">hello@effixlabs.in</a>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-ghost">LinkedIn ↗</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
