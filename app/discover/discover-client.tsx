"use client";

// Effix Discover — free visibility audit.
// Website URL -> our server reads that one public page -> brand name + social links found on it
// -> Google's Programmable Search Element searches the brand on 9 platforms -> live results shown
// as potential mentions. Nothing is stored and no login is needed.
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

type Profile = { platform: string; url: string };
type Identity = { name: string; domain: string; sourceUrl: string; profiles: Profile[] };
type Phase = "idle" | "loading" | "done";

type CseElement = { execute: (query: string) => void };
type CseApi = { render: (o: { div: string; tag: string; gname: string }) => void; getElement: (name: string) => CseElement | null };
declare global {
  interface Window {
    __gcse?: { parsetags: string };
    google?: { search?: { cse?: { element?: CseApi } } };
  }
}

const PLATFORMS = [
  { name: "YouTube", domain: "youtube.com", sym: "▶" },
  { name: "Instagram", domain: "instagram.com", sym: "◎" },
  { name: "Facebook", domain: "facebook.com", sym: "f" },
  { name: "LinkedIn", domain: "linkedin.com", sym: "in" },
  { name: "X", domain: "x.com", sym: "𝕏" },
  { name: "TikTok", domain: "tiktok.com", sym: "♪" },
  { name: "Reddit", domain: "reddit.com", sym: "r/" },
  { name: "Pinterest", domain: "pinterest.com", sym: "P" },
  { name: "Threads", domain: "threads.net", sym: "@" },
] as const;

const STEPS = ["Reading your website", "Finding your brand and linked profiles", "Searching 9 platforms on Google"];

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function DiscoverClient({ engineId }: { engineId: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [website, setWebsite] = useState("");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [view, setView] = useState<string>("all");
  const [runId, setRunId] = useState(0); // a new set of Google elements per audit
  const [searchTick, setSearchTick] = useState(0); // re-run searches for the same audit
  const renderedRun = useRef(-1);
  const [stalled, setStalled] = useState<Record<string, boolean>>({});

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
      setStep(2);
      await new Promise((r) => window.setTimeout(r, 450));
      setIdentity(id);
      setBrandQuery(id.name);
      setView("all");
      setRunId((n) => n + 1);
      setPhase("done");
      try { window.history.replaceState(null, "", `/discover?url=${encodeURIComponent(id.domain)}`); } catch { /* ignore */ }
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPhase(identity ? "done" : "idle");
    } finally {
      window.clearTimeout(t);
    }
  }, [identity]);

  // Arrived from the homepage audit form (?url=… or the saved session value): start straight away.
  useEffect(() => {
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

  // Render one Google results element per platform, then search "<brand>" site:<platform>.
  useEffect(() => {
    if (phase !== "done" || !scriptReady || !engineId || !brandQuery.trim()) return;
    const api = window.google?.search?.cse?.element;
    if (!api) return;
    const timer = window.setTimeout(() => {
      const term = brandQuery.trim().replaceAll('"', "").slice(0, 100);
      PLATFORMS.forEach((p, i) => {
        const gname = `dx_${runId}_${i}`;
        if (renderedRun.current !== runId) api.render({ div: `dx-results-${runId}-${i}`, tag: "searchresults-only", gname });
        const site = p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`;
        api.getElement(gname)?.execute(`"${term}" ${site}`);
      });
      renderedRun.current = runId;
    }, 0);
    // If Google hasn't filled a card after 12s (busy, blocked or offline), say so instead of leaving it blank.
    setStalled({});
    const check = window.setTimeout(() => {
      const next: Record<string, boolean> = {};
      PLATFORMS.forEach((p, i) => {
        const el = document.getElementById(`dx-results-${runId}-${i}`);
        const filled = !!el && (el.querySelector(".gsc-webResult.gsc-result, .gs-no-results-result") !== null || /did not match|no results/i.test(el.innerText));
        if (!filled) next[p.name] = true;
      });
      setStalled(next);
    }, 12000);
    return () => { window.clearTimeout(timer); window.clearTimeout(check); };
    // brandQuery is read at search time; searches re-run on a new audit or "Search again"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, scriptReady, engineId, runId, searchTick]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    run(website);
  }

  const googleUrl = (p: (typeof PLATFORMS)[number]) => {
    const term = brandQuery.trim().replaceAll('"', "").slice(0, 100);
    const site = p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`;
    return `https://www.google.com/search?q=${encodeURIComponent(`"${term}" ${site}`)}`;
  };
  const linked = new Map<string, Profile>();
  identity?.profiles.forEach((p) => { if (!linked.has(p.platform)) linked.set(p.platform, p); });
  const linkedCount = PLATFORMS.filter((p) => linked.has(p.name)).length;

  return (
    <div className="dx">
      {engineId && (
        <Script src={`https://cse.google.com/cse.js?cx=${encodeURIComponent(engineId)}`} strategy="afterInteractive" onReady={() => setScriptReady(true)} onError={() => setScriptError(true)} />
      )}

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
              <p className="dx-sub">Enter your website. We find your brand name and the profiles you link to, then show live Google results for your brand on nine platforms.</p>
              <form className="dx-form" onSubmit={submit}>
                <label htmlFor="dx-url" className="sr-only">Your website URL</label>
                <input id="dx-url" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourbusiness.com" autoComplete="url" inputMode="url" required />
                <button className="dx-btn" type="submit">Run a Visibility Audit <span aria-hidden="true">→</span></button>
              </form>
              {error && <p className="dx-error" role="alert">{error}</p>}
              {!engineId && <p className="dx-error" role="status">Google search isn&apos;t configured for this site yet.</p>}
              <p className="dx-note"><span>Free</span><span>No login</span><span>Nothing saved</span></p>
            </div>
          </section>

          <section className="dx-how" aria-labelledby="dx-how-title">
            <div className="dx-wrap">
              <h2 id="dx-how-title" className="sr-only">How Effix Discover works</h2>
              <ol className="dx-steps">
                <li className="dx-step"><b>01</b><h2>We read your website</h2><p>Our server opens the one public page you enter. It never logs in or saves the page.</p></li>
                <li className="dx-step"><b>02</b><h2>We find your brand</h2><p>We pick up your brand name and the social profiles your site already links to. You can correct the name.</p></li>
                <li className="dx-step"><b>03</b><h2>We search 9 platforms</h2><p>Google searches your brand name on each platform and we show the live results under each one.</p></li>
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
        <main className="dx-report">
          <div className="dx-wrap">
            <header className="dx-report-head">
              <div>
                <span className="dx-kicker">Visibility report</span>
                <h1>{identity.name}</h1>
                <a className="dx-domain" href={identity.sourceUrl} target="_blank" rel="noopener noreferrer">{identity.domain} <span aria-hidden="true">↗</span></a>
              </div>
              <div className="dx-head-actions">
                <span className="dx-live"><i aria-hidden="true" /> Live Google results</span>
                <form className="dx-again" onSubmit={submit}>
                  <label htmlFor="dx-url2" className="sr-only">Check another website</label>
                  <input id="dx-url2" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Check another website" inputMode="url" required />
                  <button className="dx-btn" type="submit">Run audit</button>
                </form>
              </div>
            </header>
            {error && <p className="dx-error" role="alert">{error}</p>}

            <section className="dx-name" aria-label="Brand name used for searching">
              <div>
                <span className="dx-label">Brand name we searched</span>
                <p>We found this name on your website. If people know you by a different name, change it and search again.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setSearchTick((n) => n + 1); }}>
                <label htmlFor="dx-brand" className="sr-only">Brand name</label>
                <input id="dx-brand" value={brandQuery} onChange={(e) => setBrandQuery(e.target.value)} maxLength={100} />
                <button className="dx-btn" type="submit" disabled={!brandQuery.trim()}>Search again</button>
              </form>
            </section>

            <section className="dx-stats" aria-label="Summary">
              <div className="dx-stat"><span className="dx-label">Platforms searched</span><strong>{PLATFORMS.length}</strong><small>Live Google results for each</small></div>
              <div className="dx-stat"><span className="dx-label">Linked from your website</span><strong>{linkedCount}<span style={{ fontSize: 22, color: "#a3a3a3" }}> / {PLATFORMS.length}</span></strong><small>Platforms your site links to</small></div>
              <div className="dx-stat"><span className="dx-label">Social links found</span><strong>{identity.profiles.length}</strong><small>On the page you entered</small></div>
            </section>

            <section className="dx-linked" aria-label="Profiles linked from your website">
              <span className="dx-label">Profiles linked from your website</span>
              <div className="dx-linked-grid">
                {PLATFORMS.map((p) => {
                  const hit = linked.get(p.name);
                  return hit ? (
                    <a key={p.name} className="dx-chip yes" href={hit.url} target="_blank" rel="noopener noreferrer"><i aria-hidden="true">✓</i>{p.name}<small>Linked</small></a>
                  ) : (
                    <span key={p.name} className="dx-chip no"><i aria-hidden="true" />{p.name}<small>Not linked</small></span>
                  );
                })}
              </div>
            </section>

            <div className="dx-section-head">
              <div><span className="dx-label">Platform discovery</span><h2>Potential mentions across the web</h2></div>
              <p>Google results can include posts that mention your brand without being your official profile. Open each result to check it.</p>
            </div>
            {scriptError && <p className="dx-error" role="alert">Google&apos;s search couldn&apos;t load. Please try again in a moment.</p>}
            <div className="dx-tabs" role="tablist" aria-label="Choose a platform">
              <button type="button" role="tab" aria-selected={view === "all"} className={`dx-tab ${view === "all" ? "is-on" : ""}`} onClick={() => setView("all")}>All platforms</button>
              {PLATFORMS.map((p) => (
                <button key={p.name} type="button" role="tab" aria-selected={view === p.name} className={`dx-tab ${view === p.name ? "is-on" : ""}`} onClick={() => setView(p.name)}>{p.name}</button>
              ))}
            </div>
            <div className={`dx-grid ${view === "all" ? "" : "is-single"}`}>
              {PLATFORMS.map((p, i) => (
                <section key={p.name} className="dx-card" hidden={view !== "all" && view !== p.name}>
                  <button type="button" className="dx-card-head" onClick={() => setView(p.name)} aria-label={`Show only ${p.name} results`}>
                    <span className="sym" aria-hidden="true">{p.sym}</span>{p.name}
                    <span className={`tag ${linked.has(p.name) ? "yes" : ""}`}>{linked.has(p.name) ? "Linked on your site" : "Google results"}</span>
                  </button>
                  <div id={`dx-results-${runId}-${i}`} className="dx-results" />
                  {stalled[p.name] && (
                    <p className="dx-stalled">Google hasn&apos;t returned results for this platform right now. Try <b>Search again</b> in a minute, or open this search on Google.</p>
                  )}
                  <a className="dx-open" href={googleUrl(p)} target="_blank" rel="noopener noreferrer">Open this search on Google <span aria-hidden="true">↗</span></a>
                </section>
              ))}
            </div>

            <p className="dx-coverage"><strong>Coverage note.</strong> Searches cover public pages Google has indexed on these platforms. Private, blocked or differently named pages may not appear, and Google may show approximate counts or ads. The brand name comes from your website and may need correcting. This is a discovery tool, not a complete count of every post or profile.</p>

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

      <footer className="dx-footer">© 2026 Effix Labs · Search results are provided by Google and are not verified by Effix Labs.</footer>
    </div>
  );
}
