"use client";

// Brand visibility report: presence summary, platform status, to-do list and labelled results per platform.
// The decisions (status, to-do list) live in lib/discover/classify.ts so they can be tested.
import { useMemo, useState, type ReactNode } from "react";

import { BRAND_ICONS } from "@/lib/discover/brand-icons";

import {
  buildActions,
  buildRows,
  isProfile,
  PLATFORMS,
  presenceOf,
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

/** Real platform logo (Font Awesome brands, CC BY 4.0) in its brand colour. */
export function Logo({ name, size = 18 }: { name: string; size?: number }) {
  const i = BRAND_ICONS[name];
  if (!i) return null;
  return (
    <svg className="vz-logo" width={size} height={size} viewBox={`0 0 ${i.w} ${i.h}`} aria-hidden="true">
      <path d={i.d} fill={i.color} />
    </svg>
  );
}

/** Glossy 3D bubble in the platform's colours with a white logo, like the Reddit service page badge. */
const ORB: Record<string, [string, string, string]> = {
  YouTube: ["#ff8a80", "#ff2d2d", "#b80000"],
  Instagram: ["#ffd27a", "#f04e7c", "#7b3fd3"],
  Facebook: ["#8fb8ff", "#1a6dff", "#0a43b8"],
  LinkedIn: ["#7fbcf0", "#1677d2", "#0a4f94"],
  X: ["#6b6b6b", "#262626", "#000000"],
  Reddit: ["#ff9a6e", "#ff5a1f", "#c23a08"],
  Quora: ["#f07f73", "#c9302c", "#8a1712"],
  Threads: ["#6b6b6b", "#2b2b2b", "#000000"],
};
export function Orb({ name, size = 56, float = true }: { name: string; size?: number; float?: boolean }) {
  const i = BRAND_ICONS[name];
  const c = ORB[name] ?? ["#ddd", "#999", "#555"];
  return (
    <span className={`orb ${float ? "is-float" : ""}`} style={{ width: size, height: size, ["--o1" as string]: c[0], ["--o2" as string]: c[1], ["--o3" as string]: c[2] }} aria-hidden="true">
      {i && (
        <svg width={Math.round(size * 0.48)} height={Math.round(size * 0.48)} viewBox={`0 0 ${i.w} ${i.h}`}>
          <path d={i.d} fill="#fff" />
        </svg>
      )}
    </span>
  );
}

const ICON: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  doc: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></>,
  chev: <path d="m9 6 6 6-6 6" />,
};
const Ico = ({ n, size = 20 }: { n: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON[n]}</svg>
);

const KIND_ORDER: [string, string][] = [["profile", "Profiles"], ["community", "Communities"], ["post", "Posts"], ["video", "Videos"], ["thread", "Discussions"], ["article", "Articles"], ["page", "Other pages"]];
const DONUT: Status[] = ["official", "likely", "possible", "mentions", "none"];

/** A few words: why this platform got its status. */
function reasonFor(r: { status: Status; linked: { url: string } | null; bestProfile: { t: { besideSite?: boolean; mentionsSite?: boolean; sameHandle?: boolean; checked?: string; sameChannel?: boolean } } | null; extras: unknown[]; result: unknown }) {
  const t = r.bestProfile?.t;
  switch (r.status) {
    case "official":
      return r.extras.length ? "Linked on your site · another account uses your name" : t?.sameChannel ? "Linked on your site · channel confirmed" : "Linked on your website";
    case "likely":
      if (t?.checked === "yours") return "Profile links to your website";
      if (t?.besideSite) return "Shown beside your site on Google";
      if (t?.mentionsSite) return "Profile mentions your website";
      return "Same handle as your other accounts";
    case "possible":
      return "Uses your name · not confirmed";
    case "mentions":
      return "Mentioned, but no account found";
    case "none":
      return "Nothing on Google";
    default:
      return "Not searched";
  }
}

function googleUrl(brand: string, p: (typeof PLATFORMS)[number]) {
  const site = p.name === "X" ? "(site:x.com OR site:twitter.com)" : `site:${p.domain}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`"${brand.replaceAll('"', "").slice(0, 100)}" ${site}`)}`;
}

export default function Report({ identity, mentions, brand, checks = {}, nameEditor }: { identity: Identity; mentions: Mentions; brand: string; checks?: Record<string, ProfileCheck>; nameEditor?: ReactNode }) {
  const [view, setView] = useState("all");
  const [allOpps, setAllOpps] = useState(false);
  const [openOpp, setOpenOpp] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // platforms showing all results
  const SHOWN = 5;
  const rows = useMemo(() => buildRows(identity, mentions, brand, checks), [identity, mentions, brand, checks]);
  const actions = useMemo(() => (mentions.status === "done" ? buildActions(rows, brand) : []), [rows, mentions.status, brand]);
  const found = rows.filter((r) => r.status === "official" || r.status === "likely").length;
  const presence = presenceOf(rows);
  const linkedCount = rows.filter((r) => r.linked).length;
  const totalResults = rows.reduce((n, r) => n + (r.result?.results.length ?? 0), 0);
  const loading = mentions.status === "loading";
  const searched = mentions.status === "done";

  const openPlatform = (name: string) => {
    setView(name);
    document.getElementById("dx-details")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const statusCount = (st: Status) => rows.filter((r) => r.status === st).length;
  const kinds = new Map<string, number>();
  rows.forEach((r) => r.tagged?.forEach(({ t }) => kinds.set(t.kind, (kinds.get(t.kind) ?? 0) + 1)));
  const maxKind = Math.max(1, ...kinds.values());
  const high = actions.filter((a) => a.level === "high").length;
  const medium = actions.filter((a) => a.level === "medium").length;

  // Strongest evidence first: linked/confirmed profiles, then name-matching profiles, then other results.
  const evidence = rows
    .flatMap((r) =>
      (r.tagged ?? []).map(({ m, t }) => ({
        r,
        m,
        t,
        other: r.extras.some((e) => e.m.url === m.url), // another account using the name on a platform you already link
        rank: t.official ? 0 : r.extras.some((e) => e.m.url === m.url) ? 2 : t.kind === "profile" && t.matchesBrand && (t.mentionsSite || t.sameHandle || t.checked === "yours") ? 1 : isProfile(t) && t.matchesBrand && t.checked !== "other" ? 2 : 3,
      })),
    )
    .sort((a, b) => a.rank - b.rank)
    .filter((x, i, all) => all.findIndex((y) => y.r.name === x.r.name && y.rank === x.rank) === i || x.rank === 3)
    .slice(0, 6);
  const evidenceLabel = (rank: number, label: string) => (rank === 0 ? "Official" : rank === 1 ? "Likely yours" : rank === 2 ? "Same name" : label);

  // Donut segments
  const C = 2 * Math.PI * 52;
  const counts = DONUT.map((st) => statusCount(st));
  const segs = DONUT.map((st, i) => {
    const n = counts[i];
    const len = (n / rows.length) * C;
    const offset = (counts.slice(0, i).reduce((a, b) => a + b, 0) / rows.length) * C;
    return { st, n, dash: Math.max(0, len - (n ? 3 : 0)), offset };
  });

  return (
    <>
      {/* KPI CARDS */}
      <section className="vz-kpis" aria-label="Summary">
        <button type="button" className="vz-card vz-kpi" onClick={() => go("rp-status")}>
          <span className="vz-kpi-ic c-blue"><Ico n="search" /></span>
          <span className="vz-kpi-t">Brand presence</span>
          <span className="vz-chev"><Ico n="chev" size={16} /></span>
          <strong>{loading ? "…" : searched ? presence.total : linkedCount}<small> / {rows.length}</small></strong>
          <span className="vz-kpi-sub">{loading ? "Searching all platforms…" : searched ? <>Platforms with an account using your name: <b>{presence.confirmed} confirmed</b> · <b>{presence.toVerify} to verify</b></> : "Platforms your website links to"}</span>
          <span className="vz-cells" aria-hidden="true">{rows.map((r) => <i key={r.name} className={`s-${loading && !r.linked ? "loading" : STATUS[r.status].tone}`} />)}</span>
        </button>
        <button type="button" className="vz-card vz-kpi" onClick={() => go("dx-details")}>
          <span className="vz-kpi-ic c-purple"><Ico n="doc" /></span>
          <span className="vz-kpi-t">Search results</span>
          <span className="vz-chev"><Ico n="chev" size={16} /></span>
          <strong>{searched ? totalResults : "–"}</strong>
          <span className="vz-kpi-sub">Google results for “{brand}” across {rows.length} platforms</span>
          <span className="vz-spark" aria-hidden="true">{rows.map((r) => <i key={r.name} style={{ height: `${Math.max(8, ((r.result?.results.length ?? 0) / 10) * 100)}%` }} />)}</span>
        </button>
        <button type="button" className="vz-card vz-kpi" onClick={() => go("rp-status")}>
          <span className="vz-kpi-ic c-green"><Ico n="link" /></span>
          <span className="vz-kpi-t">Linked profiles</span>
          <span className="vz-chev"><Ico n="chev" size={16} /></span>
          <strong>{linkedCount}</strong>
          <span className="vz-kpi-sub">Profiles your website links to</span>
          <span className="vz-logos">{rows.filter((r) => r.linked).map((r) => <span key={r.name} title={r.name}><Logo name={r.name} size={15} /></span>)}{linkedCount === 0 && <em>None found on your homepage</em>}</span>
        </button>
        <button type="button" className="vz-card vz-kpi" onClick={() => go("vz-opps")}>
          <span className="vz-kpi-ic c-orange"><Ico n="bulb" /></span>
          <span className="vz-kpi-t">Opportunities</span>
          <span className="vz-chev"><Ico n="chev" size={16} /></span>
          <strong>{searched ? actions.length : "–"}</strong>
          <span className="vz-kpi-sub">{searched ? `${high} high · ${medium} medium · ${actions.length - high - medium} low priority` : "Worked out after the search"}</span>
          <span className="vz-pills" aria-hidden="true"><i className="lv-high" style={{ flex: high || 0.0001 }} /><i className="lv-medium" style={{ flex: medium || 0.0001 }} /><i className="lv-low" style={{ flex: actions.length - high - medium || 0.0001 }} /></span>
        </button>
      </section>

      {/* PLATFORM BY PLATFORM */}
      <section id="rp-status" className="pp" aria-labelledby="pp-t">
        <div className="pp-head">
          <div>
            <span className="pp-eyebrow">Platform by platform</span>
            <h2 id="pp-t">Where <em>{brand}</em> shows up</h2>
          </div>
          <ul className="pp-legend" aria-label="Summary">
            {(["official", "likely", "possible", "mentions", "none"] as Status[]).map((st) => (
              <li key={st} className={`ps-${st}`}><i aria-hidden="true" />{STATUS[st].label}<b>{rows.filter((r) => r.status === st).length}</b></li>
            ))}
          </ul>
        </div>
        <div className="pp-grid">
          {rows.map((r) => {
            const st = STATUS[r.status];
            const account = r.linked ?? (r.bestProfile ? { url: r.bestProfile.m.url } : null);
            const n = r.result?.results.length ?? 0;
            return (
              <article key={r.name} className={`pp-card ps-${r.status}`}>
                <div className="pp-orb">
                  <Orb name={r.name} size={58} />
                  <span className="pp-orb-shadow" aria-hidden="true" />
                </div>
                <strong className="pp-name">{r.name}</strong>
                <em className={`pp-pill ps-${r.status}`}><i aria-hidden="true" />{st.label}</em>
                {account ? (
                  <a className="pp-acc" href={account.url} target="_blank" rel="noopener noreferrer nofollow" title={shortUrl(account.url)}>{shortUrl(account.url).replace(/^[a-z]{2}\./, "")}</a>
                ) : (
                  <span className="pp-acc is-none">No account found</span>
                )}
                <p className="pp-why">{reasonFor(r)}</p>
                <button type="button" className="pp-view" onClick={() => openPlatform(r.name)}>
                  {r.result ? `${n} result${n === 1 ? "" : "s"}` : "Not searched"} <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* CHARTS */}
      <section className="vz-charts" aria-label="Charts">
        <div className="vz-card vz-chart">
          <div className="vz-card-head"><h3>Results by platform</h3><span className="vz-chip">Up to 10 per platform</span></div>
          <div className="vz-bars" role="img" aria-label={rows.map((r) => `${r.name}: ${r.result?.results.length ?? 0} results, ${STATUS[r.status].label}`).join("; ")}>
            {rows.map((r) => {
              const n = r.result?.results.length ?? 0;
              return (
                <button key={r.name} type="button" className="vz-bar" onClick={() => openPlatform(r.name)} title={`${r.name}: ${n} results · ${STATUS[r.status].label}`}>
                  <b>{loading ? "" : n}</b>
                  <span className="vz-bar-track"><i className={`s-${loading ? "loading" : STATUS[r.status].tone}`} style={{ height: loading ? "30%" : `${Math.max(3, (n / 10) * 100)}%` }} /></span>
                  <span className="vz-bar-logo"><Logo name={r.name} size={16} /></span>
                  <small>{r.name}</small>
                </button>
              );
            })}
          </div>
          <p className="vz-note">Bar colour shows the platform&apos;s status.</p>
        </div>

        <div className="vz-card vz-chart">
          <div className="vz-card-head"><h3>Platform coverage</h3><span className="vz-chip">{rows.length} platforms</span></div>
          <div className="vz-donut-wrap">
            <svg className="vz-donut" viewBox="0 0 140 140" role="img" aria-label={segs.map((x) => `${STATUS[x.st].label}: ${x.n}`).join(", ")}>
              <circle cx="70" cy="70" r="52" fill="none" stroke="var(--vz-track)" strokeWidth="16" />
              {searched && segs.map((x) => x.n > 0 && (
                <circle key={x.st} className={`s-${STATUS[x.st].tone}`} cx="70" cy="70" r="52" fill="none" strokeWidth="16" strokeDasharray={`${x.dash} ${C}`} strokeDashoffset={-x.offset} transform="rotate(-90 70 70)" />
              ))}
            </svg>
            <div className="vz-donut-c"><strong>{loading ? "…" : found}</strong><span>of {rows.length} confirmed</span></div>
          </div>
          <ul className="vz-legend">
            {segs.map((x) => (
              <li key={x.st}><i className={`s-${STATUS[x.st].tone}`} />{STATUS[x.st].label}<span>{searched ? `${Math.round((x.n / rows.length) * 100)}%` : "–"}</span><b>{searched ? x.n : "–"}</b></li>
            ))}
          </ul>
        </div>

        <div className="vz-card vz-chart">
          <div className="vz-card-head"><h3>What Google shows</h3><span className="vz-chip">By result type</span></div>
          {searched && kinds.size ? (
            <ul className="vz-hbars">
              {KIND_ORDER.filter(([k]) => kinds.get(k)).map(([k, label]) => (
                <li key={k}><span>{label}</span><span className="vz-hbar"><i className={`k-${k}`} style={{ width: `${((kinds.get(k) ?? 0) / maxKind) * 100}%` }} /></span><b>{kinds.get(k)}</b></li>
              ))}
            </ul>
          ) : (
            <p className="vz-empty">{loading ? "Searching…" : "No search results yet."}</p>
          )}
          <p className="vz-note">Profiles are accounts; posts, videos and discussions are content that mentions “{brand}”.</p>
        </div>
      </section>

      {/* OPPORTUNITIES + EVIDENCE */}
      <section className="vz-pair">
        <div id="vz-opps" className="vz-card vz-list">
          <div className="vz-card-head"><h3>Top opportunities</h3>{actions.length > 4 && <button type="button" className="vz-link" onClick={() => setAllOpps((v) => !v)}>{allOpps ? "Show less" : `View all ${actions.length}`}</button>}</div>
          {!searched ? (
            <p className="vz-empty">{loading ? "Working out what to do…" : "Available after the search."}</p>
          ) : actions.length === 0 ? (
            <p className="vz-empty">Nothing to fix. Every platform we searched looks right.</p>
          ) : (
            <ol>
              {(allOpps ? actions : actions.slice(0, 4)).map((a, i) => (
                <li key={a.title} className={openOpp === i ? "is-open" : ""}>
                  <button type="button" onClick={() => setOpenOpp(openOpp === i ? null : i)} aria-expanded={openOpp === i}>
                    <span className="vz-num">{i + 1}</span>
                    <span className="vz-li-t"><strong>{a.title}</strong><small>{a.detail}</small></span>
                    <em className={`vz-badge lv-${a.level}`}>{a.level === "high" ? "High" : a.level === "medium" ? "Medium" : "Low"}</em>
                    <span className="vz-chev"><Ico n="chev" size={16} /></span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="vz-card vz-list">
          <div className="vz-card-head"><h3>Top evidence</h3><button type="button" className="vz-link" onClick={() => go("dx-details")}>View all</button></div>
          {!searched ? (
            <p className="vz-empty">{loading ? "Searching…" : "Available after the search."}</p>
          ) : evidence.length === 0 ? (
            <p className="vz-empty">Google returned no results for “{brand}” on these platforms.</p>
          ) : (
            <ol>
              {evidence.map((x, i) => (
                <li key={x.m.url}>
                  <a href={x.m.url} target="_blank" rel="noopener noreferrer nofollow">
                    <span className="vz-num">{i + 1}</span>
                    <span className="vz-ev-logo"><Logo name={x.r.name} size={18} /></span>
                    <span className="vz-li-t"><strong>{x.m.title || shortUrl(x.m.url)}</strong><small>{shortUrl(x.m.url)}</small></span>
                    <em className={`vz-badge ev-${x.rank}`}>{x.other ? "Another account" : evidenceLabel(x.rank, x.t.label)}</em>
                    <span className="vz-chev"><Ico n="chev" size={16} /></span>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {nameEditor}

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
                  <span className="vz-plat-logo"><Logo name={r.name} size={18} /></span>{r.name}
                  {!(loading && !r.linked) && <em className={`pp-pill ps-${r.status}`}><i aria-hidden="true" />{st.label}</em>}
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
                    <>
                    <ol className="dx-results">
                      {(expanded[r.name] || view === r.name ? r.tagged : r.tagged.slice(0, SHOWN)).map(({ m, t }) => (
                        <li key={m.url} className={`dx-hit ${t.official ? "is-official" : ""}`}>
                          <div className="rp-tags">
                            <em className={`rp-kind k-${t.kind}`}>{t.label}</em>
                            {t.official && <em className="rp-kind k-official">{t.sameChannel ? "Same channel your site links to" : "Your linked profile"}</em>}
                            {t.checked === "yours" && !t.official && <em className="rp-kind k-match">Checked: links to your website</em>}
                            {t.checked === "other" && <em className="rp-kind k-other">Checked: links to {shortUrl(t.otherSite ?? "")}</em>}
                            {!t.checked && (r.extras.some((x) => x.m.url === m.url) ? <em className="rp-kind k-name">Another account with your name</em> : !t.official && t.matchesBrand && isProfile(t) && (t.besideSite ? <em className="rp-kind k-match">Shown beside your website on Google</em> : t.mentionsSite && t.kind === "profile" ? <em className="rp-kind k-match">Mentions your website</em> : t.sameHandle ? <em className="rp-kind k-match">Same handle as your profiles</em> : <em className="rp-kind k-name">Same name</em>))}
                          </div>
                          <a href={m.url} target="_blank" rel="noopener noreferrer nofollow">{m.title || m.url}</a>
                          <span>{shortUrl(m.url)}</span>
                          {m.snippet && <p>{m.snippet}</p>}
                        </li>
                      ))}
                    </ol>
                      {r.tagged.length > SHOWN && view !== r.name && (
                        <button type="button" className="dx-more" onClick={() => setExpanded((x) => ({ ...x, [r.name]: !x[r.name] }))}>
                          {expanded[r.name] ? "Show fewer" : `Show ${r.tagged.length - SHOWN} more`}
                        </button>
                      )}
                    </>
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
