"use client";

// Brand visibility: profiles the site links to + live Google results for "<brand>" site:<platform>
// on eight platforms, searched from our server (/api/discovery/mentions), so there is no Google widget or CAPTCHA.
import { useCallback, useEffect, useState } from "react";

export type Profile = { platform: string; url: string };
export type Identity = { name: string; domain: string; sourceUrl: string; profiles: Profile[] };

type Mention = { title: string; url: string; snippet: string; source: string };
type PlatformResult = { platform: string; results: Mention[]; error?: boolean };
type State = { status: "loading" } | { status: "off" } | { status: "error"; message: string } | { status: "done"; by: Record<string, PlatformResult> };

export const PLATFORMS = [
  { name: "YouTube", domain: "youtube.com", sym: "▶" },
  { name: "Instagram", domain: "instagram.com", sym: "◎" },
  { name: "Facebook", domain: "facebook.com", sym: "f" },
  { name: "LinkedIn", domain: "linkedin.com", sym: "in" },
  { name: "X", domain: "x.com", sym: "𝕏" },
  { name: "Reddit", domain: "reddit.com", sym: "r/" },
  { name: "Quora", domain: "quora.com", sym: "Q" },
  { name: "Threads", domain: "threads.net", sym: "@" },
] as const;

const siteFilter = (p: (typeof PLATFORMS)[number]) => (p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`);

export function linkedPlatforms(identity: Identity) {
  const linked = new Map<string, Profile>();
  identity.profiles.forEach((p) => {
    if (!linked.has(p.platform)) linked.set(p.platform, p);
  });
  return linked;
}

export default function BrandVisibility({ identity }: { identity: Identity; engineId?: string }) {
  const [brand, setBrand] = useState(identity.name);
  const [state, setState] = useState<State>({ status: "loading" });
  const [view, setView] = useState("all");
  const linked = linkedPlatforms(identity);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) return;
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/discovery/mentions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: term.trim() }) });
      const body = await res.json().catch(() => ({}));
      if (body.configured === false) return setState({ status: "off" });
      if (!res.ok || !Array.isArray(body.platforms)) throw new Error(body.error || "The search didn't finish. Please try again.");
      const by: Record<string, PlatformResult> = {};
      (body.platforms as PlatformResult[]).forEach((p) => (by[p.platform] = p));
      setState({ status: "done", by });
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "The search didn't finish." });
    }
  }, []);

  useEffect(() => {
    search(identity.name);
  }, [identity.name, search]);

  const googleUrl = (p: (typeof PLATFORMS)[number]) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${brand.trim().replaceAll('"', "").slice(0, 100)}" ${siteFilter(p)}`)}`;

  return (
    <div className="bv">
      <div className="sd-card bv-name">
        <div>
          <span className="sd-label">Brand name we searched</span>
          <p>Found on your website. If people know you by another name, change it and search again.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(brand);
          }}
        >
          <label htmlFor={`bv-brand`} className="sr-only">Brand name</label>
          <input id={`bv-brand`} value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={100} />
          <button className="sd-btn" type="submit" disabled={!brand.trim() || state.status === "loading"}>{state.status === "loading" ? "Searching…" : "Search again"}</button>
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

      {state.status === "error" && <p className="sd-alert" role="alert">{state.message}</p>}
      {state.status === "off" && <p className="sd-alert" role="status">Live search isn&apos;t switched on for this site yet. Use the links on each card to see the results on Google.</p>}

      <div className="sd-tabs" role="tablist" aria-label="Choose a platform">
        <button type="button" role="tab" aria-selected={view === "all"} className={view === "all" ? "is-on" : ""} onClick={() => setView("all")}>All platforms</button>
        {PLATFORMS.map((p) => (
          <button key={p.name} type="button" role="tab" aria-selected={view === p.name} className={view === p.name ? "is-on" : ""} onClick={() => setView(p.name)}>{p.name}</button>
        ))}
      </div>
      <div className={`bv-grid ${view === "all" ? "" : "is-single"}`}>
        {PLATFORMS.map((p) => (
          <section key={p.name} className="sd-card bv-card" hidden={view !== "all" && view !== p.name}>
            <button type="button" className="bv-card-head" onClick={() => setView(p.name)} aria-label={`Show only ${p.name} results`}>
              <span className="sym" aria-hidden="true">{p.sym}</span>{p.name}
              <span className={`tag ${linked.has(p.name) ? "yes" : ""}`}>{linked.has(p.name) ? "Linked on your site" : "Google results"}</span>
            </button>
            <Hits state={state} platform={p.name} />
            <a className="bv-open" href={googleUrl(p)} target="_blank" rel="noopener noreferrer">Open this search on Google <span aria-hidden="true">↗</span></a>
          </section>
        ))}
      </div>
      <p className="sd-foot-note">Results come from public pages Google has indexed. A result can mention your brand without being your official account. Open each one to check it.</p>
    </div>
  );
}

function Hits({ state, platform }: { state: State; platform: string }) {
  if (state.status === "loading") return <div className="dx-results">{[0, 1, 2].map((k) => <div key={k} className="dx-skel"><i /><i /><i /></div>)}</div>;
  if (state.status !== "done") return null;
  const r = state.by[platform];
  if (!r || r.error) return <p className="bv-stalled">This platform didn&apos;t respond. Try <b>Search again</b> in a minute, or open this search on Google.</p>;
  if (!r.results.length) return <p className="dx-empty">No results found for this brand name here.</p>;
  return (
    <ol className="dx-results">
      {r.results.map((m) => (
        <li key={m.url} className="dx-hit">
          <a href={m.url} target="_blank" rel="noopener noreferrer nofollow">{m.title || m.url}</a>
          <span>{m.source}</span>
          {m.snippet && <p>{m.snippet}</p>}
        </li>
      ))}
    </ol>
  );
}
