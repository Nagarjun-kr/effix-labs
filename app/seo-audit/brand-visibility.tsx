"use client";

// Brand visibility: profiles the site links to + live Google results for "<brand>" site:<platform>
// on nine platforms, via Google's Programmable Search Element (window.__gcse is set in page.tsx).
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export type Profile = { platform: string; url: string };
export type Identity = { name: string; domain: string; sourceUrl: string; profiles: Profile[] };

type CseElement = { execute: (query: string) => void };
type CseApi = { render: (o: { div: string; tag: string; gname: string }) => void; getElement: (name: string) => CseElement | null };
declare global {
  interface Window {
    __gcse?: { parsetags: string };
    google?: { search?: { cse?: { element?: CseApi } } };
  }
}

export const PLATFORMS = [
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

const siteFilter = (p: (typeof PLATFORMS)[number]) => (p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`);

let runCounter = 0;

export function linkedPlatforms(identity: Identity) {
  const linked = new Map<string, Profile>();
  identity.profiles.forEach((p) => {
    if (!linked.has(p.platform)) linked.set(p.platform, p);
  });
  return linked;
}

export default function BrandVisibility({ identity, engineId }: { identity: Identity; engineId: string }) {
  const [runId] = useState(() => ++runCounter); // unique Google element names per audit
  const [brand, setBrand] = useState(identity.name);
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(() => typeof window !== "undefined" && Boolean(window.google?.search?.cse?.element));
  const [scriptError, setScriptError] = useState(false);
  const [view, setView] = useState("all");
  const [stalled, setStalled] = useState<Record<string, boolean>>({});
  const rendered = useRef(false);
  const linked = linkedPlatforms(identity);

  useEffect(() => {
    if (!ready || !engineId || !brand.trim()) return;
    const api = window.google?.search?.cse?.element;
    if (!api) return;
    const term = brand.trim().replaceAll('"', "").slice(0, 100);
    const timer = window.setTimeout(() => {
      PLATFORMS.forEach((p, i) => {
        const gname = `bv_${runId}_${i}`;
        if (!rendered.current) api.render({ div: `bv-results-${runId}-${i}`, tag: "searchresults-only", gname });
        api.getElement(gname)?.execute(`"${term}" ${siteFilter(p)}`);
      });
      rendered.current = true;
    }, 0);
    // If Google hasn't filled a card after 12s (busy, blocked or offline), say so instead of leaving it blank.
    setStalled({});
    const check = window.setTimeout(() => {
      const next: Record<string, boolean> = {};
      PLATFORMS.forEach((p, i) => {
        const el = document.getElementById(`bv-results-${runId}-${i}`);
        const filled = !!el && (el.querySelector(".gsc-webResult.gsc-result, .gs-no-results-result") !== null || /did not match|no results/i.test(el.innerText));
        if (!filled) next[p.name] = true;
      });
      setStalled(next);
    }, 12000);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(check);
    };
    // brand is read at search time; searches re-run when Google is ready or on "Search again"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, engineId, runId, tick]);

  const googleUrl = (p: (typeof PLATFORMS)[number]) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${brand.trim().replaceAll('"', "").slice(0, 100)}" ${siteFilter(p)}`)}`;

  return (
    <div className="bv">
      {engineId && (
        <Script
          src={`https://cse.google.com/cse.js?cx=${encodeURIComponent(engineId)}`}
          strategy="afterInteractive"
          onReady={() => setReady(true)}
          onError={() => setScriptError(true)}
        />
      )}

      <div className="sd-card bv-name">
        <div>
          <span className="sd-label">Brand name we searched</span>
          <p>Found on your website. If people know you by another name, change it and search again.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTick((n) => n + 1);
          }}
        >
          <label htmlFor={`bv-brand-${runId}`} className="sr-only">Brand name</label>
          <input id={`bv-brand-${runId}`} value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={100} />
          <button className="sd-btn" type="submit" disabled={!brand.trim()}>Search again</button>
        </form>
      </div>

      <div className="sd-card">
        <div className="sd-card-head">
          <h3>Profiles linked from your website</h3>
          <span className="sd-pill">{PLATFORMS.filter((p) => linked.has(p.name)).length} / {PLATFORMS.length} linked</span>
        </div>
        <div className="bv-chips">
          {PLATFORMS.map((p) => {
            const hit = linked.get(p.name);
            return hit ? (
              <a key={p.name} className="bv-chip yes" href={hit.url} target="_blank" rel="noopener noreferrer"><i aria-hidden="true">✓</i>{p.name}</a>
            ) : (
              <span key={p.name} className="bv-chip"><i aria-hidden="true" />{p.name}<small>Not linked</small></span>
            );
          })}
        </div>
      </div>

      {scriptError && <p className="sd-alert" role="alert">Google&apos;s search couldn&apos;t load. Please try again in a moment.</p>}
      {!engineId && <p className="sd-alert" role="status">Google search isn&apos;t configured for this site yet.</p>}

      <div className="sd-tabs" role="tablist" aria-label="Choose a platform">
        <button type="button" role="tab" aria-selected={view === "all"} className={view === "all" ? "is-on" : ""} onClick={() => setView("all")}>All platforms</button>
        {PLATFORMS.map((p) => (
          <button key={p.name} type="button" role="tab" aria-selected={view === p.name} className={view === p.name ? "is-on" : ""} onClick={() => setView(p.name)}>{p.name}</button>
        ))}
      </div>
      <div className={`bv-grid ${view === "all" ? "" : "is-single"}`}>
        {PLATFORMS.map((p, i) => (
          <section key={p.name} className="sd-card bv-card" hidden={view !== "all" && view !== p.name}>
            <button type="button" className="bv-card-head" onClick={() => setView(p.name)} aria-label={`Show only ${p.name} results`}>
              <span className="sym" aria-hidden="true">{p.sym}</span>{p.name}
              <span className={`tag ${linked.has(p.name) ? "yes" : ""}`}>{linked.has(p.name) ? "Linked on your site" : "Google results"}</span>
            </button>
            <div id={`bv-results-${runId}-${i}`} className="dx-results" />
            {stalled[p.name] && (
              <p className="bv-stalled">Google hasn&apos;t returned results for this platform right now. Try <b>Search again</b> in a minute, or open this search on Google.</p>
            )}
            <a className="bv-open" href={googleUrl(p)} target="_blank" rel="noopener noreferrer">Open this search on Google <span aria-hidden="true">↗</span></a>
          </section>
        ))}
      </div>
      <p className="sd-foot-note">Results come from public pages Google has indexed. A result can mention your brand without being your official account. Open each one to check it.</p>
    </div>
  );
}
