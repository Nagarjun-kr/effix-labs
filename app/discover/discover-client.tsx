"use client";

// Effix Discover — free visibility audit.
// Website URL -> our server reads that one public page -> brand name + social links found on it
// -> our server searches "<brand>" site:<platform> on 8 platforms (Google results via Serper.dev)
// -> results shown as potential mentions. No Google widget in the browser, so no CAPTCHA.
// Nothing is stored and no login is needed.
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { checkTargets, type ProfileCheck } from "@/lib/discover/classify";
import Report, { PLATFORMS, type Identity, type Mentions, type PlatformResult } from "./report";

type Phase = "idle" | "loading" | "done";

const STEPS = ["Reading your website", "Finding your brand and linked profiles", "Searching 8 platforms on Google"];

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function DiscoverClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [website, setWebsite] = useState("");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [mentions, setMentions] = useState<Mentions>({ status: "loading" });
  const [searched, setSearched] = useState(""); // brand name the shown results are for
  const [checks, setChecks] = useState<Record<string, ProfileCheck>>({}); // profile pages we opened to confirm
  const [blocked, setBlocked] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null); // the website refused our visit; name taken from its address

  // After the search: open YouTube channels found, to confirm whether they are the linked channel.
  useEffect(() => {
    if (mentions.status !== "done" || !identity) return;
    const items = checkTargets(identity, mentions, mentions.brand);
    if (!items.length) return;
    let live = true;
    fetch("/api/discovery/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: identity.domain, items }) })
      .then((r) => r.json())
      .then((b: { checks?: ProfileCheck[] }) => {
        if (!live || !Array.isArray(b.checks)) return;
        const map: Record<string, ProfileCheck> = {};
        b.checks.forEach((c) => (map[c.url] = c));
        setChecks(map);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [mentions, identity]);

  const searchMentions = useCallback(async (brand: string) => {
    const term = brand.trim();
    if (!term) return;
    setMentions({ status: "loading" });
    setChecks({});
    setSearched(term);
    try {
      const res = await fetch("/api/discovery/mentions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: term }) });
      const body = await res.json().catch(() => ({}));
      if (body.configured === false) return setMentions({ status: "off" });
      if (!res.ok || !Array.isArray(body.platforms)) throw new Error(body.error || "The search didn't finish. Please try again.");
      const byPlatform: Record<string, PlatformResult> = {};
      (body.platforms as PlatformResult[]).forEach((p) => (byPlatform[p.platform] = p));
      setMentions({ status: "done", brand: term, byPlatform });
      setUpdatedAt(new Date());
    } catch (e) {
      setMentions({ status: "error", message: e instanceof Error ? e.message : "The search didn't finish. Please try again." });
    }
  }, []);

  const run = useCallback(async (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setError(null);
    setPhase("loading");
    setStep(0);
    const t = window.setTimeout(() => setStep(1), 700);
    try {
      const res = await fetch("/api/discovery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: value }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.identity) throw new Error(body.error || "We couldn't open that website. Check the address and try again.");
      const id = body.identity as Identity;
      setBlocked(Boolean(body.blocked));
      setStep(2);
      await new Promise((r) => window.setTimeout(r, 450));
      setIdentity(id);
      setBrandQuery(id.name);
      setPhase("done");
      searchMentions(id.name);
      try { window.history.replaceState(null, "", `/discover?url=${encodeURIComponent(id.domain)}`); } catch { /* ignore */ }
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPhase(identity ? "done" : "idle");
    } finally {
      window.clearTimeout(t);
    }
  }, [identity, searchMentions]);

  // Arrived from the homepage audit form (?url=… or the saved session value): start straight away.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current) return; // React runs mount effects twice in development; audit only once
    autoStarted.current = true;
    let incoming: string | null = null;
    try { incoming = new URLSearchParams(window.location.search).get("url"); } catch { /* ignore */ }
    if (!incoming) {
      try { incoming = sessionStorage.getItem("effix_audit_target"); } catch { /* ignore */ }
    }
    try { sessionStorage.removeItem("effix_audit_target"); } catch { /* ignore */ }
    if (incoming) {
      const clean = incoming.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      setWebsite(clean);
      run(clean);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    run(website);
  }

  return (
    <div className="dx">
      <header className="dx-header">
        <div className="dx-wrap">
          <a className="dx-logo" href="/" aria-label="Effix Labs home"><Logo /><span>Effix Labs</span><em>Discover</em></a>
          <a className="dx-back" href="/"><span aria-hidden="true">←</span> Back to home</a>
        </div>
      </header>

      {phase === "idle" && (
        <main>
          <section className="dx-hero">
            <div className="dx-wrap">
              <span className="dx-kicker">Effix Discover · Free visibility audit</span>
              <h1 className="dx-h1">Find your brand <em>across the web.</em></h1>
              <p className="dx-sub">Enter your website. We find your brand name and the profiles you link to, then show live Google results for your brand on eight platforms.</p>
              <form className="dx-form" onSubmit={submit}>
                <label htmlFor="dx-url" className="sr-only">Your website URL</label>
                <input id="dx-url" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourbusiness.com" autoComplete="url" inputMode="url" required />
                <button className="dx-btn" type="submit">Run a Visibility Audit <span aria-hidden="true">→</span></button>
              </form>
              {error && <p className="dx-error" role="alert">{error}</p>}
              <p className="dx-note"><span>Free</span><span>No login</span><span>Nothing saved</span></p>
            </div>
          </section>

          <section className="dx-how" aria-labelledby="dx-how-title">
            <div className="dx-wrap">
              <h2 id="dx-how-title" className="sr-only">How Effix Discover works</h2>
              <ol className="dx-steps">
                <li className="dx-step"><b>01</b><h2>We read your website</h2><p>Our server opens the one public page you enter. It never logs in or saves the page.</p></li>
                <li className="dx-step"><b>02</b><h2>We find your brand</h2><p>We pick up your brand name and the social profiles your site already links to. You can correct the name.</p></li>
                <li className="dx-step"><b>03</b><h2>We search 8 platforms</h2><p>Google searches your brand name on each platform and we show the live results under each one.</p></li>
              </ol>
              <div className="dx-platforms" aria-label="Platforms searched">{PLATFORMS.map((p) => <span key={p.name}>{p.name}</span>)}</div>
              <p className="dx-limits">Results only include pages Google has indexed. A result can mention your brand without being an official account. This is a discovery tool, not a complete count of every post or profile.</p>
            </div>
          </section>
        </main>
      )}

      {phase === "loading" && (
        <main className="dx-loading" aria-live="polite">
          <div className="dx-wrap">
            <span className="dx-kicker">Running your visibility audit</span>
            <h1>{website.replace(/^https?:\/\//i, "").replace(/\/$/, "") || "Your website"}</h1>
            <ol className="dx-progress">
              {STEPS.map((s, i) => <li key={s} className={i < step ? "is-done" : i === step ? "is-active" : ""}><i aria-hidden="true" />{s}</li>)}
            </ol>
          </div>
        </main>
      )}

      {phase === "done" && identity && (
        <main className="dx-report vz">
          <div className="dx-wrap">
            <div className="vz-top">
              <form className="vz-search" onSubmit={submit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <label htmlFor="dx-url2" className="sr-only">Website to audit</label>
                <input id="dx-url2" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourbusiness.com" inputMode="url" required />
                <button className="vz-dark" type="submit">Change</button>
              </form>
              <span className="vz-live"><i aria-hidden="true" /> Live search results</span>
            </div>

            <header className="vz-head">
              <div>
                <h1>Brand Visibility Overview</h1>
                <p>
                  <a href={identity.sourceUrl} target="_blank" rel="noopener noreferrer">{identity.domain}</a> · {identity.name}
                  {updatedAt && <> · Last updated {updatedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</>}
                </p>
              </div>
              <button type="button" className="vz-dark vz-new" onClick={() => { setPhase("idle"); setWebsite(""); setIdentity(null); try { window.history.replaceState(null, "", "/discover"); } catch { /* ignore */ } window.scrollTo({ top: 0 }); }}>
                <span aria-hidden="true">+</span> New Audit
              </button>
            </header>
            {error && <p className="dx-error" role="alert">{error}</p>}
            {blocked && (
              <p className="dx-error dx-warn" role="status">
                {identity.domain} blocks automated visits, so we couldn&apos;t see which profiles it links to. We took the name “{identity.name}” from the address. Check it below, and treat “Official” as unknown for this site.
              </p>
            )}

            <Report
              identity={identity}
              mentions={mentions}
              brand={searched || identity.name}
              checks={checks}
              nameEditor={
                <section className="dx-name vz-card" aria-label="Brand name used for searching">
                  <div>
                    <span className="dx-label">Brand name we searched</span>
                    <p>We found “{identity.name}” on your website. If people know you by a different name, change it and search again.</p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); searchMentions(brandQuery); }}>
                    <label htmlFor="dx-brand" className="sr-only">Brand name</label>
                    <input id="dx-brand" value={brandQuery} onChange={(e) => setBrandQuery(e.target.value)} maxLength={100} />
                    <button className="dx-btn" type="submit" disabled={!brandQuery.trim() || mentions.status === "loading"}>{mentions.status === "loading" ? "Searching…" : "Search again"}</button>
                  </form>
                </section>
              }
            />

            <p className="dx-coverage"><strong>Coverage note.</strong> Searches cover public pages Google has indexed on these eight platforms, up to eight results each. Private, blocked or differently named pages may not appear. YouTube channels are confirmed by opening their public page; other platforms block automated visits, so their status comes from search evidence. Platform logos are trademarks of their owners.</p>

            <section className="dx-cta" aria-label="Get help from Effix Labs">
              <div>
                <span className="dx-label">Next step</span>
                <h2>Want to show up <em>in more places?</em></h2>
                <p>Effix Labs helps businesses get found on Google, in online communities and in AI search, with honest reporting and no fake reviews or accounts.</p>
              </div>
              <div className="dx-cta-links">
                <a href="/services/google-business-profile">Google Business Profile Optimisation <span aria-hidden="true">→</span></a>
                <a href="/services/reddit-marketing">Reddit Marketing <span aria-hidden="true">→</span></a>
                <a href="/services/seo-aeo-services">SEO &amp; AEO Services <span aria-hidden="true">→</span></a>
                <a href="/services/content-writing">Content Writing <span aria-hidden="true">→</span></a>
                <p className="dx-cta-mail">Or email <a href="mailto:hello@effix.co.in">hello@effix.co.in</a>. We reply within one business day.</p>
              </div>
            </section>
          </div>
        </main>
      )}

      <footer className="dx-footer">© 2026 Effix Labs · Search results come from Google and are not verified by Effix Labs.</footer>
    </div>
  );
}

