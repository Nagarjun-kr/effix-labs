"use client";

// Blog banner in the style of the Reddit service page's cinematic card, in Effix colours: copy on the left, a CSS 3D
// scene on the right (floating Effix badge, clouds, chips, sphere, cone) that tilts gently with the pointer.
import { useRef } from "react";

export default function BlogBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };
  const reset = () => { ref.current?.style.setProperty("--mx", "0"); ref.current?.style.setProperty("--my", "0"); };
  return (
    <div className="bb" ref={ref} onPointerMove={move} onPointerLeave={reset}>
      <div className="bb-copy">
        <span className="bb-kicker">The Effix Labs blog</span>
        <h1 className="bb-title"><span>Learn how to get found.</span><br /><strong>READ THE PLAYBOOK.</strong></h1>
        <p className="bb-sub"><b>Practical guides on Google, communities and AI search.</b> Clear steps, real evidence, no shortcuts.</p>
        <a href="#guides" className="bb-btn">
          Browse guides
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </a>
      </div>
      <div className="bb-scene" aria-hidden="true">
        <span className="bb-cloud c1"><i /><i /><i /></span>
        <span className="bb-cloud c2"><i /><i /><i /></span>
        <span className="bb-cloud c3"><i /><i /><i /></span>
        <span className="bb-badge">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" /><path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
        </span>
        <span className="bb-shadow" />
        <span className="bb-chip a"><b>▲</b> New guide every week</span>
        <span className="bb-chip b"><b>✓</b> Practical, no fluff</span>
        <span className="bb-sphere" />
        <span className="bb-cone" />
      </div>
    </div>
  );
}
