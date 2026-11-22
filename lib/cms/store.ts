// Where the editor reads and writes posts.
//  - LocalStore: `next dev` on your computer; saves straight into content/blog via app/api/cms (dev only).
//  - GitHubStore: the live site; saves through the GitHub API (one commit per save), which triggers the build.
// Both expose the same small interface, so the editor doesn't care which one it uses.
import { parsePost, stringifyPost, type EditorPost } from "./post";

export const REPO = "Nagarjun-kr/effix-labs";
export const BRANCH = "main";
const POSTS_DIR = "content/blog";
const MEDIA_DIR = "public/images/blog";

export type PostRef = { slug: string; post: EditorPost; sha?: string };
export type BuildState = { state: "idle" | "running" | "done" | "failed"; url?: string; at?: string };

export interface Store {
  kind: "local" | "github";
  who: string;
  list(): Promise<PostRef[]>;
  get(slug: string): Promise<PostRef | null>;
  /** Saves under post.slug; if the slug changed, the old file is removed. Returns the new ref. */
  save(post: EditorPost, previous?: PostRef): Promise<PostRef>;
  remove(ref: PostRef): Promise<void>;
  /** Uploads an image; returns its public path (/images/blog/...). */
  upload(file: Blob, name: string): Promise<string>;
  build?(): Promise<BuildState>;
}

const isPostFile = (n: string) => n.endsWith(".md") && !n.startsWith("_") && !n.startsWith(".");

// ---------- local (dev) ----------
export class LocalStore implements Store {
  kind = "local" as const;
  who = "Local files on this computer";
  private async call(op: string, body?: unknown) {
    const res = await fetch(`/api/cms?op=${op}`, body === undefined ? undefined : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Local save failed (${res.status})`);
    return data;
  }
  static async available() {
    try {
      const r = await fetch("/api/cms?op=ping", { cache: "no-store" });
      return r.ok && (await r.json()).ok === true;
    } catch {
      return false;
    }
  }
  async list() {
    const { files } = (await this.call("list")) as { files: { name: string; text: string }[] };
    return files.filter((f) => isPostFile(f.name)).map((f) => ({ slug: f.name.replace(/\.md$/, ""), post: parsePost(f.text, f.name.replace(/\.md$/, "")) }));
  }
  async get(slug: string) {
    return (await this.list()).find((r) => r.slug === slug) ?? null;
  }
  async save(post: EditorPost, previous?: PostRef) {
    await this.call("save", { name: `${post.slug}.md`, text: stringifyPost(post), remove: previous && previous.slug !== post.slug ? `${previous.slug}.md` : undefined });
    return { slug: post.slug, post };
  }
  async remove(ref: PostRef) {
    await this.call("delete", { name: `${ref.slug}.md` });
  }
  async upload(file: Blob, name: string) {
    const data = await toBase64(file);
    const { path } = (await this.call("upload", { name, data })) as { path: string };
    return path;
  }
}

// ---------- GitHub (live) ----------
const b64encode = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const b64decode = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));
export function toBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]+,/, ""));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export class GitHubStore implements Store {
  kind = "github" as const;
  who = "";
  constructor(private token: string) {}
  private async gh(path: string, init: RequestInit = {}) {
    const res = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${this.token}`, "X-GitHub-Api-Version": "2022-11-28", ...(init.headers ?? {}) },
      cache: "no-store",
    });
    if (res.status === 404 && (!init.method || init.method === "GET")) return null;
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { message?: string }).message || `GitHub error ${res.status}`);
    return data;
  }
  /** Confirms the token works and can write to the repo. */
  async verify() {
    const user = (await this.gh("/user")) as { login: string } | null;
    const repo = (await this.gh(`/repos/${REPO}`)) as { permissions?: { push?: boolean } } | null;
    if (!user) throw new Error("This GitHub sign-in didn't work.");
    if (!repo?.permissions?.push) throw new Error(`@${user.login} doesn't have write access to ${REPO}.`);
    this.who = `@${user.login}`;
  }
  async list() {
    const items = ((await this.gh(`/repos/${REPO}/contents/${POSTS_DIR}?ref=${BRANCH}`)) ?? []) as { name: string; path: string; sha: string; type: string }[];
    const files = items.filter((i) => i.type === "file" && isPostFile(i.name));
    return Promise.all(
      files.map(async (f) => {
        const blob = (await this.gh(`/repos/${REPO}/git/blobs/${f.sha}`)) as { content: string };
        const slug = f.name.replace(/\.md$/, "");
        return { slug, sha: f.sha, post: parsePost(b64decode(blob.content), slug) };
      }),
    );
  }
  async get(slug: string) {
    const f = (await this.gh(`/repos/${REPO}/contents/${POSTS_DIR}/${slug}.md?ref=${BRANCH}`)) as { content: string; sha: string } | null;
    return f ? { slug, sha: f.sha, post: parsePost(b64decode(f.content), slug) } : null;
  }
  private async put(path: string, content64: string, message: string, sha?: string) {
    const r = (await this.gh(`/repos/${REPO}/contents/${path}`, { method: "PUT", body: JSON.stringify({ message, content: content64, branch: BRANCH, ...(sha ? { sha } : {}) }) })) as { content: { sha: string } };
    return r.content.sha;
  }
  async save(post: EditorPost, previous?: PostRef) {
    const renamed = previous && previous.slug !== post.slug;
    const existing = renamed || !previous ? await this.get(post.slug) : previous;
    if (existing && (!previous || renamed)) throw new Error(`A post with the slug "${post.slug}" already exists.`);
    const verb = post.draft ? "save draft" : previous && !previous.post.draft ? "update" : "publish";
    const sha = await this.put(`${POSTS_DIR}/${post.slug}.md`, b64encode(stringifyPost(post)), `Blog: ${verb} ${post.slug}`, renamed ? undefined : previous?.sha);
    if (renamed && previous?.sha) await this.gh(`/repos/${REPO}/contents/${POSTS_DIR}/${previous.slug}.md`, { method: "DELETE", body: JSON.stringify({ message: `Blog: rename ${previous.slug} to ${post.slug}`, sha: previous.sha, branch: BRANCH }) });
    return { slug: post.slug, sha, post };
  }
  async remove(ref: PostRef) {
    const sha = ref.sha ?? (await this.get(ref.slug))?.sha;
    if (!sha) return;
    await this.gh(`/repos/${REPO}/contents/${POSTS_DIR}/${ref.slug}.md`, { method: "DELETE", body: JSON.stringify({ message: `Blog: delete ${ref.slug}`, sha, branch: BRANCH }) });
  }
  async upload(file: Blob, name: string) {
    await this.put(`${MEDIA_DIR}/${name}`, await toBase64(file), `Blog: upload ${name}`);
    return `/images/blog/${name}`;
  }
  async build(): Promise<BuildState> {
    const r = (await this.gh(`/repos/${REPO}/actions/runs?branch=${BRANCH}&per_page=1`)) as { workflow_runs?: { status: string; conclusion: string | null; html_url: string; updated_at: string }[] } | null;
    const run = r?.workflow_runs?.[0];
    if (!run) return { state: "idle" };
    if (run.status !== "completed") return { state: "running", url: run.html_url, at: run.updated_at };
    return { state: run.conclusion === "success" ? "done" : "failed", url: run.html_url, at: run.updated_at };
  }
}

// ---------- images: resize + convert to WebP in the browser before upload ----------
export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<{ blob: Blob; ext: string }> {
  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) return { blob: file, ext: (file.name.split(".").pop() || "img").toLowerCase() };
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
  return blob && blob.size < file.size ? { blob, ext: "webp" } : { blob: file, ext: file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg" };
}
