"use client";

// Blog editor app: sign-in (local mode on this computer, or GitHub for the live site), then Posts <-> Edit.
// The screen is kept in the URL hash (#/new, #/edit/<slug>) so refreshing keeps your place.
import { useCallback, useEffect, useState } from "react";

import { GitHubStore, LocalStore, type BuildState, type PostRef, type Store } from "@/lib/cms/store";
import PostEditor from "./editor";
import PostsList from "./posts";

const WORKER = "https://effix-search.effix-labs.workers.dev";
const TOKEN_KEY = "effix-cms:github-token";

type Route = { name: "posts" } | { name: "new" } | { name: "edit"; slug: string };
const readRoute = (): Route => {
  const h = typeof window === "undefined" ? "" : window.location.hash;
  if (h.startsWith("#/edit/")) return { name: "edit", slug: decodeURIComponent(h.slice(7)) };
  if (h === "#/new") return { name: "new" };
  return { name: "posts" };
};
const go = (r: Route) => { window.location.hash = r.name === "posts" ? "#/" : r.name === "new" ? "#/new" : `#/edit/${encodeURIComponent(r.slug)}`; };

/** GitHub sign-in through the Cloudflare Worker (Decap/Sveltia CMS popup protocol). */
function githubLogin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const popup = window.open(`${WORKER}/auth?provider=github&scope=repo,user`, "effix-github-login", "width=620,height=720");
    if (!popup) return reject(new Error("The sign-in window was blocked. Allow pop-ups for this site and try again."));
    const workerOrigin = new URL(WORKER).origin;
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== workerOrigin || typeof e.data !== "string") return;
      if (e.data === "authorizing:github") { popup.postMessage("authorizing:github", e.origin); return; }
      const m = e.data.match(/^authorization:github:(success|error):([\s\S]*)$/);
      if (!m) return;
      window.removeEventListener("message", onMsg);
      clearInterval(closed);
      const data = JSON.parse(m[2]) as { token?: string; error?: string };
      if (m[1] === "success" && data.token) resolve(data.token);
      else reject(new Error(data.error || "GitHub sign-in failed."));
    };
    window.addEventListener("message", onMsg);
    const closed = setInterval(() => { if (popup.closed) { clearInterval(closed); window.removeEventListener("message", onMsg); reject(new Error("The sign-in window was closed.")); } }, 600);
  });
}

export default function AdminApp() {
  const [store, setStore] = useState<Store | null>(null);
  const [localOk, setLocalOk] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [route, setRoute] = useState<Route>({ name: "posts" });
  const [posts, setPosts] = useState<PostRef[]>([]);
  const [loading, setLoading] = useState(false);
  const [build, setBuild] = useState<BuildState | null>(null);
  // The post open in the editor. Kept separately from the URL so saving (which may rename the slug) never remounts it.
  const [active, setActive] = useState<{ key: string; ref?: PostRef } | null>(null);
  const [missing, setMissing] = useState(false);

  // detect local mode; resume a GitHub session from this tab
  useEffect(() => {
    setRoute(readRoute());
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    (async () => {
      const ok = await LocalStore.available();
      setLocalOk(ok);
      const saved = (() => { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } })();
      if (saved) await connectGitHub(saved, true);
      setChecking(false);
    })();
    return () => window.removeEventListener("hashchange", onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectGitHub = async (t: string, quiet = false) => {
    try {
      const s = new GitHubStore(t.trim());
      await s.verify();
      try { sessionStorage.setItem(TOKEN_KEY, t.trim()); } catch { /* ignore */ }
      setStore(s);
      setError("");
    } catch (e) {
      try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
      if (!quiet) setError((e as Error).message);
    }
  };

  const refresh = useCallback(async () => {
    if (!store) return;
    setLoading(true);
    try { setPosts(await store.list()); setError(""); } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }, [store]);
  useEffect(() => { refresh(); }, [refresh]);

  // live site: show the GitHub build status (published posts go live when it finishes)
  useEffect(() => {
    if (!store?.build) return;
    let stop = false;
    const tick = async () => { try { const b = await store.build!(); if (!stop) setBuild(b); } catch { /* ignore */ } };
    tick();
    const id = setInterval(tick, 15000);
    return () => { stop = true; clearInterval(id); };
  }, [store]);

  useEffect(() => {
    setMissing(false);
    if (route.name === "posts") { setActive(null); return; }
    if (route.name === "new") { setActive((a) => (a?.key.startsWith("new") ? a : { key: `new-${Date.now()}` })); return; }
    setActive((a) => {
      if (a && (a.key === route.slug || a.ref?.slug === route.slug)) return a;
      const ref = posts.find((p) => p.slug === route.slug);
      if (ref) return { key: ref.slug, ref };
      if (!loading && store) setMissing(true);
      return null;
    });
  }, [route, posts, loading, store]);

  if (checking) return <div className="cm-center">Loading…</div>;

  if (!store) {
    return (
      <div className="cm-login">
        <div className="cm-login-card">
          <span className="cm-logo"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></svg>Effix Labs</span>
          <h1>Blog editor</h1>
          <p>Write, schedule and publish posts on effixlabs.in/blog.</p>
          {localOk && (
            <button type="button" className="cm-primary cm-wide" onClick={() => setStore(new LocalStore())}>Continue in local mode</button>
          )}
          {localOk && <small className="cm-hint">Local mode saves straight into this computer&apos;s project folder (for testing). It isn&apos;t available on the live site.</small>}
          <button
            type="button"
            className={`${localOk ? "cm-ghost" : "cm-primary"} cm-wide`}
            onClick={async () => { setError(""); try { await connectGitHub(await githubLogin()); } catch (e) { setError((e as Error).message); } }}
          >
            Sign in with GitHub
          </button>
          <details className="cm-token">
            <summary>Use a GitHub access token instead</summary>
            <p>Create a fine-grained token with “Contents: read and write” access to {`Nagarjun-kr/effix-labs`}, then paste it here.</p>
            <input type="password" className="cm-input" placeholder="github_pat_…" value={token} onChange={(e) => setToken(e.target.value)} />
            <button type="button" className="cm-ghost cm-wide" disabled={!token.trim()} onClick={() => connectGitHub(token)}>Sign in with token</button>
          </details>
          {error && <p className="cm-note is-err">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="cm-app">
      {!active ? (
        <>
          <header className="cm-top">
            <span className="cm-logo"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></svg>Effix Labs <em>Blog editor</em></span>
            <span className="cm-top-right">
              {build && build.state !== "idle" && (
                <a className={`cm-build is-${build.state}`} href={build.url} target="_blank" rel="noopener noreferrer">
                  {build.state === "running" ? "Site updating…" : build.state === "done" ? "Site up to date" : "Last site update failed"}
                </a>
              )}
              <span className="cm-who">{store.kind === "local" ? "Local mode" : store.who}</span>
              <a className="cm-ghost" href="/blog" target="_blank" rel="noopener noreferrer">View blog ↗</a>
              <button type="button" className="cm-ghost" onClick={() => { try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } setStore(null); setPosts([]); go({ name: "posts" }); }}>Sign out</button>
            </span>
          </header>
          {error && <p className="cm-note is-err cm-pad">{error}</p>}
          {missing && <p className="cm-note is-err cm-pad">That post wasn&apos;t found. It may have been renamed or deleted.</p>}
          <PostsList
            posts={posts}
            loading={loading}
            onNew={() => go({ name: "new" })}
            onEdit={(r) => go({ name: "edit", slug: r.slug })}
            onDelete={async (r) => {
              if (!window.confirm(`Delete “${r.post.title || r.slug}”? This removes the post from the site.`)) return;
              try { await store.remove(r); await refresh(); } catch (e) { setError((e as Error).message); }
            }}
          />
        </>
      ) : (
        <PostEditor
          key={active.key}
          store={store}
          existing={active.ref}
          allSlugs={posts.map((p) => p.slug)}
          onClose={() => { go({ name: "posts" }); refresh(); }}
          onSaved={(saved, previousSlug) => {
            setPosts((ps) => [...ps.filter((p) => p.slug !== saved.slug && p.slug !== previousSlug), saved]);
            setActive((a) => (a ? { ...a, ref: saved } : a));
            // update the address bar without reopening the editor
            window.history.replaceState(null, "", `#/edit/${encodeURIComponent(saved.slug)}`);
          }}
        />
      )}
    </div>
  );
}
