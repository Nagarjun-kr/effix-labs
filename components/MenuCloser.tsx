"use client";

// Closes the mobile <details> menu (app/about/chrome.tsx) on Escape, on a tap outside it, and after a link inside
// it is followed, and returns focus to the menu button when closed with Escape.
import { useEffect } from "react";

export default function MenuCloser() {
  useEffect(() => {
    const menu = () => document.querySelector<HTMLDetailsElement>("details.ab-menu");
    const onKey = (e: KeyboardEvent) => {
      const m = menu();
      if (e.key === "Escape" && m?.open) { m.open = false; m.querySelector("summary")?.focus(); }
    };
    const onClick = (e: MouseEvent) => {
      const m = menu();
      if (!m?.open) return;
      const target = e.target as Node;
      if (!m.contains(target) || (target as Element).closest?.("nav a")) m.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, []);
  return null;
}
