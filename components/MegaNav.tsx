"use client";

// Desktop navigation with full-width mega menus for Services and Work (pattern studied from promptarmor.com):
// hovering a menu item fills it with colour, the header turns solid, and one full-width panel drops down under the
// header with the links laid out side by side; the page behind dims. Moving between Services and Work slides the
// content sideways and resizes the panel height. Opens on hover (short close delay), on focus and on tap; Escape
// closes. Mobile menus are separate and unchanged.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import AppIcon from "@/lib/discover/app-icon";
import "./mega-nav.css";

type Key = "services" | "work";
const ORDER: Key[] = ["services", "work"];

function Tile({ children, tone = "violet" }: { children: React.ReactNode; tone?: "violet" | "lime" }) {
  return <span className={`mm-tile is-${tone}`} aria-hidden="true">{children}</span>;
}
const Svg = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const Item = ({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) => (
  <a href={href} className="mm-item" role="menuitem">
    {icon}
    <b>{title}</b>
    <small>{text}</small>
  </a>
);

function ServicesMenu() {
  return (
    <div className="mm-wrap">
      <p className="mm-label">What we do</p>
      <div className="mm-row five">
        <Item href="/services/google-business-profile" icon={<Tile><AppIcon name="Google" size={19} /></Tile>} title="Google Business Profile" text="Get found where local customers are searching." />
        <Item href="/services/reddit-marketing" icon={<Tile><AppIcon name="Reddit" size={19} /></Tile>} title="Reddit Marketing" text="Be part of the conversations that shape buying decisions." />
        <Item href="/services/seo-aeo-services" icon={<Tile><Svg d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3M8 11h6M11 8v6" /></Tile>} title="SEO & AEO" text="Rank on Google. Get cited in AI answers." />
        <Item href="/services/content-writing" icon={<Tile><Svg d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></Tile>} title="Content Writing" text="Content that ranks, reads well and turns readers into customers." />
        <Item href="/services/website-design-development" icon={<Tile><Svg d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" /></Tile>} title="Website Design & Development" text="Fast, mobile-first websites built to rank and convert." />
      </div>
    </div>
  );
}

function WorkMenu() {
  return (
    <div className="mm-wrap">
      <p className="mm-label">Our work</p>
      <div className="mm-row three">
        <Item href="/casestudy/" icon={<Tile tone="lime"><Svg d="M3 3v18h18M7 15l4-4 3 3 5-6" /></Tile>} title="Case Study" text="How Effix Labs went from zero visibility to steady growth." />
        <Item href="/seo-audit-tool/" icon={<Tile><Svg d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" /></Tile>} title="SEO Audit Platform" text="Free technical SEO, content and AI-readiness check (beta)." />
        <Item href="/blog" icon={<Tile><Svg d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /></Tile>} title="Blog" text="Practical guides on getting found on Google, Reddit and AI search." />
      </div>
    </div>
  );
}

export default function MegaNav({ current, hideBelow = 1000 }: { current?: "about" | "blog" | "work" | "services"; hideBelow?: 950 | 1000 }) {
  const [open, setOpen] = useState<Key | null>(null);
  const [shown, setShown] = useState(false); // panel visible (stays true while moving between menus)
  const [top, setTop] = useState(0); // header bottom, in viewport px
  const [height, setHeight] = useState(0);
  const [instant, setInstant] = useState(true); // first frame after opening: no height animation
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menus = useRef<Record<Key, HTMLDivElement | null>>({ services: null, work: null });
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setMounted(true), []);

  const measure = useCallback((key: Key | null) => {
    const header = navRef.current?.closest("header") ?? navRef.current;
    if (header) setTop(Math.round(header.getBoundingClientRect().bottom));
    const m = key ? menus.current[key] : null;
    if (m) setHeight(m.scrollHeight);
  }, []);

  const show = (key: Key) => {
    clearTimeout(closeTimer.current);
    if (!shown) setInstant(true);
    setOpen(key);
    setShown(true);
  };
  const hide = (delay = 140) => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => { setShown(false); setOpen(null); }, delay);
  };
  const cancelHide = () => clearTimeout(closeTimer.current);
  const outside = (to: EventTarget | null) => !navRef.current?.contains(to as Node) && !panelRef.current?.contains(to as Node);

  useLayoutEffect(() => { if (open) measure(open); }, [open, measure]);
  useEffect(() => {
    if (!instant || !shown) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    return () => cancelAnimationFrame(id);
  }, [instant, shown]);
  // solid header while a menu is open
  useEffect(() => {
    navRef.current?.closest("header")?.toggleAttribute("data-mm-open", shown);
  }, [shown]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setShown(false); setOpen(null); } };
    const onChange = () => { if (open) measure(open); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, { passive: true });
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onChange); window.removeEventListener("scroll", onChange); };
  }, [open, measure]);

  const Trigger = ({ k, href, label }: { k: Key; href: string; label: string }) => (
    <li>
      <a
        href={href}
        className={`mm-link mm-trigger ${open === k && shown ? "is-open" : ""}`}
        aria-haspopup="true"
        aria-expanded={open === k && shown}
        aria-current={current === k ? "page" : undefined}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") show(k); }}
        onFocus={() => show(k)}
        onClick={(e) => {
          // touch/pen: first tap opens the menu, second tap follows the link
          if (!(open === k && shown) && e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType !== "mouse") { e.preventDefault(); show(k); }
        }}
      >
        {label}
        <svg className="mm-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </a>
    </li>
  );

  const idx = open ? ORDER.indexOf(open) : -1;
  const panel = (
    <>
      <div className={`mm-dim ${shown ? "is-shown" : ""}`} style={{ top }} aria-hidden="true" onPointerEnter={() => hide(60)} onClick={() => hide(0)} />
      <div
        ref={panelRef}
        className={`mm-panel ${shown ? "is-shown" : ""} ${instant ? "is-instant" : ""}`}
        style={{ top, height: height || undefined }}
        onPointerEnter={cancelHide}
        onPointerLeave={(e) => { if (e.pointerType === "mouse" && outside(e.relatedTarget)) hide(); }}
        onFocus={cancelHide}
        onBlur={(e) => { if (outside(e.relatedTarget)) hide(0); }}
        role="menu"
        aria-hidden={!shown}
      >
        {ORDER.map((k, i) => (
          <div
            key={k}
            ref={(el) => { menus.current[k] = el; }}
            className={`mm-menu ${open === k ? "is-active" : i < idx ? "is-before" : "is-after"}`}
            aria-hidden={open !== k}
            inert={open !== k ? true : undefined}
          >
            {k === "services" ? <ServicesMenu /> : <WorkMenu />}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <nav
      ref={navRef}
      className={`mm mm-hide-${hideBelow}`}
      aria-label="Main"
      onPointerLeave={(e) => { if (e.pointerType === "mouse" && outside(e.relatedTarget)) hide(); }}
      onBlur={(e) => { if (outside(e.relatedTarget)) hide(0); }}
    >
      <ul className="mm-list">
        <li><a href="/about" className="mm-link" aria-current={current === "about" ? "page" : undefined} onPointerEnter={() => hide(90)}>About</a></li>
        <li><a href="/blog" className="mm-link" aria-current={current === "blog" ? "page" : undefined} onPointerEnter={() => hide(90)}>Blog</a></li>
        <Trigger k="services" href="/#services" label="Services" />
        <Trigger k="work" href="/casestudy/" label="Work" />
        <li><a href="/contact" className="mm-link" onPointerEnter={() => hide(90)}>Contact</a></li>
      </ul>
      {mounted ? createPortal(panel, document.body) : null}
    </nav>
  );
}
