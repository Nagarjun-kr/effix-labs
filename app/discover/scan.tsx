"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- links to the homepage must be full page loads: its scripts
   (animations, the #audit search box) only start on a real page load, which <Link> would skip. */

// Full-screen scan shown while the audit runs: a white screen with a mint-green radar (sweep line, trailing wedge,
// glowing outer arc, pulse ring). Each platform appears as a blip when its search finishes; a thin line underneath
// follows the real progress. No visible text; the status is announced to screen readers.

export type StepState = "wait" | "run" | "second" | "done";
export type SearchProgress = { overview: StepState; siteFound?: boolean; platforms: Record<string, { state: StepState; found?: number }> };
export type ScanStage = "site" | "search" | "ready" | "error";

const NAMES = ["YouTube", "Instagram", "Facebook", "LinkedIn", "X", "Reddit", "Quora", "Threads"];
// [angle in degrees, distance from centre as % of the radius] for each platform's blip
const BLIPS: [number, number][] = [[-60, 72], [-18, 46], [25, 82], [62, 58], [118, 76], [158, 40], [205, 66], [250, 84]];


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

  // Each platform is a blip at a fixed spot on the radar; it appears when that platform's search finishes.
  return (
    <div className={`sc ${stage === "ready" ? "is-ready" : ""}`} aria-busy={stage !== "ready"}>
      <p className="sr-only" aria-live="polite">
        {stage === "ready" ? "Your report is ready." : `${activity(stage, domain, brand, progress)} ${pct}% complete, ${done} of 8 platforms checked, ${results} results found.`}
      </p>
      <div className="sc-radar" aria-hidden="true">
        <span className="sc-ring r1" />
        <span className="sc-ring r2" />
        <span className="sc-ring r3" />
        <span className="sc-ring r4" />
        <span className="sc-cross" />
        <span className="sc-pulse" />
        <span className="sc-arm">
          <span className="sc-wedge" />
          <span className="sc-edge" />
          <span className="sc-beam" />
        </span>
        <span className="sc-center" />
        {NAMES.map((name, i) => {
          const st = stage === "site" ? "wait" : progress.platforms[name]?.state ?? "wait";
          const [angle, radius] = BLIPS[i];
          return <span key={name} className={`sc-blip st-${st}`} style={{ ["--a" as string]: `${angle}deg`, ["--d" as string]: String(radius / 200) }} />;
        })}
      </div>
      <div className="sc-line" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
