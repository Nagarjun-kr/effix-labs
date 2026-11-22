// Blog editor, local mode: lets /admin read and write posts on this computer while running `next dev`.
// Only exists in development (route.api.ts files are excluded from the static build), only answers requests from
// localhost, and only touches content/blog/*.md and public/images/blog/*.
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const POSTS = path.join(ROOT, "content", "blog");
const MEDIA = path.join(ROOT, "public", "images", "blog");
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

function allowed(request: Request) {
  if (process.env.NODE_ENV !== "development") return false;
  const host = new URL(request.url).hostname;
  return host === "localhost" || host === "127.0.0.1";
}
const safeName = (name: unknown, re: RegExp) => (typeof name === "string" && re.test(name) && !name.includes("..") ? name : null);
const POST_NAME = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const MEDIA_NAME = /^[a-z0-9][a-z0-9-]*\.(webp|png|jpe?g|gif|svg)$/;

export async function GET(request: Request) {
  if (!allowed(request)) return json({ error: "Not available" }, 404);
  const op = new URL(request.url).searchParams.get("op");
  if (op === "ping") return json({ ok: true });
  if (op === "list") {
    await fs.mkdir(POSTS, { recursive: true });
    const names = (await fs.readdir(POSTS)).filter((n) => n.endsWith(".md"));
    const files = await Promise.all(names.map(async (name) => ({ name, text: await fs.readFile(path.join(POSTS, name), "utf8") })));
    return json({ files });
  }
  return json({ error: "Unknown operation" }, 400);
}

export async function POST(request: Request) {
  if (!allowed(request)) return json({ error: "Not available" }, 404);
  const op = new URL(request.url).searchParams.get("op");
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  try {
    if (op === "save") {
      const name = safeName(body.name, POST_NAME);
      if (!name || typeof body.text !== "string") return json({ error: "Invalid post file name" }, 400);
      await fs.mkdir(POSTS, { recursive: true });
      const removeName = safeName(body.remove, POST_NAME);
      await fs.writeFile(path.join(POSTS, name), body.text, "utf8");
      if (removeName && removeName !== name) await fs.rm(path.join(POSTS, removeName), { force: true });
      return json({ ok: true });
    }
    if (op === "delete") {
      const name = safeName(body.name, POST_NAME);
      if (!name) return json({ error: "Invalid post file name" }, 400);
      await fs.rm(path.join(POSTS, name), { force: true });
      return json({ ok: true });
    }
    if (op === "upload") {
      const name = safeName(body.name, MEDIA_NAME);
      if (!name || typeof body.data !== "string") return json({ error: "Invalid image name" }, 400);
      const bytes = Buffer.from(body.data, "base64");
      if (bytes.length > 8 * 1024 * 1024) return json({ error: "Image is larger than 8 MB" }, 400);
      await fs.mkdir(MEDIA, { recursive: true });
      await fs.writeFile(path.join(MEDIA, name), bytes);
      return json({ ok: true, path: `/images/blog/${name}` });
    }
    return json({ error: "Unknown operation" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
}
