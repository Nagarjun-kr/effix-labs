"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- links to the homepage must be full page loads: its scripts
   (animations, the #audit search box) only start on a real page load, which <Link> would skip. */

// Full-screen scan shown while the audit runs: radar sweep around the brand, the eight platforms on a ring that
// light up as each search finishes, a live activity line, a progress bar tied to the real steps, then "Report ready".
import { BRAND_ICONS } from "@/lib/discover/brand-icons";

export type StepState = "wait" | "run" | "second" | "done";
export type SearchProgress = { overview: StepState; siteFound?: boolean; platforms: Record<string, { state: StepState; found?: number }> };
export type ScanStage = "site" | "search" | "ready" | "error";

const NAMES = ["YouTube", "Instagram", "Facebook", "LinkedIn", "X", "Reddit", "Quora", "Threads"];

function PlatformMark({ name, size = 22 }: { name: string; size?: number }) {
  const i = BRAND_ICONS[name];
  if (!i) return null;
  const light = name === "X" || name === "Threads"; // black logos need a light mark on the dark scene
  return (
    <svg width={size} height={size} viewBox={`0 0 ${i.w} ${i.h}`} aria-hidden="true">
      <path d={i.d} fill={light ? "#ffffff" : i.color} />
    </svg>
  );
}

export function percentFor(stage: ScanStage, p: SearchProgress) {
  if (stage === "ready") return 100;
  if (stage === "site") return 6;
  let n = 14; // website read
  if (p.overview === "run") n += 3;
  if (p.overview === "done") n += 8;
  for (const name of NAMES) {
    const s = p.platforms[name]?.state;
    n += s === "done" ? 9 : s === "second" ? 6 : s === "run" ? 3 : 0;
  }
  return Math.min(96, n);
}

function activity(stage: ScanStage, domain: string, brand: string, p: SearchProgress) {
  if (stage === "site") return `Reading ${domain || "your website"}…`;
  if (stage === "ready") return "All checks complete. Building your report…";
  if (p.overview !== "done") return `Searching “${brand}” on Google…`;
  const again = NAMES.find((n) => p.platforms[n]?.state === "second");
  if (again) return `Looking again on ${again} for accounts using “${brand}”…`;
  const running = NAMES.filter((n) => p.platforms[n]?.state === "run");
  if (running.length) return `Searching ${running.join(" and ")} for “${brand}”…`;
  return "Comparing what we found…";
}

export default function Scan({
  stage,
  domain,
  brand,
  progress,
  error,
}: {
  stage: ScanStage;
  domain: string;
  brand: string;
  progress: SearchProgress;
  error?: string | null;
}) {
  const pct = percentFor(stage, progress);
  const done = NAMES.filter((n) => progress.platforms[n]?.state === "done").length;
  const results = NAMES.reduce((s, n) => s + (progress.platforms[n]?.found ?? 0), 0);
  const initial = (brand || domain || "?").trim().charAt(0).toUpperCase();
  const steps = [
    { label: "Read your website", state: stage === "site" ? "run" : "done" },
    { label: "Search your name on Google", state: stage === "site" ? "wait" : progress.overview === "done" ? "done" : "run" },
    { label: "Check 8 platforms", state: stage === "ready" ? "done" : stage === "site" || progress.overview !== "done" ? "wait" : "run" },
    { label: "Build your report", state: stage === "ready" ? "run" : "wait" },
  ];

  if (stage === "error") {
    return (
      <div className="sc sc-error" role="alert">
        <div className="sc-bg" aria-hidden="true" />
        <div className="sc-inner">
          <div className="sc-err-ic" aria-hidden="true">!</div>
          <h1>We couldn&apos;t check {domain || "that website"}</h1>
          <p>{error || "Something went wrong. Please try again."}</p>
          <a className="sc-btn" href="/#audit">Try another website</a>
        </div>
      </div>
    );
  }

  return (
    <div className={`sc ${stage === "ready" ? "is-ready" : ""}`} aria-live="polite" aria-busy={stage !== "ready"}>
      <div className="sc-bg" aria-hidden="true" />
      <div className="sc-inner">
        <span className="sc-kicker"><i aria-hidden="true" /> Effix Discover · Live visibility scan</span>

        <div className="sc-radar" role="img" aria-label={`${done} of 8 platforms checked`}>
          <div className="sc-ring r1" />
          <div className="sc-ring r2" />
          <div className="sc-ring r3" />
          <div className="sc-sweep" />
          <div className="sc-core">
            <b>{initial}</b>
            <small>{domain}</small>
          </div>
          {NAMES.map((name, i) => {
            const st = progress.platforms[name] ?? { state: "wait" as StepState };
            const angle = (i / NAMES.length) * 360 - 90;
            return (
              <div key={name} className={`sc-node st-${stage === "site" ? "wait" : st.state}`} style={{ ["--a" as string]: `${angle}deg` }}>
                <span className="sc-node-ic"><PlatformMark name={name} /></span>
                {st.state === "done" && <em>{st.found ?? 0}</em>}
                <small>{name}</small>
              </div>
            );
          })}
        </div>

        <h1 className="sc-title">{stage === "ready" ? "Your report is ready" : <>Scanning the web for <span>“{brand || domain}”</span></>}</h1>
        <p className="sc-activity" key={activity(stage, domain, brand, progress)}>{activity(stage, domain, brand, progress)}</p>

        <div className="sc-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
        <div className="sc-meta">
          <span><b>{pct}%</b> complete</span>
          <span><b>{done}</b>/8 platforms</span>
          <span><b>{results}</b> results found</span>
          {progress.siteFound && <span className="ok">✓ Your website is on Google</span>}
        </div>

        <ol className="sc-steps">
          {steps.map((s, i) => (
            <li key={s.label} className={`st-${s.state}`}>
              <i aria-hidden="true">{s.state === "done" ? "✓" : i + 1}</i>
              {s.label}
            </li>
          ))}
        </ol>
        <p className="sc-note">We check each platform carefully and look twice where nothing turns up, so this takes 20–60 seconds.</p>
      </div>
    </div>
  );
}
