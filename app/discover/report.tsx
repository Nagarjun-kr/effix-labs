"use client";

// Brand visibility report: presence summary, platform status, to-do list and labelled results per platform.
// The decisions (status, to-do list) live in lib/discover/classify.ts so they can be tested.
import { useMemo, useState } from "react";

import {
  buildActions,
  buildRows,
  isProfile,
  PLATFORMS,
  shortUrl,
  type Identity,
  type Mentions,
  type ProfileCheck,
  type Status,
} from "@/lib/discover/classify";

export { PLATFORMS };
export type { Identity, Mentions, PlatformResult, Profile } from "@/lib/discover/classify";

const STATUS: Record<Status, { label: string; tone: string }> = {
  official: { label: "Official", tone: "official" },
  likely: { label: "Likely yours", tone: "likely" },
  possible: { label: "Possible match", tone: "possible" },
  mentions: { label: "Mentions only", tone: "mentions" },
  none: { label: "Not found", tone: "none" },
  unknown: { label: "Not searched", tone: "unknown" },
};

function googleUrl(brand: string, p: (typeof PLATFORMS)[number]) {
  const site = p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`"${brand.replaceAll('"', "").slice(0, 100)}" ${site}`)}`;
}

export default function Report({ identity, mentions, brand, checks = {} }: { identity: Identity; mentions: Mentions; brand: string; checks?: Record<string, ProfileCheck> }) {
  const [view, setView] = useState("all");
  const rows = useMemo(() => buildRows(identity, mentions, brand, checks), [identity, mentions, brand, checks]);
  const actions = useMemo(() => (mentions.status === "done" ? buildActions(rows, brand) : []), [rows, mentions.status, brand]);
  const found = rows.filter((r) => r.status === "official" || r.status === "likely").length;
  const linkedCount = rows.filter((r) => r.linked).length;
  const possibleCount = rows.filter((r) => r.status === "likely" || r.status === "possible").length + rows.reduce((n, r) => n + r.extras.length, 0);
  const totalResults = rows.reduce((n, r) => n + (r.result?.results.length ?? 0), 0);
  const loading = mentions.status === "loading";
  const searched = mentions.status === "done";

  const openPlatform = (name: string) => {
    setView(name);
    document.getElementById("dx-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* SUMMARY */}
      <section className="rp-summary" aria-label="Presence summary">
        <div className="rp-score">
          <span className="dx-label">Brand presence</span>
          <strong>
            {loading ? "…" : found}
            <small> of 9</small>
          </strong>
          <p>{loading ? "Searching nine platforms…" : searched ? "platforms where we found your profile" : "platforms linked from your website"}</p>
          <div className="rp-cells" aria-hidden="true">
            {rows.map((r) => <i key={r.name} className={`s-${loading && !r.linked ? "loading" : STATUS[r.status].tone}`} title={`${r.name}: ${STATUS[r.status].label}`} />)}
          </div>
          <ul className="rp-legend">
            <li><i className="s-official" />Official</li>
            <li><i className="s-likely" />Likely yours</li>
            <li><i className="s-possible" />Possible match</li>
            <li><i className="s-mentions" />Mentions only</li>
            <li><i className="s-none" />Not found</li>
          </ul>
        </div>
        <div className="rp-stats">
          <div><span className="dx-label">Linked from your website</span><strong>{linkedCount}</strong><small>Profiles your site links to</small></div>
          <div><span className="dx-label">Unlinked profiles to check</span><strong>{searched ? possibleCount : "–"}</strong><small>Use your name, not linked from your site</small></div>
          <div><span className="dx-label">Search results</span><strong>{searched ? totalResults : "–"}</strong><small>Across all nine platforms</small></div>
        </div>
      </section>

      {/* PLATFORM STATUS */}
      <section className="rp-block" aria-labelledby="rp-status-t">
        <div className="rp-head"><h2 id="rp-status-t">Platform by platform</h2><p>Click a platform to see its results.</p></div>
        <div className="rp-platforms">
          {rows.map((r) => {
            const st = loading && !r.linked ? null : STATUS[r.status];
            const detail = r.linked
              ? shortUrl(r.linked.url)
              : loading
                ? "Searching…"
                : r.bestProfile
                  ? shortUrl(r.bestProfile.m.url)
                  : r.tagged
                    ? r.tagged.length ? `${r.tagged.length} result${r.tagged.length === 1 ? "" : "s"}` : "No results"
                    : "Open on Google";
            return (
              <button key={r.name} type="button" className="rp-plat" onClick={() => openPlatform(r.name)}>
                <span className="sym" aria-hidden="true">{r.sym}</span>
                <span className="rp-plat-name">{r.name}<small>{detail}</small></span>
                {st ? <em className={`rp-badge s-${st.tone}`}>{st.label}</em> : <em className="rp-badge s-loading">…</em>}
              </button>
            );
          })}
        </div>
      </section>

      {/* TO-DO */}
      {searched && actions.length > 0 && (
        <section className="rp-block" aria-labelledby="rp-todo-t">
          <div className="rp-head"><h2 id="rp-todo-t">What to do next</h2><p>Worked out from the results above, most important first.</p></div>
          <ol className="rp-todo">
            {actions.map((a) => (
              <li key={a.title} className={`lv-${a.level}`}>
                <em>{a.level === "high" ? "Do first" : a.level === "medium" ? "Check" : "Optional"}</em>
                <div><strong>{a.title}</strong><p>{a.detail}</p></div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* DETAILS */}
      <section id="dx-details" className="rp-block" aria-labelledby="rp-details-t">
        <div className="rp-head"><h2 id="rp-details-t">Search results</h2><p>Live results for “{brand}” on each platform. Profiles are listed first; some results are posts by other people.</p></div>
        {mentions.status === "error" && <p className="dx-error" role="alert">{mentions.message}</p>}
        {mentions.status === "off" && <p className="dx-error dx-warn" role="status">Live search isn&apos;t switched on for this site yet. Use the links on each card to see the results on Google.</p>}
        <div className="dx-tabs" role="tablist" aria-label="Choose a platform">
          <button type="button" role="tab" aria-selected={view === "all"} className={`dx-tab ${view === "all" ? "is-on" : ""}`} onClick={() => setView("all")}>All platforms</button>
          {rows.map((r) => (
            <button key={r.name} type="button" role="tab" aria-selected={view === r.name} className={`dx-tab ${view === r.name ? "is-on" : ""}`} onClick={() => setView(r.name)}>{r.name}</button>
          ))}
        </div>
        <div className={`dx-grid ${view === "all" ? "" : "is-single"}`}>
          {rows.map((r) => {
            const st = STATUS[r.status];
            return (
              <section key={r.name} className="dx-card" hidden={view !== "all" && view !== r.name}>
                <button type="button" className="dx-card-head" onClick={() => setView(r.name)} aria-label={`Show only ${r.name} results`}>
                  <span className="sym" aria-hidden="true">{r.sym}</span>{r.name}
                  {!(loading && !r.linked) && <em className={`rp-badge s-${st.tone}`}>{st.label}</em>}
                </button>
                {r.linked && (
                  <a className="rp-linked" href={r.linked.url} target="_blank" rel="noopener noreferrer">
                    <i aria-hidden="true">✓</i> Linked from your website: <b>{shortUrl(r.linked.url)}</b>
                  </a>
                )}
                {loading ? (
                  <div className="dx-results" aria-busy="true">{[0, 1, 2].map((k) => <div key={k} className="dx-skel"><i /><i /><i /></div>)}</div>
                ) : r.tagged ? (
                  r.tagged.length ? (
                    <ol className="dx-results">
                      {r.tagged.map(({ m, t }) => (
                        <li key={m.url} className={`dx-hit ${t.official ? "is-official" : ""}`}>
                          <div className="rp-tags">
                            <em className={`rp-kind k-${t.kind}`}>{t.label}</em>
                            {t.official && <em className="rp-kind k-official">{t.sameChannel ? "Same channel your site links to" : "Your linked profile"}</em>}
                            {t.checked === "yours" && !t.official && <em className="rp-kind k-match">Checked: links to your website</em>}
                            {t.checked === "other" && <em className="rp-kind k-other">Checked: links to {shortUrl(t.otherSite ?? "")}</em>}
                            {!t.checked && (r.extras.some((x) => x.m.url === m.url) ? <em className="rp-kind k-name">Another account with your name</em> : !t.official && t.matchesBrand && isProfile(t) && (t.mentionsSite && t.kind === "profile" ? <em className="rp-kind k-match">Mentions your website</em> : t.sameHandle ? <em className="rp-kind k-match">Same handle as your profiles</em> : <em className="rp-kind k-name">Same name</em>))}
                          </div>
                          <a href={m.url} target="_blank" rel="noopener noreferrer nofollow">{m.title || m.url}</a>
                          <span>{shortUrl(m.url)}</span>
                          {m.snippet && <p>{m.snippet}</p>}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="dx-empty">No results for “{brand}” on {r.name}. If people know you by another name, change it above and search again.</p>
                  )
                ) : mentions.status === "done" ? (
                  <p className="dx-stalled">This platform didn&apos;t respond. Try <b>Search again</b> in a minute.</p>
                ) : null}
                <a className="dx-open" href={googleUrl(brand, PLATFORMS.find((p) => p.name === r.name)!)} target="_blank" rel="noopener noreferrer">Open this search on Google <span aria-hidden="true">↗</span></a>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
