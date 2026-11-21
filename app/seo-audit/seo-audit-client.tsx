"use client";

// Effix SEO audit (/seo-audit) — not linked from the site yet; the homepage box uses /discover (brand search).
// Website URL -> /api/seo-audit (homepage, robots.txt, sitemap, sample pages, brand + social links)
// -> dashboard; Google PageSpeed (speed) and Google Programmable Search (brand on 8 platforms) load inside it.
// Nothing is stored and no login is needed.
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import type { AuditReport } from "@/lib/seo-audit/types";
import { PLATFORMS } from "./brand-visibility";
import Dashboard from "./dashboard";

type Phase = "idle" | "loading" | "done";

const STEPS = [
  "Reading your homepage",
  "Checking robots.txt, sitemap and redirects",
  "Sampling pages from your site",
  "Running SEO and AI-visibility checks",
  "Building your action plan",
];

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const cleanUrl = (v: string) => v.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

export default function SeoAuditClient() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [website, setWebsite] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const busy = useRef(false);

  const run = useCallback(async (raw: string) => {
    const value = cleanUrl(raw);
    if (!value || busy.current) return;
    busy.current = true;
    setWebsite(value);
    setError(null);
    setPhase("loading");
    setStep(0);
    window.scrollTo({ top: 0 });
    const timer = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    try {
      const res = await fetch("/api/seo-audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: value }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.report) throw new Error(body.error || "We couldn't open that website. Check the address and try again.");
      setStep(STEPS.length);
      await new Promise((r) => window.setTimeout(r, 350));
      const next = body.report as AuditReport;
      setReport(next);
      setRunKey((k) => k + 1);
      setPhase("done");
      try { window.history.replaceState(null, "", `/seo-audit?url=${encodeURIComponent(next.host)}`); } catch { /* ignore */ }
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPhase((p) => (p === "loading" ? (report ? "done" : "idle") : p));
    } finally {
      window.clearInterval(timer);
      busy.current = false;
    }
  }, [report]);

  // Arrived from the homepage audit form (?url=… or the saved session value): start straight away.
  useEffect(() => {
    let incoming: string | null = null;
    try { incoming = new URLSearchParams(window.location.search).get("url"); } catch { /* ignore */ }
    if (incoming) run(incoming);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    run(website);
  }

  if (phase === "done" && report) {
    return (
      <div className="dx">
        {error && <p className="sd-toast" role="alert">{error} <button type="button" onClick={() => setError(null)} aria-label="Dismiss">×</button></p>}
        <Dashboard key={runKey} report={report} onNewAudit={run} busy={false} />
      </div>
    );
  }

  return (
    <div className="dx">
      <header className="dx-header">
        <div className="dx-wrap">
          <a className="dx-logo" href="/" aria-label="Effix Labs home"><Logo /><span>Effix Labs</span><em>SEO audit</em></a>
          <a className="dx-back" href="/"><span aria-hidden="true">←</span> Back to home</a>
        </div>
      </header>

      {phase === "idle" && (
        <main>
          <section className="dx-hero">
            <div className="dx-wrap">
              <span className="dx-kicker">Effix Labs · Free SEO audit</span>
              <h1 className="dx-h1">See how your site <em>shows up.</em></h1>
              <p className="dx-sub">Enter your website. We check its SEO, AI-search readiness and speed, then find your brand on eight platforms through Google. You get a full dashboard and an action plan.</p>
              <form className="dx-form" onSubmit={submit}>
                <label htmlFor="dx-url" className="sr-only">Your website URL</label>
                <input id="dx-url" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourbusiness.com" autoComplete="url" inputMode="url" required />
                <button className="dx-btn" type="submit">Run SEO Audit <span aria-hidden="true">→</span></button>
              </form>
              {error && <p className="dx-error" role="alert">{error}</p>}
              <p className="dx-note"><span>Free</span><span>No login</span><span>Nothing saved</span></p>
            </div>
          </section>

          <section className="dx-how" aria-labelledby="dx-how-title">
            <div className="dx-wrap">
              <h2 id="dx-how-title" className="sr-only">What the audit checks</h2>
              <ol className="dx-steps dx-steps-4">
                <li className="dx-step"><b>01</b><h2>Technical SEO</h2><p>HTTPS, indexing, robots.txt, sitemap, canonical tags, redirects and broken pages.</p></li>
                <li className="dx-step"><b>02</b><h2>Content</h2><p>Titles, meta descriptions, headings, text depth, image alt text, duplicates and internal links.</p></li>
                <li className="dx-step"><b>03</b><h2>AI visibility and speed</h2><p>Schema, FAQs, AI crawler access, plus a real Google Lighthouse speed test.</p></li>
                <li className="dx-step"><b>04</b><h2>Brand on 8 platforms</h2><p>Live Google results for your brand on the platforms below, and which ones your site links to.</p></li>
              </ol>
              <div className="dx-platforms" aria-label="Platforms searched">{PLATFORMS.map((p) => <span key={p.name}>{p.name}</span>)}</div>
              <p className="dx-limits">We check your homepage and a sample of up to eight other pages. It&apos;s an automated audit of public pages, not a full crawl. Brand results only include pages Google has indexed.</p>
            </div>
          </section>
        </main>
      )}

      {phase === "loading" && (
        <main className="dx-loading" aria-live="polite">
          <div className="dx-wrap">
            <span className="dx-kicker">Running your SEO audit</span>
            <h1>{website || "Your website"}</h1>
            <ol className="dx-progress">
              {STEPS.map((s, i) => <li key={s} className={i < step ? "is-done" : i === step ? "is-active" : ""}><i aria-hidden="true" />{s}</li>)}
            </ol>
          </div>
        </main>
      )}

      <footer className="dx-footer">© 2026 Effix Labs · Automated checks of public pages. Nothing you enter is saved.</footer>
    </div>
  );
}
