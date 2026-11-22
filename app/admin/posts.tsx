"use client";

// Posts screen (WordPress "All Posts"): status tabs with counts, search, category filter, and Edit / View / Delete.
import { useMemo, useState } from "react";

import { CATEGORIES, categoryOf } from "@/lib/blog-categories";
import { statusOf, type Status } from "@/lib/cms/post";
import type { PostRef } from "@/lib/cms/store";

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");
const LABEL: Record<Status, string> = { draft: "Draft", scheduled: "Scheduled", published: "Published" };

export default function PostsList({ posts, loading, onNew, onEdit, onDelete }: { posts: PostRef[]; loading: boolean; onNew: () => void; onEdit: (r: PostRef) => void; onDelete: (r: PostRef) => void }) {
  const [tab, setTab] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const counts = useMemo(() => {
    const c = { all: posts.length, published: 0, scheduled: 0, draft: 0 };
    posts.forEach((p) => { c[statusOf(p.post)]++; });
    return c;
  }, [posts]);
  const shown = posts
    .filter((p) => tab === "all" || statusOf(p.post) === tab)
    .filter((p) => !cat || p.post.category === cat)
    .filter((p) => !q.trim() || `${p.post.title} ${p.slug} ${p.post.tags.join(" ")}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => +new Date(b.post.date || 0) - +new Date(a.post.date || 0));

  return (
    <div className="cm-posts">
      <div className="cm-posts-head">
        <h1>Posts</h1>
        <button type="button" className="cm-primary" onClick={onNew}>+ Add new post</button>
      </div>
      <div className="cm-filters">
        <div className="cm-status-tabs" role="tablist">
          {(["all", "published", "scheduled", "draft"] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
              {t === "all" ? "All" : t === "draft" ? "Drafts" : LABEL[t]} <span>{counts[t]}</span>
            </button>
          ))}
        </div>
        <span className="cm-filter-tools">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category">
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <input type="search" placeholder="Search posts…" value={q} onChange={(e) => setQ(e.target.value)} />
        </span>
      </div>

      {loading ? (
        <p className="cm-empty">Loading posts…</p>
      ) : shown.length === 0 ? (
        <div className="cm-empty">
          {posts.length === 0 ? (
            <>
              <b>No posts yet.</b>
              <p>Write your first post: click “Add new post”.</p>
              <button type="button" className="cm-primary" onClick={onNew}>+ Add new post</button>
            </>
          ) : (
            <p>No posts match these filters.</p>
          )}
        </div>
      ) : (
        <table className="cm-table">
          <thead>
            <tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th aria-label="Actions" /></tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const st = statusOf(r.post);
              return (
                <tr key={r.slug}>
                  <td>
                    <button type="button" className="cm-row-title" onClick={() => onEdit(r)}>
                      {r.post.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.post.cover} alt={r.post.coverAlt || r.post.title} />
                      ) : (
                        <i className={`cm-thumb is-${r.post.category}`} />
                      )}
                      <span><b>{r.post.title || "(no title)"}</b><small>/blog/{r.slug}</small></span>
                    </button>
                  </td>
                  <td>{categoryOf(r.post.category).name}</td>
                  <td><span className={`cm-pill is-${st}`}>{LABEL[st]}</span></td>
                  <td>{st === "scheduled" ? `Goes live ${fmt(r.post.date)}` : fmt(r.post.date)}</td>
                  <td className="cm-row-actions">
                    <button type="button" onClick={() => onEdit(r)}>Edit</button>
                    {st === "published" && <a href={`/blog/${r.slug}`} target="_blank" rel="noopener noreferrer">View</a>}
                    <button type="button" className="is-danger" onClick={() => onDelete(r)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
