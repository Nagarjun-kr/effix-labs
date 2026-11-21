"use client";

// Interactive roadmap of the founder's journey: click, hover or use the arrow keys to move between milestones;
// it also steps forward on its own (pauses on hover/focus, off for reduced motion).
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export type Milestone = { tag: string; title: string; text: string; icon: string; next?: boolean };

const ICONS: Record<string, string> = {
  spark: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  layers: "M12 3 2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 17.5l10 5 10-5",
  radar: "M12 12 19 5M21 12a9 9 0 1 1-9-9M16.5 12a4.5 4.5 0 1 1-4.5-4.5",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 13l2 2M14.5 4.5c3-1 5-1 5-1s0 2-1 5L12 15l-3-3 5.5-7.5zM15 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
};

export default function Roadmap({ steps }: { steps: Milestone[] }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setCur((c) => (c + 1) % steps.length), 5200);
    return () => window.clearTimeout(t);
  }, [cur, paused, steps.length]);

  const go = (i: number) => setCur((i + steps.length) % steps.length);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1); (listRef.current?.querySelectorAll("button")[(i + 1) % steps.length] as HTMLButtonElement | undefined)?.focus(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1); (listRef.current?.querySelectorAll("button")[(i - 1 + steps.length) % steps.length] as HTMLButtonElement | undefined)?.focus(); }
  };
  const s = steps[cur];

  return (
    <div className="rm" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="rm-track">
        <span className="rm-rail" aria-hidden="true"><i style={{ width: `${(cur / (steps.length - 1)) * 100}%` }} /></span>
        <ol className="rm-nodes" ref={listRef} role="tablist" aria-label="Journey milestones">
          {steps.map((m, i) => (
            <li key={m.title} className={`${i < cur ? "is-past" : ""} ${i === cur ? "is-on" : ""} ${m.next ? "is-next" : ""}`}>
              <button type="button" role="tab" aria-selected={i === cur} aria-controls="rm-panel" tabIndex={i === cur ? 0 : -1} onClick={() => go(i)} onKeyDown={(e) => onKey(e, i)}>
                <span className="rm-dot">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[m.icon]} /></svg>
                </span>
                <span className="rm-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="rm-tag">{m.tag}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="rm-panel" id="rm-panel" role="tabpanel" aria-live="polite" key={cur}>
        <div className="rm-panel-top">
          <span className="rm-step">{String(cur + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          {s.next && <span className="rm-badge">Next chapter</span>}
        </div>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <div className="rm-controls">
          <button type="button" onClick={() => go(cur - 1)} aria-label="Previous milestone">←</button>
          <span className="rm-progress" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i === cur ? "is-on" : ""} />)}</span>
          <button type="button" onClick={() => go(cur + 1)} aria-label="Next milestone">→</button>
        </div>
      </div>
    </div>
  );
}
