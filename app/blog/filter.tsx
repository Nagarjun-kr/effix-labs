"use client";

// Category pills for the blog list. Every card stays in the HTML (good for SEO); a pill only hides the others.
import { useState } from "react";

type Topic = { slug: string; name: string; count: number };

export default function TopicFilter({ topics }: { topics: Topic[]; total: number }) {
  const [active, setActive] = useState("all");
  const pick = (slug: string) => {
    setActive(slug);
    let shown = 0;
    document.querySelectorAll<HTMLElement>(".bl-grid .bl-card").forEach((card) => {
      card.hidden = slug !== "all" && card.dataset.cat !== slug;
      if (!card.hidden) shown++;
    });
    const none = document.querySelector<HTMLElement>(".bl-grid ~ .bl-none");
    if (none) none.hidden = shown > 0;
  };
  return (
    <div className="bl-cats" role="group" aria-label="Filter posts by category">
      <button type="button" aria-pressed={active === "all"} onClick={() => pick("all")}>All</button>
      {topics.map((t) => (
        <button key={t.slug} type="button" aria-pressed={active === t.slug} onClick={() => pick(t.slug)}>{t.name}</button>
      ))}
    </div>
  );
}
