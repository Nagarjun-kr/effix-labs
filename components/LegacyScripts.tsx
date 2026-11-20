"use client";

import { useEffect } from "react";

// Loads the page's original (pre-Next.js) scripts once, in their original order,
// as classic scripts — exactly like the static site did. Pages navigate with plain
// <a> links (full page loads), so each page's scripts and CSS run in isolation.
const loaded = new Set<string>();

export default function LegacyScripts({ id, srcs }: { id: string; srcs: string[] }) {
  useEffect(() => {
    if (loaded.has(id)) return; // guard against React Strict Mode double-invoke in dev
    loaded.add(id);
    for (const src of srcs) {
      const s = document.createElement("script");
      s.src = src;
      s.async = false; // preserve execution order
      s.dataset.legacy = id;
      document.body.appendChild(s);
    }
  }, [id, srcs]);
  return null;
}
