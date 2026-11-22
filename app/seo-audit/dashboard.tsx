"use client";

// Audit dashboard: sidebar workspace showing the SEO audit, Google speed test and brand visibility.
import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import type { AuditReport, Category, Check, Severity, SpeedReport } from "@/lib/seo-audit/types";
import BrandVisibility from "./brand-visibility";
import { API_BASE } from "@/lib/api";

/* ---------- small pieces ---------- */

const ICONS: Record<string, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  technical: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5Z" />,
  content: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  ai: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><path d="M12 7.5 13.6 10.4 16.5 12 13.6 13.6 12 16.5 10.4 13.6 7.5 12 10.4 10.4Z" /></>,
  speed: <><path d="M12 14l4-4" /><path d="M3.3 17a9 9 0 1 1 17.4 0" /></>,
  pages: <><rect x="4" y="3" width="13" height="16" rx="2" /><path d="M8 21h11a2 2 0 0 0 2-2V8" /></>,
  brand: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  plan: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17" /></>,
  download: <><path d="M12 4v11m0 0-4-4m4 4 4-4" /><path d="M5 19h14" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  alert: <><path d="M12 8v5M12 16.5v.5" /><circle cx="12" cy="12" r="9" /></>,
};

function Icon({ name, size = 18 }: { name: keyof typeof ICONS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

const tone = (s: number | null) => (s === null ? "none" : s >= 90 ? "good" : s >= 50 ? "ok" : "poor");
const verdict = (s: number) => (s >= 90 ? "Strong" : s >= 75 ? "Good" : s >= 50 ? "Needs work" : "Poor");

function Ring({ score, size = 120, stroke = 10, label }: { score: number | null; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = score ?? 0;
  return (
    <div className={`sd-ring t-${tone(score)}`} style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Score"}: ${score ?? "not available"} out of 100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sd-track)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(c * v) / 100} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} className="sd-ring-arc" />
      </svg>
      <b style={{ fontSize: size * 0.3 }}>{score ?? "–"}</b>
    </div>
  );
}

const SEV: Record<Severity, string> = { high: "High", medium: "Medium", low: "Low" };
const CAT: Record<Category, string> = { technical: "Technical SEO", content: "Content", ai: "AI Visibility" };

function CheckRow({ check, aiFix }: { check: Check; aiFix?: string }) {
  if (check.passed) {
    return (
      <li className="sd-check is-pass">
        <span className="sd-check-ic"><Icon name="check" size={14} /></span>
        <div><strong>{check.title}</strong><p>{check.evidence}</p></div>
      </li>
    );
  }
  return (
    <li className={`sd-check sev-${check.severity}`}>
      <details>
        <summary>
          <span className="sd-check-ic"><Icon name="alert" size={14} /></span>
          <div><strong>{check.title}</strong><p>{check.evidence}</p></div>
          <span className={`sd-sev sev-${check.severity}`}>{SEV[check.severity]}</span>
        </summary>
        <div className="sd-fix">
          <span className="sd-label">How to fix</span>
          <p>{aiFix || check.fix}</p>
        </div>
      </details>
    </li>
  );
}

function CheckList({ checks, fixes }: { checks: Check[]; fixes: Record<string, string> }) {
  const order = { high: 0, medium: 1, low: 2 };
  const failed = checks.filter((c) => !c.passed).sort((a, b) => order[a.severity] - order[b.severity]);
  const passed = checks.filter((c) => c.passed);
  return (
    <div className="sd-card">
      <div className="sd-card-head">
        <h3>Checks</h3>
        <span className="sd-pill">{passed.length} passed · {failed.length} to fix</span>
      </div>
      {failed.length > 0 && <ul className="sd-checks">{failed.map((c) => <CheckRow key={c.code} check={c} aiFix={fixes[c.code]} />)}</ul>}
      {passed.length > 0 && (
        <details className="sd-passed" open={failed.length === 0}>
          <summary>Show {passed.length} passed check{passed.length === 1 ? "" : "s"}</summary>
          <ul className="sd-checks">{passed.map((c) => <CheckRow key={c.code} check={c} />)}</ul>
        </details>
      )}
    </div>
  );
}

function Tile({ label, value, note, state }: { label: string; value: ReactNode; note?: string; state?: "good" | "ok" | "poor" }) {
  return (
    <div className={`sd-tile ${state ? `t-${state}` : ""}`}>
      <span className="sd-label">{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function Section({ id, icon, title, sub, score, children }: { id: string; icon: string; title: string; sub: string; score?: number | null; children: ReactNode }) {
  return (
    <section id={`sd-${id}`} className="sd-section" data-nav={id} aria-labelledby={`sd-${id}-t`}>
      <header className="sd-section-head">
        <span className="sd-section-ic"><Icon name={icon} size={20} /></span>
        <div>
          <h2 id={`sd-${id}-t`}>{title}</h2>
          <p>{sub}</p>
        </div>
        {score !== undefined && <Ring score={score} size={64} stroke={6} label={title} />}
      </header>
      {children}
    </section>
  );
}

/* ---------- speed ---------- */

type SpeedState = { status: "loading" } | { status: "done"; data: SpeedReport } | { status: "error"; message: string };

function SpeedPanel({ url, state, strategy, setStrategy }: { url: string; state: SpeedState | undefined; strategy: "mobile" | "desktop"; setStrategy: (s: "mobile" | "desktop") => void }) {
  const psi = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;
  return (
    <>
      <div className="sd-seg" role="tablist" aria-label="Device">
        {(["mobile", "desktop"] as const).map((s) => (
          <button key={s} type="button" role="tab" aria-selected={strategy === s} className={strategy === s ? "is-on" : ""} onClick={() => setStrategy(s)}>{s === "mobile" ? "Mobile" : "Desktop"}</button>
        ))}
      </div>
      {(!state || state.status === "loading") && (
        <div className="sd-card sd-speed-wait">
          <span className="sd-spin" aria-hidden="true" />
          <div><strong>Google is testing your page on {strategy}…</strong><p>This takes 15–40 seconds. The rest of the report is ready below.</p></div>
        </div>
      )}
      {state?.status === "error" && (
        <div className="sd-card sd-speed-wait">
          <span className="sd-check-ic sev-medium"><Icon name="alert" size={14} /></span>
          <div>
            <strong>Speed test unavailable</strong>
            <p>{state.message} You can run it directly on <a href={psi} target="_blank" rel="noopener noreferrer">Google PageSpeed Insights ↗</a>.</p>
          </div>
        </div>
      )}
      {state?.status === "done" && (
        <div className="sd-speed">
          <div className="sd-card sd-speed-score">
            <Ring score={state.data.score} size={132} stroke={11} label="Performance" />
            <div>
              <span className="sd-label">Google Lighthouse · {strategy}</span>
              <h3>{state.data.score === null ? "No score" : verdict(state.data.score)}</h3>
              <p>A lab test Google ran just now. Scores vary a few points between runs.</p>
              <a href={psi} target="_blank" rel="noopener noreferrer">Full report on PageSpeed Insights ↗</a>
            </div>
          </div>
          <div className="sd-card">
            <div className="sd-card-head"><h3>Lab metrics</h3></div>
            <ul className="sd-metrics">
              {state.data.metrics.map((m) => (
                <li key={m.id}><span className={`dot t-${tone(m.score)}`} />{m.label}<b>{m.display}</b></li>
              ))}
            </ul>
          </div>
          <div className="sd-card">
            <div className="sd-card-head"><h3>Real visitors (Chrome data, 28 days)</h3></div>
            {state.data.field ? (
              <ul className="sd-metrics">
                {state.data.field.map((m) => (
                  <li key={m.label}><span className={`dot t-${m.category === "FAST" ? "good" : m.category === "AVERAGE" ? "ok" : "poor"}`} />{m.label}<b>{m.display}</b></li>
                ))}
              </ul>
            ) : (
              <p className="sd-muted">Google doesn&apos;t have enough real-visitor data for this site yet. That&apos;s normal for smaller sites.</p>
            )}
          </div>
          <div className="sd-card">
            <div className="sd-card-head"><h3>Biggest speed wins</h3></div>
            {state.data.opportunities.length ? (
              <ul className="sd-metrics">
                {state.data.opportunities.map((o) => <li key={o.title}>{o.title}<b>save ~{o.savings}</b></li>)}
              </ul>
            ) : (
              <p className="sd-muted">Google found no major speed savings on this page.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- dashboard ---------- */

const NAV = [
  { id: "overview", label: "Overview", icon: "overview", group: "Main" },
  { id: "technical", label: "Technical SEO", icon: "technical", group: "Audit" },
  { id: "content", label: "Content", icon: "content", group: "Audit" },
  { id: "ai", label: "AI Visibility", icon: "ai", group: "Audit" },
  { id: "speed", label: "Speed", icon: "speed", group: "Audit" },
  { id: "pages", label: "Pages checked", icon: "pages", group: "Audit" },
  { id: "brand", label: "Brand visibility", icon: "brand", group: "Audit" },
  { id: "plan", label: "Action plan", icon: "plan", group: "Report" },
] as const;

export default function Dashboard({ report, onNewAudit, busy }: { report: AuditReport; onNewAudit: (url: string) => void; busy: boolean }) {
  const [active, setActive] = useState("overview");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [speed, setSpeed] = useState<Partial<Record<"mobile" | "desktop", SpeedState>>>({});
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [next, setNext] = useState("");
  const [copied, setCopied] = useState(false);
  const requested = useRef(new Set<string>());

  const loadSpeed = useCallback(
    (s: "mobile" | "desktop") => {
      if (requested.current.has(s)) return;
      requested.current.add(s);
      setSpeed((x) => ({ ...x, [s]: { status: "loading" } }));
      fetch(`${API_BASE}/api/seo-audit/speed`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: report.url, strategy: s }) })
        .then(async (res) => {
          const body = await res.json().catch(() => ({}));
          if (!res.ok || !body.speed) throw new Error(body.error || "Google couldn't run a speed test on this page.");
          setSpeed((x) => ({ ...x, [s]: { status: "done", data: body.speed as SpeedReport } }));
        })
        .catch((e: unknown) => setSpeed((x) => ({ ...x, [s]: { status: "error", message: e instanceof Error ? e.message : "Speed test failed." } })));
    },
    [report.url],
  );

  useEffect(() => loadSpeed("mobile"), [loadSpeed]);
  useEffect(() => loadSpeed(strategy), [strategy, loadSpeed]);

  // Highlight the sidebar item for the section in view.
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>(".sd-section[data-nav]")];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive((visible.target as HTMLElement).dataset.nav ?? "overview");
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Export PDF: open every fix so it prints, then restore.
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = [...document.querySelectorAll<HTMLDetailsElement>(".sd details:not([open])")];
      opened.forEach((d) => (d.open = true));
    };
    const after = () => opened.forEach((d) => (d.open = false));
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  const go = (id: string) => {
    setActive(id);
    document.getElementById(`sd-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const mobileSpeed = speed.mobile?.status === "done" ? speed.mobile.data.score : null;
  const { technical, content, ai } = report.scores;
  const overall = Math.round(
    mobileSpeed === null ? technical * 0.4 + content * 0.35 + ai * 0.25 : technical * 0.3 + content * 0.3 + ai * 0.2 + mobileSpeed * 0.2,
  );
  const failed = report.checks.filter((c) => !c.passed);
  const counts = { high: 0, medium: 0, low: 0 } as Record<Severity, number>;
  failed.forEach((c) => (counts[c.severity] += 1));
  const order = { high: 0, medium: 1, low: 2 };
  const plan = [...failed].sort((a, b) => order[a.severity] - order[b.severity] || b.impact - a.impact);
  const byCat = (c: Category) => report.checks.filter((x) => x.category === c);
  const p = report.page;
  const okPages = report.pages.filter((x) => x.status && x.status < 400 && !x.error);
  const auditedAt = new Date(report.auditedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  function submitNext(e: FormEvent) {
    e.preventDefault();
    if (next.trim()) onNewAudit(next.trim());
  }
  function share() {
    const url = `${window.location.origin}/seo-audit?url=${encodeURIComponent(report.host)}`;
    if (navigator.share) navigator.share({ title: `SEO audit for ${report.host}`, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); });
  }

  let lastGroup = "";
  return (
    <div className="sd">
      <aside className="sd-side" aria-label="Report sections">
        <a className="sd-brand" href="/" aria-label="Effix Labs home">
          <span className="sd-mark"><i /></span>
          <span>Effix Labs</span>
        </a>
        <nav className="sd-nav">
          {NAV.map((n) => {
            const head = n.group !== lastGroup ? <span className="sd-group">{(lastGroup = n.group)}</span> : null;
            return (
              <div key={n.id} className="sd-nav-item">
                {head}
                <button type="button" className={active === n.id ? "is-on" : ""} aria-current={active === n.id ? "true" : undefined} onClick={() => go(n.id)}>
                  <Icon name={n.icon} />
                  <span>{n.label}</span>
                  {n.id === "plan" && failed.length > 0 && <em>{failed.length}</em>}
                </button>
              </div>
            );
          })}
        </nav>
        <div className="sd-host">
          <span className="sd-label">Audited site</span>
          <strong>{report.host}</strong>
          <div className="sd-bar"><i style={{ width: `${overall}%` }} /></div>
          <small>{overall >= 80 ? "Strong foundation" : "Action plan ready"}</small>
        </div>
        <a className="sd-home" href="/">← Back to Effix Labs</a>
      </aside>

      <main className="sd-main">
        <header className="sd-top">
          <div>
            <div className="sd-title">
              <h1>Audit results</h1>
              <span className="sd-done">Completed</span>
            </div>
            <p>
              <a href={report.url} target="_blank" rel="noopener noreferrer">{report.host} ↗</a> · {auditedAt}
            </p>
          </div>
          <div className="sd-actions">
            <form className="sd-new" onSubmit={submitNext}>
              <label htmlFor="sd-next" className="sr-only">Audit another website</label>
              <input id="sd-next" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Audit another website" inputMode="url" />
              <button type="submit" className="sd-btn" disabled={busy || !next.trim()}>{busy ? "Running…" : "Run audit"}</button>
            </form>
            <button type="button" className="sd-ghost" onClick={share}><Icon name="share" size={16} />{copied ? "Link copied" : "Share"}</button>
            <button type="button" className="sd-ghost" onClick={() => window.print()}><Icon name="download" size={16} />Export PDF</button>
          </div>
        </header>

        {/* OVERVIEW */}
        <section id="sd-overview" className="sd-section" data-nav="overview" aria-label="Overview">
          <div className="sd-hero sd-card">
            <Ring score={overall} size={150} stroke={12} label="Overall score" />
            <div className="sd-hero-text">
              <span className="sd-label">Overall score {mobileSpeed !== null ? "(includes mobile speed)" : speed.mobile?.status === "error" ? "(speed not included)" : "(speed test running)"}</span>
              <h2>{verdict(overall)}</h2>
              <p>{report.ai.summary}</p>
              {report.ai.generated && <small className="sd-muted">Summary written by AI from the checks above. Always confirm before acting.</small>}
            </div>
            <div className="sd-prio">
              {(["high", "medium", "low"] as Severity[]).map((s) => (
                <button key={s} type="button" className={`sev-${s}`} onClick={() => { setFilter(s); go("plan"); }}>
                  <b>{counts[s]}</b>
                  <span>{SEV[s]} priority</span>
                </button>
              ))}
              <div className="is-pass"><b>{report.checks.length - failed.length}</b><span>Passed</span></div>
            </div>
          </div>
          <div className="sd-scores">
            {([
              ["technical", "Technical SEO", technical],
              ["content", "Content", content],
              ["ai", "AI Visibility", ai],
              ["speed", "Mobile speed", mobileSpeed],
            ] as const).map(([id, label, score]) => (
              <button key={id} type="button" className="sd-card sd-score" onClick={() => go(id)}>
                <Ring score={score} size={72} stroke={7} label={label} />
                <div>
                  <span className="sd-label">{label}</span>
                  <strong>{score === null ? (speed.mobile?.status === "error" ? "Unavailable" : "Testing…") : verdict(score)}</strong>
                </div>
              </button>
            ))}
          </div>
          {plan.length > 0 && (
            <div className="sd-card">
              <div className="sd-card-head">
                <h3>Fix these first</h3>
                <button type="button" className="sd-link" onClick={() => go("plan")}>See full action plan →</button>
              </div>
              <ol className="sd-top-fixes">
                {plan.slice(0, 5).map((c) => (
                  <li key={c.code}>
                    <span className={`sd-sev sev-${c.severity}`}>{SEV[c.severity]}</span>
                    <div><strong>{c.title}</strong><p>{report.ai.fixes[c.code] || c.fix}</p></div>
                    <em>{CAT[c.category]}</em>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>

        <Section id="technical" icon="technical" title="Technical SEO" sub="Can Google reach, read and index your site?" score={technical}>
          <div className="sd-tiles">
            <Tile label="HTTPS" value={report.url.startsWith("https") ? "Secure" : "Not secure"} state={report.url.startsWith("https") && report.site.httpsRedirect !== false ? "good" : "poor"} note={report.site.httpsRedirect ? "http:// redirects" : undefined} />
            <Tile label="Indexing" value={/noindex/.test(p.robotsMeta + p.xRobots) ? "Blocked" : "Allowed"} state={/noindex/.test(p.robotsMeta + p.xRobots) ? "poor" : "good"} />
            <Tile label="robots.txt" value={report.site.robots.found ? "Found" : "Missing"} state={report.site.robots.blocksAll ? "poor" : report.site.robots.found ? "good" : "ok"} note={report.site.robots.blocksAll ? "Blocks all crawlers" : undefined} />
            <Tile label="Sitemap" value={report.site.sitemap.found ? `${report.site.sitemap.urlCount} URLs` : "Missing"} state={report.site.sitemap.found ? "good" : "ok"} />
            <Tile label="Canonical" value={p.canonical ? "Set" : "Missing"} state={p.canonical ? "good" : "ok"} />
            <Tile label="HTML load" value={`${(p.ms / 1000).toFixed(2)}s`} state={p.ms < 1500 ? "good" : p.ms < 3000 ? "ok" : "poor"} note={`${Math.round(p.bytes / 1024)} KB`} />
          </div>
          <CheckList checks={byCat("technical")} fixes={report.ai.fixes} />
        </Section>

        <Section id="content" icon="content" title="Content" sub="Do your titles, headings and text match what people search for?" score={content}>
          <div className="sd-tiles">
            <Tile label="Title" value={`${p.title.length} chars`} state={p.title.length >= 25 && p.title.length <= 65 ? "good" : "ok"} note={p.title ? p.title.slice(0, 48) + (p.title.length > 48 ? "…" : "") : "Missing"} />
            <Tile label="Meta description" value={`${p.description.length} chars`} state={p.description.length >= 70 && p.description.length <= 165 ? "good" : "ok"} />
            <Tile label="H1 headings" value={p.h1s.length} state={p.h1s.length === 1 ? "good" : "ok"} />
            <Tile label="Words" value={p.wordCount.toLocaleString("en-IN")} state={p.wordCount >= 300 ? "good" : "ok"} />
            <Tile label="Images with alt" value={`${p.images - p.imagesMissingAlt}/${p.images}`} state={p.imagesMissingAlt === 0 ? "good" : "ok"} />
            <Tile label="Internal links" value={p.internalLinks.length} state={p.internalLinks.length >= 5 ? "good" : "ok"} />
          </div>
          <CheckList checks={byCat("content")} fixes={report.ai.fixes} />
        </Section>

        <Section id="ai" icon="ai" title="AI Visibility" sub="Can ChatGPT, Claude, Perplexity and Google AI understand and quote you?" score={ai}>
          <div className="sd-tiles">
            <Tile label="Schema types" value={p.schemaTypes.length} state={p.schemaTypes.length ? "good" : "ok"} note={p.schemaTypes.slice(0, 3).join(", ") || "None found"} />
            <Tile label="Questions answered" value={p.questionHeadings.length} state={p.questionHeadings.length >= 3 ? "good" : "ok"} />
            <Tile label="AI crawlers" value={report.site.robots.aiBlocked.length ? `${report.site.robots.aiBlocked.length} blocked` : "Allowed"} state={report.site.robots.aiBlocked.length ? "ok" : "good"} />
            <Tile label="llms.txt" value={report.site.llmsTxt ? "Found" : "Not found"} state={report.site.llmsTxt ? "good" : undefined} note="Optional" />
          </div>
          <CheckList checks={byCat("ai")} fixes={report.ai.fixes} />
        </Section>

        <Section id="speed" icon="speed" title="Speed" sub="Real Google Lighthouse test and Chrome visitor data." score={speed[strategy]?.status === "done" ? (speed[strategy] as { data: SpeedReport }).data.score : null}>
          <SpeedPanel url={report.url} state={speed[strategy]} strategy={strategy} setStrategy={setStrategy} />
        </Section>

        <Section id="pages" icon="pages" title="Pages checked" sub={`Your homepage plus ${report.pages.length} page${report.pages.length === 1 ? "" : "s"} from ${report.site.sitemap.found ? "your sitemap" : "your homepage links"}.`}>
          <div className="sd-card sd-table-wrap">
            <table className="sd-table">
              <thead><tr><th>Page</th><th>Status</th><th>Title</th><th>H1</th><th>Words</th></tr></thead>
              <tbody>
                <tr>
                  <td><a href={report.url} target="_blank" rel="noopener noreferrer">/ (homepage)</a></td>
                  <td><span className="sd-status t-good">{p.status}</span></td>
                  <td>{p.title || <em>Missing</em>}</td>
                  <td>{p.h1s.length}</td>
                  <td>{p.wordCount.toLocaleString("en-IN")}</td>
                </tr>
                {report.pages.map((x) => {
                  let path = x.url;
                  try { path = new URL(x.url).pathname; } catch {}
                  const bad = x.broken || (x.status !== null && x.status >= 400);
                  return (
                    <tr key={x.url}>
                      <td><a href={x.url} target="_blank" rel="noopener noreferrer">{path}</a></td>
                      <td><span className={`sd-status t-${bad ? "poor" : x.error ? "ok" : "good"}`}>{x.error ?? x.status}</span></td>
                      <td>{x.error ? "–" : x.title || <em>Missing</em>}</td>
                      <td>{x.error ? "–" : x.h1Count}</td>
                      <td>{x.error ? "–" : x.wordCount.toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {report.pages.length === 0 && <p className="sd-muted">We couldn&apos;t find other pages to sample (no sitemap and no internal links).</p>}
            {okPages.length > 0 && <p className="sd-foot-note">This is a sample, not a full crawl. For a full site crawl, ask us for a manual audit.</p>}
          </div>
        </Section>

        <Section id="brand" icon="brand" title="Brand visibility" sub="Where your brand shows up on eight platforms, from live search results.">
          <BrandVisibility identity={report.identity} />
        </Section>

        <Section id="plan" icon="plan" title="Action plan" sub="Every issue we found, most important first.">
          <div className="sd-tabs" role="tablist" aria-label="Filter by priority">
            {(["all", "high", "medium", "low"] as const).map((f) => (
              <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "is-on" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? `All (${failed.length})` : `${SEV[f]} (${counts[f]})`}
              </button>
            ))}
          </div>
          <div className="sd-card">
            {plan.length === 0 ? (
              <p className="sd-muted">No issues found. Nice work.</p>
            ) : (
              <ul className="sd-checks">
                {plan.filter((c) => filter === "all" || c.severity === filter).map((c) => <CheckRow key={c.code} check={c} aiFix={report.ai.fixes[c.code]} />)}
              </ul>
            )}
          </div>
          <div className="sd-cta">
            <div>
              <span className="sd-label">Next step</span>
              <h3>Want us to fix these for you?</h3>
              <p>Effix Labs fixes technical SEO, content and AI-search visibility, with honest reporting and no fake reviews or accounts.</p>
            </div>
            <div className="sd-cta-links">
              <a href="/services/seo-aeo-services">SEO &amp; AEO Services →</a>
              <a href="/services/content-writing">Content Writing →</a>
              <a href="/services/google-business-profile">Google Business Profile →</a>
              <a href="/services/reddit-marketing">Reddit Marketing →</a>
              <p>Or email <a href="mailto:hello@effix.co.in">hello@effix.co.in</a>. We reply within one business day.</p>
            </div>
          </div>
          <p className="sd-foot-note">
            Automated checks of public pages at the time of the audit. Speed data is from Google PageSpeed Insights; brand results are from Google search and aren&apos;t verified by Effix Labs. Nothing you enter is saved.
          </p>
        </Section>
      </main>
    </div>
  );
}
