"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- links to the homepage must be full page loads: its scripts
   (animations, the #audit search box) only start on a real page load, which <Link> would skip. */

// Effix Discover results page. The only search box is on the homepage (#audit); it opens /discover?url=…
// Flow: full-screen scan (website read -> Google workflow, live progress) -> "report ready" -> dashboard.
// No Google widget in the browser, so no CAPTCHA. Nothing is stored and no login is needed.
import { useCallback, useEffect, useRef, useState } from "react";

import { checkTargets, type Overview, type ProfileCheck } from "@/lib/discover/classify";
import { displayHost, parseWebsite } from "@/lib/discover/input";
import Report, { Orb as PlatformOrb, type Identity, type Mentions, type PlatformResult } from "./report";
import Scan, { type ScanStage, type SearchProgress } from "./scan";
import { API_BASE } from "@/lib/api";
import { bindForm } from "@/lib/forms/guard";
import { getHumanToken } from "@/lib/turnstile";

type Phase = "start" | "gate" | "scan" | "done";

const FREE_LIMIT = 1;
const USES_KEY = "effix_discover_uses";
const UNLOCKED_KEY = "effix_discover_unlocked";

function getUses(): number {
  try { return Number(localStorage.getItem(USES_KEY) || "0") || 0; } catch { return 0; }
}
function addUse() {
  try { localStorage.setItem(USES_KEY, String(getUses() + 1)); } catch { /* ignore */ }
}
function isUnlocked(): boolean {
  try {
    if (localStorage.getItem(UNLOCKED_KEY) === "1") return true;
    if (sessionStorage.getItem("effix-cms:github-token")) return true;
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}
function markUnlocked() {
  try { localStorage.setItem(UNLOCKED_KEY, "1"); } catch { /* ignore */ }
}

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function DiscoverClient() {
  const [phase, setPhase] = useState<Phase>("start");
  const [stage, setStage] = useState<ScanStage>("site");
  const [website, setWebsite] = useState("");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mentions, setMentions] = useState<Mentions>({ status: "loading" });
  const [searched, setSearched] = useState(""); // brand name the shown results are for
  const [checks, setChecks] = useState<Record<string, ProfileCheck>>({}); // profile pages we opened to confirm
  const [blocked, setBlocked] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [progress, setProgress] = useState<SearchProgress>({ overview: "wait", platforms: {} }); // the website refused our visit; name taken from its address
  const [pendingUrl, setPendingUrl] = useState("");
  const gateFormRef = useRef<HTMLFormElement>(null);

  // After the search: open YouTube channels found, to confirm whether they are the linked channel.
  useEffect(() => {
    if (mentions.status !== "done" || !identity) return;
    const items = checkTargets(identity, mentions, mentions.brand);
    if (!items.length) return;
    let live = true;
    fetch(`${API_BASE}/api/discovery/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: identity.domain, items }) })
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

  const searchMentions = useCallback(async (brand: string, domain: string): Promise<void> => {
    const term = brand.trim();
    if (!term) return;
    setMentions({ status: "loading" });
    setChecks({});
    setSearched(term);
    setProgress({ overview: "wait", platforms: {} });
    const fail = "The search didn't finish. Please try again.";
    try {
      const res = await fetch(`${API_BASE}/api/discovery/mentions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
        body: JSON.stringify({ brand: term, domain, turnstile: await getHumanToken() }),
      });
      const type = res.headers.get("content-type") ?? "";
      if (!type.includes("ndjson") || !res.body) {
        const body = await res.json().catch(() => ({}));
        if (body.configured === false) return setMentions({ status: "off" });
        throw new Error(body.error || fail);
      }
      // Read progress lines as the server works through the steps, then the final result.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let final: { platforms?: PlatformResult[]; overview?: Overview; message?: string; type?: string } | null = null;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "step") {
            setProgress((p) => {
              if (ev.step === "overview") return { ...p, overview: ev.state === "done" ? "done" : "run", siteFound: ev.siteFound ?? p.siteFound };
              const cur = p.platforms[ev.platform] ?? { state: "wait" as const };
              const state = ev.state === "start" ? (ev.step === "second" ? "second" : "run") : "done";
              return { ...p, platforms: { ...p.platforms, [ev.platform]: { state, found: ev.found ?? cur.found } } };
            });
          } else final = ev;
        }
      }
      if (!final || final.type === "error" || !Array.isArray(final.platforms)) throw new Error(final?.message || fail);
      const byPlatform: Record<string, PlatformResult> = {};
      final.platforms.forEach((p) => (byPlatform[p.platform] = p));
      setMentions({ status: "done", brand: term, byPlatform, overview: final.overview });
      setUpdatedAt(new Date());
    } catch (e) {
      setMentions({ status: "error", message: e instanceof Error ? e.message : fail });
    }
  }, []);

  /** Shows "report ready" briefly, then reveals the dashboard. */
  const reveal = useCallback(async () => {
    setStage("ready");
    await new Promise((r) => window.setTimeout(r, 1300));
    setPhase("done");
    window.scrollTo({ top: 0 });
  }, []);

  const run = useCallback(async (raw: string) => {
    setPhase("scan");
    setStage("site");
    setProgress({ overview: "wait", platforms: {} });
    const parsed = parseWebsite(raw);
    if (!parsed.ok) {
      setWebsite(String(raw ?? "").trim());
      setError(parsed.error);
      setStage("error");
      return;
    }
    setWebsite(displayHost(parsed.host));
    setError(null);
    if (!isUnlocked() && getUses() >= FREE_LIMIT) {
      setPendingUrl(parsed.entered);
      setPhase("gate");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/discovery`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: parsed.entered }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.identity) throw new Error(body.error || "We couldn't open that website. Check the address and try again.");
      const id = body.identity as Identity;
      addUse();
      setBlocked(Boolean(body.blocked));
      setIdentity(id);
      setBrandQuery(id.name);
      try { window.history.replaceState(null, "", `/discover?url=${encodeURIComponent(id.domain)}`); } catch { /* ignore */ }
      setStage("search");
      await searchMentions(id.name, id.domain);
      await reveal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStage("error");
    }
  }, [searchMentions, reveal]);

  /** "Search again" with a different brand name, from the dashboard. */
  const researchName = useCallback(async (name: string) => {
    if (!identity || !name.trim()) return;
    setPhase("scan");
    setStage("search");
    window.scrollTo({ top: 0 });
    await searchMentions(name, identity.domain);
    await reveal();
  }, [identity, searchMentions, reveal]);

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
    if (incoming) run(incoming);
    else window.location.replace("/#audit"); // the only search box is on the homepage
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Banner scene shifts gently with the mouse (like the Reddit service page banner). */
  const parallax = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    e.currentTarget.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const parallaxReset = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--mx", "0");
    e.currentTarget.style.setProperty("--my", "0");
  };

  // Bind the 3rd-search unlock form with strict validation and /api/contact delivery.
  useEffect(() => {
    if (phase !== "gate" || !gateFormRef.current) return;
    return bindForm(gateFormRef.current, {
      name: "Effix Discover Unlock",
      api: API_BASE,
      onSent: () => {
        markUnlocked();
        if (pendingUrl) run(pendingUrl);
      },
    });
  }, [phase, pendingUrl, run]);

  if (phase === "start") return <div className="sc" aria-busy="true"><div className="sc-bg" aria-hidden="true" /></div>;
  if (phase === "gate") {
    return (
      <div className="dx">
        <header className="dx-header">
          <div className="dx-wrap">
            <a className="dx-logo" href="/" aria-label="Effix Labs home"><Logo /><span>Effix Labs</span><em>Discover</em></a>
            <a className="dx-back" href="/"><span aria-hidden="true">←</span> Back to home</a>
          </div>
        </header>
        <main className="dx-gate">
          <div className="dx-gate-card">
            <span className="dx-gate-tag">Free audit used</span>
            <h1>Unlock more brand visibility audits</h1>
            <p>You&apos;ve run your 1 free guest search. Enter your name and work email to continue checking <strong>{website}</strong> and unlock further searches.</p>
            <form className="dx-gate-form" ref={gateFormRef}>
              <label><span>Your name<b aria-hidden="true">*</b></span><input name="name" required autoComplete="name" placeholder="Nagarjun" /></label>
              <label><span>Work email<b aria-hidden="true">*</b></span><input name="email" type="email" required autoComplete="email" placeholder="you@company.com" /></label>
              <label><span>Company name</span><input name="company" autoComplete="organization" placeholder="Optional" /></label>
              <label><span>Website to audit<b aria-hidden="true">*</b></span><input name="website" required defaultValue={pendingUrl} inputMode="url" /></label>
              <button type="submit" className="dx-gate-btn">Unlock &amp; Run Audit →</button>
              <div data-form-status hidden />
            </form>
            <p className="dx-gate-note">Your details go only to the Effix Labs team — no spam, no password needed.</p>
          </div>
        </main>
      </div>
    );
  }
  if (phase === "scan") return <Scan stage={stage} domain={website} brand={searched || identity?.name || ""} progress={progress} error={error} />;

  return (
    <div className="dx">
      <header className="dx-header">
        <div className="dx-wrap">
          <a className="dx-logo" href="/" aria-label="Effix Labs home"><Logo /><span>Effix Labs</span><em>Discover</em></a>
          <a className="dx-back" href="/"><span aria-hidden="true">←</span> Back to home</a>
        </div>
      </header>

      {identity && (
        <main className="dx-report vz vz-reveal">
          <div className="dx-wrap">
            <header className="vz-head">
              <div>
                <span className="vz-eyebrow"><i aria-hidden="true" /> Live visibility report</span>
                <h1>Brand Visibility Overview</h1>
                <p>
                  <a href={identity.sourceUrl} target="_blank" rel="noopener noreferrer">{identity.domain} ↗</a> · {identity.name}
                  {updatedAt && <> · Updated {updatedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</>}
                </p>
              </div>
              <a className="vz-dark vz-new" href="/#audit"><span aria-hidden="true">+</span> New Audit</a>
            </header>
            {error && <p className="dx-error" role="alert">{error}</p>}
            {blocked && (
              <p className="dx-error dx-warn" role="status">
                {identity.domain} doesn&apos;t allow automated visits, so we couldn&apos;t see which profiles it links to. We took the name “{identity.name}” from the address. Check it below, and treat “Official” as unknown for this site.
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
                  <form onSubmit={(e) => { e.preventDefault(); researchName(brandQuery); }}>
                    <label htmlFor="dx-brand" className="sr-only">Brand name</label>
                    <input id="dx-brand" value={brandQuery} onChange={(e) => setBrandQuery(e.target.value)} maxLength={100} />
                    <button className="dx-btn" type="submit" disabled={!brandQuery.trim() || mentions.status === "loading"}>{mentions.status === "loading" ? "Searching…" : "Search again"}</button>
                  </form>
                </section>
              }
            />

            <p className="dx-coverage"><strong>Coverage note.</strong> Each audit runs a fresh, step-by-step Google search: your brand name, then each of the eight platforms (re-checked when results are thin), with a second look where no account turns up. Up to ten results are kept per platform. Private, blocked or differently named pages may not appear. YouTube channels are confirmed by opening their public page; other platforms block automated visits, so their status comes from search evidence. Platform logos are trademarks of their owners.</p>

            <section className="cta3" aria-labelledby="cta3-t" onPointerMove={parallax} onPointerLeave={parallaxReset}>
              <div className="cta3-copy">
                <span className="cta3-kicker">Next step</span>
                <h2 id="cta3-t" className="cta3-title"><span>Want to show up</span><br /><strong>IN MORE PLACES?</strong></h2>
                <p className="cta3-sub"><b>Google, communities and AI search.</b> Effix Labs helps you get found there, with honest reporting and no fake reviews or accounts.</p>
                <div className="cta3-actions">
                  <a className="cta3-btn" href="mailto:hello@effixlabs.in?subject=Visibility%20audit%20for%20my%20brand">
                    Email hello@effixlabs.in
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </a>
                  <span className="cta3-reply"><i aria-hidden="true" /> Reply within one business day</span>
                </div>
                <nav className="cta3-services" aria-label="Effix Labs services">
                  <a href="/services/google-business-profile">Google Business Profile</a>
                  <a href="/services/reddit-marketing">Reddit Marketing</a>
                  <a href="/services/seo-aeo-services">SEO &amp; AEO</a>
                  <a href="/services/content-writing">Content Writing</a>
                </nav>
              </div>
              <div className="cta3-scene" aria-hidden="true">
                <span className="cta3-float f1"><PlatformOrb name="Reddit" size={54} /></span>
                <span className="cta3-float f2"><PlatformOrb name="LinkedIn" size={46} /></span>
                <span className="cta3-float f3"><PlatformOrb name="Instagram" size={42} /></span>
                <span className="cta3-float f4"><PlatformOrb name="YouTube" size={50} /></span>
                <div className="cta3-badge">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="cta3-badge-shadow" />
                <span className="cta3-chip c1"><b>✓</b> Found on Google</span>
                <span className="cta3-chip c2"><b>▲</b> Mentioned in communities</span>
                <span className="cta3-chip c3"><b>✦</b> In AI answers</span>
                <span className="cta3-sphere" />
                <span className="cta3-cone" />
              </div>
            </section>
          </div>
        </main>
      )}

      <footer className="dx-footer">© 2026 Effix Labs · Search results come from Google and are not verified by Effix Labs.</footer>
    </div>
  );
}

