"use client";

// A thin dark line along the bottom of the nav bar that fills from left to right as you read.
// With `until`, it is full when the bottom of that element (e.g. the end of the post's FAQs) reaches the bottom of
// the screen, then fades away as you scroll on. Without it, it follows the whole page.
import { useEffect, useRef } from "react";

export default function ReadingLine({ until }: { until?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const target = until ? document.querySelector<HTMLElement>(until) : null;
      const end = target ? target.getBoundingClientRect().bottom + window.scrollY - vh : document.documentElement.scrollHeight - vh;
      const p = end > 0 ? Math.min(1, Math.max(0, window.scrollY / end)) : 1;
      bar.current?.style.setProperty("transform", `scaleX(${p})`);
      // finished reading: let it fade once you scroll a little past the end
      wrap.current?.classList.toggle("is-done", Boolean(target) && window.scrollY > end + 80);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [until]);
  return <span ref={wrap} className="bl-readline" aria-hidden="true"><i ref={bar} /></span>;
}
