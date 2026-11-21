"use client";

// Effix Discover results page. The only search box is on the homepage (#audit); it opens /discover?url=…
// Flow: full-screen scan (website read -> Google workflow, live progress) -> "report ready" -> dashboard.
// No Google widget in the browser, so no CAPTCHA. Nothing is stored and no login is needed.
import { useCallback, useEffect, useRef, useState } from "react";

import { checkTargets, type Overview, type ProfileCheck } from "@/lib/discover/classify";
import { displayHost, parseWebsite } from "@/lib/discover/input";
import Report, { Logo as PlatformLogo, type Identity, type Mentions, type PlatformResult } from "./report";
import Scan, { type ScanStage, type SearchProgress } from "./scan";

type Phase = "start" | "scan" | "done";

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

  const searchMentions = useCallback(async (brand: string, domain: string): Promise<void> => {
    const term = brand.trim();
    if (!term) return;
    setMentions({ status: "loading" });
    setChecks({});
    setSearched(term);
    setProgress({ overview: "wait", platforms: {} });
    const fail = "The search didn't finish. Please try again.";
    try {
      const res = await fetch("/api/discovery/mentions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
        body: JSON.stringify({ brand: term, domain }),
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
    try {
      const res = await fetch("/api/discovery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: parsed.entered }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.identity) throw new Error(body.error || "We couldn't open that website. Check the address and try again.");
      const id = body.identity as Identity;
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

  if (phase === "start") return <div className="sc" aria-busy="true"><div className="sc-bg" aria-hidden="true" /></div>;
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

            <section className="cta2" aria-labelledby="cta2-t">
              <div className="cta2-glow" aria-hidden="true" />
              <div className="cta2-copy">
                <span className="cta2-kicker"><i aria-hidden="true" /> Next step</span>
                <h2 id="cta2-t">Want to show up <em>in more places?</em></h2>
                <p>Effix Labs helps businesses get found on Google, in online communities and in AI search, with honest reporting and no fake reviews or accounts.</p>
                <div className="cta2-actions">
                  <a className="cta2-primary" href="mailto:hello@effix.co.in?subject=Visibility%20audit%20for%20my%20brand">
                    Email hello@effix.co.in <span aria-hidden="true">→</span>
                  </a>
                  <span className="cta2-reply"><i aria-hidden="true" /> We reply within one business day</span>
                </div>
              </div>
              <div className="cta2-grid">
                {[
                  { href: "/services/google-business-profile", title: "Google Business Profile", text: "Show up on Maps and local search", icon: "Google" },
                  { href: "/services/reddit-marketing", title: "Reddit Marketing", text: "Be part of the conversations people trust", icon: "Reddit" },
                  { href: "/services/seo-aeo-services", title: "SEO & AEO", text: "Rank on Google and in AI answers", icon: "seo" },
                  { href: "/services/content-writing", title: "Content Writing", text: "Pages and posts that answer real questions", icon: "pen" },
                ].map((c) => (
                  <a key={c.href} className="cta2-card" href={c.href}>
                    <span className="cta2-ic">
                      {c.icon === "seo" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
                      ) : c.icon === "pen" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                      ) : (
                        <PlatformLogo name={c.icon} size={20} />
                      )}
                    </span>
                    <strong>{c.title}</strong>
                    <small>{c.text}</small>
                    <span className="cta2-arrow" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
      )}

      <footer className="dx-footer">© 2026 Effix Labs · Search results come from Google and are not verified by Effix Labs.</footer>
    </div>
  );
}

