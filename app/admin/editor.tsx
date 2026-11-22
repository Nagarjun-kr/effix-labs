"use client";

// Post editor screen (WordPress "Edit Post"): title + visual editor in the middle; settings and SEO in the sidebar;
// Preview / Save draft / Publish in the top bar. Autosaves to this browser and warns before leaving unsaved work.
import { useEffect, useMemo, useRef, useState } from "react";

import { CATEGORIES, categoryOf } from "@/lib/blog-categories";
import { render } from "@/lib/blog-render";
import { emptyPost, isSlug, statusOf, toSlug, type EditorPost } from "@/lib/cms/post";
import { analyse, metaTitleOf } from "@/lib/cms/seo";
import { compressImage, type PostRef, type Store } from "@/lib/cms/store";
import { all, draftBlockers, FIELD_LABEL, LIMITS, validate, type Field, type Issue } from "@/lib/cms/validate";
import RichEditor from "./rich";

const DRAFT_KEY = (slug?: string) => `effix-cms:autosave:${slug ?? "new"}`;
const toLocalInput = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
};
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : "");
type Row = { field: Field; level: "error" | "warn"; text: string };
const SEO_FIELDS: Field[] = ["metaTitle", "description", "focusKeyword"];
/** Inline message(s) under a field: red for errors, orange for warnings. */
function Msg({ issues }: { issues?: Issue[] }) {
  if (!issues?.length) return null;
  return <>{issues.map((i) => <small key={i.text} className={`cm-msg is-${i.level}`} role={i.level === "error" ? "alert" : undefined}>{i.level === "error" ? "✕ " : "! "}{i.text}</small>)}</>;
}
const lvl = (issues?: Issue[]) => (issues?.some((i) => i.level === "error") ? "is-err" : issues?.length ? "is-warn" : "");
/** Live character counter. `over` = how serious going over the limit is (red error or orange warning). */
const Count = ({ n, max, min = 0, over = "err" }: { n: number; max: number; min?: number; over?: "err" | "warn" }) => <span className={`cm-count ${n > max ? `is-${over}` : n > 0 && n < min ? "is-warn" : ""}`}>{n}/{max}</span>;

const fmt = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

type Props = { store: Store; existing?: PostRef; allSlugs: string[]; onClose: () => void; onSaved: (ref: PostRef, previousSlug?: string) => void };

export default function PostEditor({ store, existing, allSlugs, onClose, onSaved }: Props) {
  const [post, setPost] = useState<EditorPost>(() => existing?.post ?? emptyPost());
  const [ref, setRef] = useState<PostRef | undefined>(existing);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [check, setCheck] = useState<null | { mode: "draft" | "publish"; errors: Row[]; warns: Row[] }>(null);
  const [showIssues, setShowIssues] = useState(false);
  const [tab, setTab] = useState<"post" | "seo">("post");
  const [preview, setPreview] = useState(false);
  const [restore, setRestore] = useState<EditorPost | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));
  // Like WordPress: only an already-scheduled post opens in "schedule" mode; drafts default to "publish immediately".
  const [schedule, setSchedule] = useState(Boolean(existing && !existing.post.draft && existing.post.date && new Date(existing.post.date).getTime() > Date.now()));
  const [tagDraft, setTagDraft] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EditorPost>(k: K, v: EditorPost[K]) => {
    setPost((p) => ({ ...p, [k]: v }));
    setDirty(true);
  };
  const seo = useMemo(() => analyse(post), [post]);
  const status = ref ? statusOf(ref.post) : "draft";
  const issues = useMemo(
    () => validate(post, { otherSlugs: allSlugs.filter((x) => x !== ref?.slug), publishedSlug: ref && !ref.post.draft ? ref.slug : undefined, schedule }),
    [post, allSlugs, ref, schedule],
  );
  const rows = all(issues) as Row[];
  const errCount = rows.filter((r) => r.level === "error").length;
  const warnCount = rows.length - errCount;
  /** Jump to a field: open the right sidebar tab, scroll to it and focus it. */
  const jump = (f: Field) => {
    setCheck(null);
    if (f !== "title" && f !== "body") setTab(SEO_FIELDS.includes(f) ? "seo" : "post");
    setTimeout(() => {
      const el = document.getElementById(`cm-f-${f}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el?.matches("input,textarea,select,button") ? el : el?.querySelector<HTMLElement>("input,textarea,.ProseMirror"))?.focus({ preventScroll: true });
    }, 60);
  };
  const outline = useMemo(() => [...post.body.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => ({ level: m[1].length, text: m[2].replace(/[*_`]/g, "") })), [post.body]);

  // autosave to this browser; offer to restore it next time
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY(existing?.slug));
      if (saved) {
        const p = JSON.parse(saved) as EditorPost;
        if (JSON.stringify(p) !== JSON.stringify(existing?.post ?? emptyPost())) setRestore(p);
      }
    } catch { /* storage unavailable */ }
  }, [existing]);
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY(existing?.slug), JSON.stringify(post)); } catch { /* ignore */ } }, 800);
    return () => clearTimeout(t);
  }, [post, dirty, existing]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // slug follows the title for new posts until edited by hand
  useEffect(() => {
    if (!slugTouched) setPost((p) => ({ ...p, slug: toSlug(p.title) }));
  }, [post.title, slugTouched]);

  const uploadImage = async (file: File, base: string) => {
    if (file.size > 15 * 1024 * 1024) throw new Error("That image is larger than 15 MB.");
    const { blob, ext } = await compressImage(file);
    const name = `${(toSlug(base) || "image").slice(0, 50)}-${Date.now().toString(36)}.${ext}`;
    return store.upload(blob, name);
  };

  /** Draft: needs a title and a valid slug. Publish: errors block; warnings ask "publish anyway?". */
  const save = async (mode: "draft" | "publish", force = false) => {
    if (mode === "draft") {
      const blockers = draftBlockers(issues) as Row[];
      if (blockers.length) { setCheck({ mode, errors: blockers, warns: [] }); return; }
    } else if (!force) {
      const errs = rows.filter((r) => r.level === "error"), warns = rows.filter((r) => r.level === "warn");
      if (errs.length || warns.length) { setCheck({ mode, errors: errs, warns }); return; }
    }
    setCheck(null);
    setBusy(mode === "draft" ? "Saving draft…" : "Publishing…");
    setNote(null);
    try {
      const next: EditorPost = { ...post, draft: mode === "draft", date: schedule ? post.date : post.date && ref && !ref.post.draft ? post.date : mode === "publish" ? new Date().toISOString() : post.date };
      const previousSlug = ref?.slug;
      const saved = await store.save(next, ref);
      setPost(saved.post);
      setRef(saved);
      setDirty(false);
      setSlugTouched(true);
      try { localStorage.removeItem(DRAFT_KEY(existing?.slug)); localStorage.removeItem(DRAFT_KEY(saved.slug)); } catch { /* ignore */ }
      const st = statusOf(saved.post);
      const live = store.kind === "github" ? " It will be live on effixlabs.in in about 2–3 minutes." : " Open the blog on this computer to see it.";
      setNote({ kind: "ok", text: st === "draft" ? "Draft saved." : st === "scheduled" ? `Scheduled for ${fmt(saved.post.date)}.` : `Published.${live}` });
      onSaved(saved, previousSlug);
    } catch (e) {
      setNote({ kind: "err", text: (e as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const del = async () => {
    if (!ref || !window.confirm(`Delete “${post.title || ref.slug}”? This removes the post from the site.`)) return;
    setBusy("Deleting…");
    try {
      await store.remove(ref);
      try { localStorage.removeItem(DRAFT_KEY(ref.slug)); } catch { /* ignore */ }
      setDirty(false);
      onClose();
    } catch (e) {
      setNote({ kind: "err", text: (e as Error).message });
      setBusy(null);
    }
  };

  const publishLabel = schedule && post.date && new Date(post.date).getTime() > Date.now() ? "Schedule" : ref && !ref.post.draft ? "Update" : "Publish";
  const titleShown = metaTitleOf(post);
  const descShown = post.description.trim() || "Write a meta description: it appears here in Google results and on the blog card.";
  const tl = titleShown.length, dl = post.description.trim().length;
  const meter = (n: number, lo: number, hi: number, max: number) => ({ width: `${Math.min(100, (n / max) * 100)}%`, background: n === 0 ? "#e5e3ee" : n >= lo && n <= hi ? "#8cc651" : n > hi ? "#e8833a" : "#f2c94c" });

  return (
    <div className="cm-edit">
      {/* top bar */}
      <header className="cm-bar">
        <button type="button" className="cm-ghost" onClick={() => { if (!dirty || window.confirm("Leave without saving your changes?")) onClose(); }}>← Posts</button>
        <span className={`cm-pill is-${status}`}>{status === "draft" ? "Draft" : status === "scheduled" ? "Scheduled" : "Published"}</span>
        <span className="cm-saved">{busy ?? (dirty ? "Unsaved changes (autosaved in this browser)" : ref ? "All changes saved" : "New post")}</span>
        <span className="cm-bar-actions">
          <button type="button" className="cm-ghost" onClick={() => setPreview(true)}>Preview</button>
          <button type="button" className="cm-ghost" disabled={Boolean(busy)} onClick={() => save("draft")}>{ref && !ref.post.draft ? "Switch to draft" : "Save draft"}</button>
          <button type="button" className="cm-primary" disabled={Boolean(busy)} onClick={() => save("publish")}>{publishLabel}</button>
        </span>
      </header>

      {restore && (
        <div className="cm-banner">
          You have unsaved changes from earlier in this browser.
          <button type="button" onClick={() => { setPost(restore); setDirty(true); setSlugTouched(true); setRestore(null); }}>Restore them</button>
          <button type="button" className="is-quiet" onClick={() => { setRestore(null); try { localStorage.removeItem(DRAFT_KEY(existing?.slug)); } catch { /* ignore */ } }}>Discard</button>
        </div>
      )}
      {note && <div className={`cm-note is-${note.kind}`} role="status">{note.text}{note.kind === "ok" && status !== "draft" && ref && <a href={`/blog/${ref.slug}`} target="_blank" rel="noopener noreferrer">View post ↗</a>}</div>}
      <div className={`cm-summary ${errCount ? "is-err" : warnCount ? "is-warn" : "is-ok"}`}>
        <button type="button" onClick={() => setShowIssues((v) => !v)} aria-expanded={showIssues}>
          {errCount ? <b>✕ {errCount} error{errCount > 1 ? "s" : ""}</b> : null}
          {warnCount ? <b>! {warnCount} warning{warnCount > 1 ? "s" : ""}</b> : null}
          {!rows.length && <b>✓ No problems found</b>}
          {rows.length > 0 && <span>{showIssues ? "Hide" : "Show"} details</span>}
        </button>
        {showIssues && rows.length > 0 && (
          <ul>{rows.map((r) => <li key={r.field + r.text} className={`is-${r.level}`}><button type="button" onClick={() => jump(r.field)}><b>{FIELD_LABEL[r.field]}:</b> {r.text}</button></li>)}</ul>
        )}
      </div>

      <div className="cm-layout">
        {/* writing area */}
        <main className="cm-canvas">
          <textarea
            id="cm-f-title"
            className={`cm-title ${lvl(issues.title)}`}
            rows={1}
            placeholder="Add title"
            value={post.title}
            onChange={(e) => { set("title", e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
            onFocus={(e) => { e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
          />
          <div className="cm-title-meta"><Count n={post.title.trim().length} max={LIMITS.title} over="warn" /><Msg issues={issues.title} /></div>
          <p className="cm-permalink">effixlabs.in/blog/<b>{post.slug || "your-post-url"}</b> <button type="button" onClick={() => { setTab("post"); document.getElementById("cm-f-slug")?.focus(); }}>Edit</button></p>
          <div id="cm-f-body" className={`cm-body ${lvl(issues.body)}`}>
          <RichEditor
            value={post.body}
            onChange={(md) => set("body", md)}
            onImage={async (file) => {
              try {
                const alt = window.prompt("Describe this image (alt text, for Google and screen readers):", "") ?? "";
                setBusy("Uploading image…");
                const src = await uploadImage(file, post.slug || post.title || "image");
                return { src, alt };
              } catch (e) {
                setNote({ kind: "err", text: (e as Error).message });
                return null;
              } finally {
                setBusy(null);
              }
            }}
          />
          </div>
          <Msg issues={issues.body} />
          <p className="cm-stats">{seo.words} words · {seo.minutes} min read · {outline.length} headings</p>
        </main>

        {/* sidebar */}
        <aside className="cm-side">
          <div className="cm-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === "post"} onClick={() => setTab("post")}>Post</button>
            <button type="button" role="tab" aria-selected={tab === "seo"} onClick={() => setTab("seo")}>SEO <span className={`cm-score ${seo.score >= 80 ? "is-good" : seo.score >= 50 ? "is-ok" : "is-bad"}`}>{seo.score}</span></button>
          </div>

          {tab === "post" ? (
            <div className="cm-panels">
              <section className="cm-panel">
                <h3>Status &amp; publish</h3>
                <p className="cm-row"><span>Status</span><b>{status === "draft" ? "Draft" : status === "scheduled" ? `Scheduled · ${fmt(ref!.post.date)}` : `Published · ${fmt(ref!.post.date)}`}</b></p>
                <label className="cm-radio"><input type="radio" checked={!schedule} onChange={() => { setSchedule(false); setDirty(true); }} /> Publish immediately</label>
                <label className="cm-radio"><input type="radio" checked={schedule} onChange={() => { setSchedule(true); setDirty(true); }} /> Schedule for a date</label>
                {schedule && <input id="cm-f-date" type="datetime-local" className={`cm-input ${lvl(issues.date)}`} value={toLocalInput(post.date)} onChange={(e) => set("date", fromLocalInput(e.target.value))} />}
                <Msg issues={issues.date} />
                {schedule && <small className="cm-hint">Scheduled posts go live with the daily rebuild (6:00 am IST) on or after this date.</small>}
                {ref && !ref.post.draft && (
                  <label className="cm-check"><input type="checkbox" checked={Boolean(post.updated)} onChange={(e) => set("updated", e.target.checked ? new Date().toISOString() : "")} /> Show “Updated” date (use for real updates)</label>
                )}
              </section>

              <section className="cm-panel">
                <h3>URL slug</h3>
                <input id="cm-f-slug" className={`cm-input ${lvl(issues.slug)}`} value={post.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")); }} placeholder="google-crawled-but-not-indexed-fix" />
                <small className="cm-hint">effixlabs.in/blog/{post.slug || "…"} <Count n={post.slug.length} max={LIMITS.slug} over="warn" /></small>
                <Msg issues={issues.slug} />
              </section>

              <section className="cm-panel">
                <h3>Category</h3>
                {CATEGORIES.map((c) => (
                  <label key={c.slug} className="cm-radio"><input type="radio" name="cat" checked={post.category === c.slug} onChange={() => set("category", c.slug)} /> {c.name}</label>
                ))}
              </section>

              <section className="cm-panel">
                <h3>Tags</h3>
                <div id="cm-f-tags" className={`cm-tags ${lvl(issues.tags)}`}>
                  {post.tags.map((t) => <span key={t}>{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => set("tags", post.tags.filter((x) => x !== t))}>×</button></span>)}
                  <input
                    value={tagDraft}
                    placeholder={post.tags.length ? "Add another…" : "Type a keyword, press Enter"}
                    onChange={(e) => setTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && tagDraft.trim()) {
                        e.preventDefault();
                        const t = tagDraft.trim().replace(/,$/, "");
                        if (!post.tags.includes(t)) set("tags", [...post.tags, t]);
                        setTagDraft("");
                      } else if (e.key === "Backspace" && !tagDraft && post.tags.length) set("tags", post.tags.slice(0, -1));
                    }}
                  />
                </div>
                <small className="cm-hint">Your primary and secondary keywords. <Count n={post.tags.length} max={LIMITS.tags} over="warn" /></small>
                <Msg issues={issues.tags} />
              </section>

              <section className="cm-panel" id="cm-f-cover">
                <h3>Featured image</h3>
                {post.cover ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="cm-cover" src={post.cover} alt={post.coverAlt || "Featured image"} />
                    <input id="cm-f-coverAlt" className={`cm-input ${lvl(issues.coverAlt)}`} placeholder="Alt text: describe the image" value={post.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} />
                    <small className="cm-hint">Alt text <Count n={post.coverAlt.trim().length} max={LIMITS.alt} over="warn" /></small>
                    <Msg issues={issues.coverAlt} />
                    <Msg issues={issues.cover} />
                    <span className="cm-inline">
                      <button type="button" className="cm-link" onClick={() => coverRef.current?.click()}>Replace</button>
                      <button type="button" className="cm-link is-danger" onClick={() => { set("cover", ""); set("coverAlt", ""); }}>Remove</button>
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    className="cm-drop"
                    onClick={() => coverRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setBusy("Uploading image…"); try { set("cover", await uploadImage(f, `${post.slug || "post"}-cover`)); } catch (err) { setNote({ kind: "err", text: (err as Error).message }); } finally { setBusy(null); } } }}
                  >
                    <b>Set featured image</b>
                    <small>Click or drop an image. It is resized and converted to WebP automatically. Without one, a cover is generated in the Effix colours.</small>
                  </button>
                )}
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    setBusy("Uploading image…");
                    try { set("cover", await uploadImage(f, `${post.slug || "post"}-cover`)); } catch (err) { setNote({ kind: "err", text: (err as Error).message }); } finally { setBusy(null); }
                  }}
                />
              </section>

              <section className="cm-panel">
                <h3>Author</h3>
                <input id="cm-f-author" className={`cm-input ${lvl(issues.author)}`} value={post.author} onChange={(e) => set("author", e.target.value)} />
                <Msg issues={issues.author} />
              </section>

              <section className="cm-panel">
                <h3 id="cm-f-takeaways">Key takeaways</h3>
                <small className="cm-hint">Optional. 3 short bullets shown in a box at the top of the post.</small>
                {post.takeaways.map((t, i) => (
                  <div key={i}>
                    <span className="cm-listrow">
                      <input className={`cm-input ${lvl(issues.takeawayItems?.[i])}`} value={t} onChange={(e) => set("takeaways", post.takeaways.map((x, j) => (j === i ? e.target.value : x)))} />
                      <button type="button" aria-label="Remove takeaway" onClick={() => set("takeaways", post.takeaways.filter((_, j) => j !== i))}>×</button>
                    </span>
                    <Msg issues={issues.takeawayItems?.[i]} />
                  </div>
                ))}
                <Msg issues={issues.takeaways?.filter((x) => x.level === "warn")} />
                <button type="button" className="cm-link" onClick={() => set("takeaways", [...post.takeaways, ""])}>+ Add takeaway</button>
              </section>

              <section className="cm-panel">
                <h3 id="cm-f-faq">FAQs</h3>
                <small className="cm-hint">Shown at the end of the post and sent to Google as FAQ schema. Keep answers to 40–60 words.</small>
                {post.faq.map((f, i) => (
                  <div key={i} className={`cm-faq ${lvl(issues.faqItems?.[i])}`}>
                    <span className="cm-faq-head">
                      <b>Q{i + 1}</b>
                      <span>
                        <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => { const a = [...post.faq]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set("faq", a); }}>↑</button>
                        <button type="button" aria-label="Move down" disabled={i === post.faq.length - 1} onClick={() => { const a = [...post.faq]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; set("faq", a); }}>↓</button>
                        <button type="button" aria-label="Remove question" onClick={() => set("faq", post.faq.filter((_, j) => j !== i))}>×</button>
                      </span>
                    </span>
                    <input className="cm-input" placeholder="Question" value={f.q} onChange={(e) => set("faq", post.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
                    <textarea className="cm-input" rows={3} placeholder="Answer" value={f.a} onChange={(e) => set("faq", post.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} />
                    <Msg issues={issues.faqItems?.[i]} />
                  </div>
                ))}
                <button type="button" className="cm-link" onClick={() => set("faq", [...post.faq, { q: "", a: "" }])}>+ Add question</button>
              </section>

              <section className="cm-panel">
                <h3 id="cm-f-sources">Sources</h3>
                <small className="cm-hint">Optional. Listed at the end as “Sources reviewed {"<date>"}: …”. Cite official pages (e.g. Google Search Central).</small>
                {post.sources.map((x, i) => (
                  <div key={i} className={`cm-faq ${lvl(issues.sourceItems?.[i])}`}>
                    <span className="cm-faq-head">
                      <b>Source {i + 1}</b>
                      <span><button type="button" aria-label="Remove source" onClick={() => set("sources", post.sources.filter((_, j) => j !== i))}>×</button></span>
                    </span>
                    <input className="cm-input" placeholder="Name, e.g. Google: Page indexing report" value={x.label} onChange={(e) => set("sources", post.sources.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)))} />
                    <input className="cm-input" placeholder="https://…" inputMode="url" value={x.url} onChange={(e) => set("sources", post.sources.map((y, j) => (j === i ? { ...y, url: e.target.value } : y)))} />
                    <Msg issues={issues.sourceItems?.[i]} />
                  </div>
                ))}
                <button type="button" className="cm-link" onClick={() => set("sources", [...post.sources, { label: "", url: "" }])}>+ Add source</button>
              </section>

              {outline.length > 0 && (
                <section className="cm-panel">
                  <h3>Outline</h3>
                  <ol className="cm-outline">{outline.map((h, i) => <li key={i} className={h.level === 3 ? "is-sub" : ""}>{h.text}</li>)}</ol>
                </section>
              )}

              {ref && (
                <section className="cm-panel">
                  <button type="button" className="cm-link is-danger" onClick={del}>Delete this post</button>
                </section>
              )}
            </div>
          ) : (
            <div className="cm-panels">
              <section className="cm-panel">
                <div className="cm-seo-head">
                  <span className={`cm-ring ${seo.score >= 80 ? "is-good" : seo.score >= 50 ? "is-ok" : "is-bad"}`} style={{ ["--v" as string]: `${seo.score}%` }}><b>{seo.score}</b></span>
                  <span><b>{seo.score >= 80 ? "Good to publish" : seo.score >= 50 ? "Almost there" : "Needs work"}</b><small>{seo.checks.filter((c) => c.status === "good").length} of {seo.checks.length} checks passed</small></span>
                </div>
              </section>

              <section className="cm-panel">
                <h3>Focus keyword</h3>
                <input id="cm-f-focusKeyword" className={`cm-input ${lvl(issues.focusKeyword)}`} placeholder="e.g. Google crawled but not indexed" value={post.focusKeyword} onChange={(e) => set("focusKeyword", e.target.value)} />
                <Msg issues={issues.focusKeyword} />
                <small className="cm-hint">The main search phrase this post should rank for. Not shown on the site.</small>
              </section>

              <section className="cm-panel">
                <h3>Google preview</h3>
                <div className="cm-serp">
                  <span className="cm-serp-site"><i>E</i><span><b>Effix Labs</b><small>effixlabs.in › blog › {post.slug || "…"}</small></span></span>
                  <span className="cm-serp-title">{titleShown.length > 62 ? `${titleShown.slice(0, 60)}…` : titleShown || "Your meta title"}</span>
                  <span className="cm-serp-desc">{descShown.length > 160 ? `${descShown.slice(0, 157)}…` : descShown}</span>
                </div>
                <label className="cm-label" htmlFor="cm-f-metaTitle">Meta title <Count n={post.metaTitle.trim().length} max={LIMITS.metaTitleMax} min={LIMITS.metaTitleMin} /></label>
                <input id="cm-f-metaTitle" className={`cm-input ${lvl(issues.metaTitle)}`} placeholder={post.title ? `${post.title} | Effix Labs` : "Google Crawled but Not Indexed? 7 Fixes | Effix Labs"} value={post.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
                <span className="cm-meter"><i style={meter(tl, 30, 60, 70)} /></span>
                <Msg issues={issues.metaTitle} />
                {!post.metaTitle.trim() && post.title.trim() && (
                  <button type="button" className="cm-link" onClick={() => set("metaTitle", `${post.title.trim()} | Effix Labs`)}>Use “{post.title.trim()} | Effix Labs”</button>
                )}
                <label className="cm-label" htmlFor="cm-f-description">Meta description <Count n={dl} max={LIMITS.descMax} min={LIMITS.descMin} /></label>
                <textarea id="cm-f-description" className={`cm-input ${lvl(issues.description)}`} rows={4} placeholder="One or two sentences shown in Google and on the blog card." value={post.description} onChange={(e) => set("description", e.target.value)} />
                <span className="cm-meter"><i style={meter(dl, 120, 158, 175)} /></span>
                <Msg issues={issues.description} />
              </section>

              <section className="cm-panel">
                <h3>SEO checklist</h3>
                <ul className="cm-checks">
                  {seo.checks.map((c) => (
                    <li key={c.label} className={`is-${c.status}`}><i aria-hidden="true" /><span><b>{c.label}</b>{c.status !== "good" && <small>{c.tip}</small>}</span></li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </aside>
      </div>

      {/* publish check: errors block, warnings ask */}
      {check && (
        <div className="cm-modal" role="dialog" aria-modal="true" aria-labelledby="cm-check-t">
          <div className="cm-modal-box">
            <h2 id="cm-check-t">{check.errors.length ? (check.mode === "draft" ? "Can't save the draft yet" : "Fix these before publishing") : "Publish with these warnings?"}</h2>
            {check.errors.length > 0 && (
              <ul className="cm-modal-list">{check.errors.map((r) => <li key={r.field + r.text} className="is-error"><button type="button" onClick={() => jump(r.field)}><b>✕ {FIELD_LABEL[r.field]}</b><span>{r.text}</span></button></li>)}</ul>
            )}
            {check.warns.length > 0 && (
              <>
                {check.errors.length > 0 && <p className="cm-modal-sub">Also worth fixing:</p>}
                <ul className="cm-modal-list">{check.warns.map((r) => <li key={r.field + r.text} className="is-warn"><button type="button" onClick={() => jump(r.field)}><b>! {FIELD_LABEL[r.field]}</b><span>{r.text}</span></button></li>)}</ul>
              </>
            )}
            <div className="cm-modal-actions">
              <button type="button" className="cm-ghost" onClick={() => { const first = check.errors[0] ?? check.warns[0]; if (first) jump(first.field); else setCheck(null); }}>Fix them</button>
              {!check.errors.length && <button type="button" className="cm-primary" onClick={() => save(check.mode, true)}>{publishLabel} anyway</button>}
            </div>
          </div>
        </div>
      )}

      {/* preview in the real blog design */}
      {preview && (
        <div className="cm-preview" role="dialog" aria-label="Preview">
          <div className="cm-preview-bar">
            <b>Preview</b><span>This is how the post will look on effixlabs.in</span>
            <button type="button" className="cm-primary" onClick={() => setPreview(false)}>Close preview</button>
          </div>
          <div className="cm-preview-page ab bl">
            <header className="bl-post-hero cm-preview-hero">
              <div className="bl-post-copy">
                <span className="bl-chip">{categoryOf(post.category).name}</span>
                <h1>{post.title || "Untitled post"}</h1>
                <div className="bl-byline">
                  <span className="bl-avatar" aria-hidden="true">{(post.author || "N").charAt(0)}</span>
                  <span className="bl-byline-name">{post.author}</span>
                  <span className="bl-byline-date">Published: {new Date(post.date || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <div className="bl-post-media">
                {post.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <span className="bl-cover"><img src={post.cover} alt={post.coverAlt} /></span>
                ) : (
                  <span className="bl-cover is-art" style={{ background: "radial-gradient(50% 60% at 30% 40%, #7c5cf0, transparent 70%), radial-gradient(40% 50% at 75% 60%, #a3e635, transparent 70%), #ece6ff" }} />
                )}
              </div>
            </header>
            <div className="bl-read">
              {post.takeaways.filter(Boolean).length > 0 && (
                <section className="cm-preview-takeaways"><b>Key takeaways</b><ul>{post.takeaways.filter(Boolean).map((t) => <li key={t}>{t}</li>)}</ul></section>
              )}
              <div className="bl-prose" dangerouslySetInnerHTML={{ __html: render(post.body).html }} />
              {post.faq.filter((f) => f.q && f.a).length > 0 && (
                <section className="bl-faq">
                  <h2>Frequently asked questions</h2>
                  {post.faq.filter((f) => f.q && f.a).map((f) => <div key={f.q} className="bl-faq-item"><h3>{f.q}</h3><p>{f.a}</p></div>)}
                </section>
              )}
              {post.sources.filter((x) => x.label && x.url).length > 0 && (
                <p className="bl-sources">
                  Sources reviewed {new Date(post.updated || post.date || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}:{" "}
                  {post.sources.filter((x) => x.label && x.url).map((x, i, arr) => <span key={x.url + i}><a href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>{i < arr.length - 1 ? ", " : "."}</span>)}
                </p>
              )}
              <footer className="bl-post-foot">
                <span className="bl-post-foot-left"><span className="bl-chip">{categoryOf(post.category).name}</span><span>{new Date(post.date || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                <span className="bl-post-foot-author"><span className="bl-avatar" aria-hidden="true">{(post.author || "N").charAt(0)}</span>{post.author}</span>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
