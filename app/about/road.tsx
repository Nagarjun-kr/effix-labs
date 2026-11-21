"use client";

// Scroll-driven road journey: scrolling drives a car along a winding road; the camera follows it, the road
// lights up behind it, signposts switch on as it passes each milestone and a card tells that part of the story.
// Reduced motion: a simple list instead.
import { useEffect, useRef, useState } from "react";

export type Milestone = { tag: string; title: string; text: string; next?: boolean };

const W = 2600;
const H = 640;
const ROAD =
  "M -40 470 C 160 470, 260 250, 470 250 S 760 500, 980 470 S 1240 210, 1470 230 S 1760 500, 1980 460 S 2280 250, 2460 270 S 2620 330, 2700 330";
const TOP_BOTTOM = [80, 630]; // vertical extent of signs, trees and road
const AT = [0.08, 0.24, 0.4, 0.56, 0.72, 0.88]; // where each milestone sits along the road

export default function Road({ steps }: { steps: Milestone[] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [p, setP] = useState(0);
  const [car, setCar] = useState({ x: 0, y: 470, a: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0, s: 1 });
  const [signs, setSigns] = useState<{ x: number; y: number }[]>([]);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = path.current;
    if (!el || still) return;
    const len = el.getTotalLength();
    setSigns(AT.map((f) => { const q = el.getPointAtLength(f * len); return { x: q.x, y: q.y }; }));
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = section.current, st = stage.current;
      if (!sec || !st) return;
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      const f = 0.02 + prog * 0.9;
      const a = el.getPointAtLength(f * len);
      const b = el.getPointAtLength(Math.min(len, f * len + 2));
      const vw = st.clientWidth, vh = st.clientHeight;
      // fit the drawn part of the road (y 80..630) into the band between the heading and the story card
      const head = st.querySelector<HTMLElement>(".rd-head"), card = st.querySelector<HTMLElement>(".rd-card"), bar = st.querySelector<HTMLElement>(".rd-progress");
      const wide = vw >= 900;
      const headEnd = head ? head.offsetTop + head.offsetHeight : 120;
      const top = (wide ? Math.max(headEnd, (card?.offsetTop ?? 30) + 240) : headEnd) + 6;
      const bottom = wide ? (bar?.offsetTop ?? vh - 60) - 10 : vh - 340;
      const s = Math.min(1.1, Math.max(0.42, (bottom - top) / (TOP_BOTTOM[1] - TOP_BOTTOM[0])));
      const y = top + ((bottom - top) - (TOP_BOTTOM[1] - TOP_BOTTOM[0]) * s) / 2 - TOP_BOTTOM[0] * s;
      const x = Math.min(0, Math.max(vw - W * s, vw * 0.5 - a.x * s));
      setP(prog);
      setCar({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI });
      setPan({ x, y, s });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [still]);

  if (still) {
    return (
      <section className="rd-still" aria-labelledby="rd-t">
        <div className="ab-wrap">
          <span className="ab-label">The journey</span>
          <h2 id="rd-t">My journey, <em>mile by mile</em></h2>
          <ol>{steps.map((m, i) => <li key={m.title}><b>{String(i + 1).padStart(2, "0")} · {m.tag}</b><h3>{m.title}</h3><p>{m.text}</p></li>)}</ol>
        </div>
      </section>
    );
  }

  const fNow = 0.02 + p * 0.9;
  const active = Math.max(0, AT.reduce((acc, f, i) => (fNow + 0.015 >= f ? i : acc), 0));
  const m = steps[active];

  return (
    <section className="rd" ref={section} aria-labelledby="rd-t" style={{ height: `${steps.length * 85 + 60}vh` }}>
      <div className="rd-stage" ref={stage}>
        <div className="rd-sky" aria-hidden="true" />
        <div className="rd-hills far" aria-hidden="true" style={{ transform: `translateX(${pan.x * 0.18}px)` }} />
        <div className="rd-hills near" aria-hidden="true" style={{ transform: `translateX(${pan.x * 0.38}px)` }} />

        <div className="rd-head">
          <span className="ab-label">The journey</span>
          <h2 id="rd-t">My journey, <em>mile by mile</em></h2>
        </div>

        <div className="rd-world" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${pan.s})`, width: W, height: H }}>
          <svg className="rd-svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true">
            <defs>
              <linearGradient id="rdLit" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#7c5cf0" /><stop offset="1" stopColor="#a3e635" /></linearGradient>
              <filter id="rdGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
            </defs>
            {/* trees along the road */}
            {[120, 380, 700, 880, 1150, 1330, 1640, 1860, 2140, 2360].map((x, i) => (
              <g key={x} className="rd-tree" transform={`translate(${x} ${i % 2 ? 130 : 560})`}>
                <ellipse cx="0" cy="26" rx="22" ry="6" fill="rgba(60,80,60,0.12)" />
                <circle cx="0" cy="0" r={i % 3 ? 22 : 28} fill={i % 2 ? "#b9dca0" : "#a7d18a"} />
                <circle cx="-8" cy="-6" r="10" fill="rgba(255,255,255,0.35)" />
              </g>
            ))}
            {/* road: shoulder, asphalt, lit trail, centre dashes */}
            <path d={ROAD} fill="none" stroke="#e7e3dc" strokeWidth="98" strokeLinecap="round" />
            <path d={ROAD} fill="none" stroke="#ffffff" strokeWidth="86" strokeLinecap="round" />
            <path ref={path} d={ROAD} fill="none" stroke="#2d2f36" strokeWidth="78" strokeLinecap="round" />
            <path d={ROAD} fill="none" stroke="url(#rdLit)" strokeWidth="78" strokeLinecap="round" opacity="0.28" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fNow} />
            <path d={ROAD} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeDasharray="26 22" />
            <path d={ROAD} fill="none" stroke="url(#rdLit)" strokeWidth="5" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fNow} filter="url(#rdGlow)" opacity="0.9" />

            {/* signposts */}
            {signs.map((s, i) => {
              const on = fNow + 0.015 >= AT[i];
              const up = i % 2 === 0;
              const bw = Math.max(172, (steps[i]?.tag.length ?? 0) * 9 + 40);
              return (
                <g key={i} className={`rd-sign ${on ? "is-on" : ""} ${i === active ? "is-here" : ""}`} transform={`translate(${s.x} ${s.y})`}>
                  <circle r="16" className="rd-sign-dot" />
                  <circle r="6" fill="#fff" />
                  <line x1="0" y1={up ? -18 : 18} x2="0" y2={up ? -88 : 88} className="rd-sign-post" />
                  <g transform={`translate(0 ${up ? -118 : 118})`}>
                    <rect x={-bw / 2} y="-24" width={bw} height="48" rx="12" className="rd-sign-board" />
                    <text x="0" y="-3" textAnchor="middle" className="rd-sign-num">{String(i + 1).padStart(2, "0")}</text>
                    <text x="0" y="15" textAnchor="middle" className="rd-sign-tag">{steps[i]?.tag}</text>
                  </g>
                </g>
              );
            })}

            {/* the car */}
            <g transform={`translate(${car.x} ${car.y}) rotate(${car.a})`} className="rd-car">
              <path d="M 22 -10 L 120 -48 L 120 48 L 22 10 Z" fill="url(#rdBeam)" opacity="0.5" />
              <defs><linearGradient id="rdBeam" x1="0" x2="1"><stop offset="0" stopColor="#fef9c3" stopOpacity="0.9" /><stop offset="1" stopColor="#fef9c3" stopOpacity="0" /></linearGradient></defs>
              <ellipse cx="0" cy="3" rx="30" ry="18" fill="rgba(0,0,0,0.35)" filter="url(#rdGlow)" />
              <rect x="-26" y="-15" width="52" height="30" rx="10" fill="#7c5cf0" />
              <rect x="-26" y="-15" width="52" height="30" rx="10" fill="url(#rdLit)" opacity="0.35" />
              <rect x="2" y="-11" width="13" height="22" rx="4" fill="#1e1b4b" opacity="0.85" />
              <rect x="-18" y="-11" width="11" height="22" rx="4" fill="#1e1b4b" opacity="0.7" />
              <circle cx="24" cy="-9" r="3" fill="#fef08a" /><circle cx="24" cy="9" r="3" fill="#fef08a" />
              <circle cx="-25" cy="-9" r="2.5" fill="#f87171" /><circle cx="-25" cy="9" r="2.5" fill="#f87171" />
            </g>
          </svg>
        </div>

        <div className="rd-card" key={active} aria-live="polite">
          <div className="rd-card-top"><span>{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>{m.next && <em>Next chapter</em>}</div>
          <h3>{m.title}</h3>
          <p>{m.text}</p>
        </div>

        <div className="rd-progress" aria-hidden="true">
          <span className="rd-progress-bar"><i style={{ width: `${p * 100}%` }} /></span>
          <ol>{steps.map((s, i) => <li key={s.title} className={i <= active ? "is-on" : ""} style={{ left: `${((AT[i] - 0.02) / 0.9) * 100}%` }}><i />{s.tag}</li>)}</ol>
        </div>
        <span className={`rd-hint ${p > 0.03 ? "is-gone" : ""}`} aria-hidden="true">Scroll to drive ↓</span>
      </div>
    </section>
  );
}
