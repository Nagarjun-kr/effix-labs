"use client";

// Brand visibility report: presence summary, platform status, to-do list and labelled results per platform.
import { useMemo, useState } from "react";

import { isProfile, platformStatus, tagResult, type ResultTag, type Status } from "@/lib/discover/classify";

export type Profile = { platform: string; url: string };
export type Identity = { name: string; domain: string; sourceUrl: string; profiles: Profile[] };
export type Mention = { title: string; url: string; snippet: string; source: string };
export type PlatformResult = { platform: string; query: string; results: Mention[]; error?: boolean };
export type Mentions =
  | { status: "loading" }
  | { status: "off" }
  | { status: "error"; message: string }
  | { status: "done"; brand: string; byPlatform: Record<string, PlatformResult> };

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

const STATUS: Record<Status, { label: string; tone: string }> = {
  official: { label: "Official", tone: "official" },
  likely: { label: "Likely yours", tone: "likely" },
  possible: { label: "Possible match", tone: "possible" },
  mentions: { label: "Mentions only", tone: "mentions" },
  none: { label: "Not found", tone: "none" },
  unknown: { label: "Not searched", tone: "unknown" },
};

type Row = {
  name: string;
  domain: string;
  sym: string;
  linked: Profile | null;
  result: PlatformResult | null; // null = not searched / failed
  tagged: { m: Mention; t: ResultTag }[] | null;
  status: Status;
  bestProfile: { m: Mention; t: ResultTag } | null;
};

const shortUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function googleUrl(brand: string, p: (typeof PLATFORMS)[number]) {
  const site = p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`"${brand.replaceAll('"', "").slice(0, 100)}" ${site}`)}`;
}

/** Order: linked profile, then confirmed profile, then name-matching profile, then other profiles, then content. */
const score = (t: ResultTag) => (t.official ? 8 : 0) + (isProfile(t) && t.matchesBrand ? (t.mentionsSite ? 4 : 2) : 0) + (isProfile(t) ? 1 : 0);

function buildRows(identity: Identity, mentions: Mentions, brand: string): Row[] {
  const linked = new Map<string, Profile>();
  identity.profiles.forEach((p) => !linked.has(p.platform) && linked.set(p.platform, p));
  return PLATFORMS.map((p) => {
    const link = linked.get(p.name) ?? null;
    const result = mentions.status === "done" ? mentions.byPlatform[p.name] ?? null : null;
    const ok = result && !result.error ? result : null;
    const tagged = ok
      ? ok.results
          .map((m) => ({ m, t: tagResult(p.name, m.url, brand, link?.url ?? null, `${m.title} ${m.snippet}`, identity.domain) }))
          .sort((a, b) => score(b.t) - score(a.t))
      : null;
    const bestProfile = tagged?.find((x) => x.t.official) ?? tagged?.find((x) => isProfile(x.t) && x.t.matchesBrand && x.t.mentionsSite) ?? tagged?.find((x) => isProfile(x.t) && x.t.matchesBrand) ?? null;
    return { ...p, linked: link, result: ok, tagged, status: platformStatus(Boolean(link), tagged ? tagged.map((x) => x.t) : null), bestProfile };
  });
}

type Action = { level: "high" | "medium" | "low"; title: string; detail: string };

function buildActions(rows: Row[], brand: string): Action[] {
  const out: Action[] = [];
  const none: string[] = [];
  for (const r of rows) {
    if (r.status === "likely" && r.bestProfile) {
      out.push({ level: "high", title: `Link your ${r.name} profile on your website`, detail: `${shortUrl(r.bestProfile.m.url)} mentions your website, but your website doesn't link back to it. Add it to your footer or contact page so Google and visitors can connect the two.` });
    }
    if (r.status === "possible" && r.bestProfile) {
      out.push({ level: "medium", title: `Is ${shortUrl(r.bestProfile.m.url)} yours?`, detail: `This ${r.name} profile uses the name “${brand}”, but nothing on it points to your website. If it's yours, link it from your site and add your website to its bio. If it isn't, another business uses your name on ${r.name}, which can confuse customers.` });
    }
    if (r.linked && r.tagged && !r.tagged.some((x) => x.t.official || (isProfile(x.t) && x.t.matchesBrand && x.t.mentionsSite))) {
      out.push({ level: "medium", title: `Google doesn't show your linked ${r.name} profile`, detail: `Your site links to ${shortUrl(r.linked.url)}, but it wasn't in the top results for “${brand}” on ${r.name}. Make sure the profile name and bio include “${brand}” and a link back to your website.` });
    }
    if (r.status === "mentions") {
      out.push({ level: "low", title: `People mention you on ${r.name}, but no profile was found`, detail: `There are results for “${brand}” on ${r.name}, but none is a profile with your name. If you have an account, put “${brand}” in its name or handle so these searches lead to you.` });
    }
    if (r.status === "none") none.push(r.name);
  }
  if (none.length) {
    out.push({ level: "low", title: `Nothing found on ${none.join(", ")}`, detail: `No results for “${brand}” on ${none.length === 1 ? "this platform" : "these platforms"}. If you use ${none.length === 1 ? "it" : "them"}, make sure the profile name includes your brand. If not, focus on the platforms your customers use.` });
  }
  const order = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => order[a.level] - order[b.level]);
}

export default function Report({ identity, mentions, brand }: { identity: Identity; mentions: Mentions; brand: string }) {
  const [view, setView] = useState("all");
  const rows = useMemo(() => buildRows(identity, mentions, brand), [identity, mentions, brand]);
  const actions = useMemo(() => (mentions.status === "done" ? buildActions(rows, brand) : []), [rows, mentions.status, brand]);
  const found = rows.filter((r) => r.status === "official" || r.status === "likely").length;
  const linkedCount = rows.filter((r) => r.linked).length;
  const possibleCount = rows.filter((r) => r.status === "likely" || r.status === "possible").length;
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
          <div><span className="dx-label">Unlinked profiles to check</span><strong>{searched ? possibleCount : "–"}</strong><small>Your name, not linked from your site</small></div>
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
                            {t.official && <em className="rp-kind k-official">Your linked profile</em>}
                            {!t.official && t.matchesBrand && isProfile(t) && (t.mentionsSite ? <em className="rp-kind k-match">Mentions your website</em> : <em className="rp-kind k-name">Same name</em>)}
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
