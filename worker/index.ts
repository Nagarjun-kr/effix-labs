// Effix search server on Cloudflare Workers (free plan). Runs the same API route handlers as `next dev`
// (app/api/**/route.api.ts) for the static HTML site: Effix Discover's brand search and the SEO audit.
// It also handles the GitHub login for the blog editor at /admin (/auth and /callback; needs GITHUB_CLIENT_ID and
// GITHUB_CLIENT_SECRET from a GitHub OAuth App whose callback URL is https://<this worker>/callback).
// Enquiry forms post to /api/contact, which emails them through Resend (RESEND_API_KEY; optional CONTACT_TO, CONTACT_FROM).
// Secrets (SERPER_API_KEYS, optional GROQ_API_KEY, PAGESPEED_API_KEY, ALERT_WEBHOOK_URL) are set with
// `npx wrangler secret put NAME` and reach the shared code as process.env.NAME.
import * as discovery from "../app/api/discovery/route.api";
import * as mentions from "../app/api/discovery/mentions/route.api";
import * as verify from "../app/api/discovery/verify/route.api";
import * as seoAudit from "../app/api/seo-audit/route.api";
import * as speed from "../app/api/seo-audit/speed/route.api";
import * as contact from "../app/api/contact/route.api";

type Handler = (request: Request) => Promise<Response>;
const ROUTES: Record<string, Handler> = {
  "/api/discovery": discovery.POST,
  "/api/discovery/mentions": mentions.POST,
  "/api/discovery/verify": verify.POST,
  "/api/seo-audit": seoAudit.POST,
  "/api/seo-audit/speed": speed.POST,
  "/api/contact": contact.POST,
};

// Browsers may only call this server from the Effix website (and local development).
const ORIGINS = new Set([
  "https://effixlabs.in",
  "https://www.effixlabs.in",
  "https://effix.co.in",
  "https://www.effix.co.in",
  "http://localhost:3000",
  "http://localhost:4100",
]);

function cors(origin: string | null): Record<string, string> {
  if (!origin || !ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// ---------- GitHub login for the blog editor (Decap/Sveltia CMS OAuth protocol) ----------
const env = () => (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};

function authPage(status: "success" | "error", content: Record<string, string>) {
  const message = `authorization:github:${status}:${JSON.stringify({ provider: "github", ...content })}`;
  const allowed = JSON.stringify([...ORIGINS]);
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>Signing in…</title><p style="font:16px system-ui;padding:24px">Signing in… you can close this window if it stays open.</p>
<script>
(function () {
  var allowed = ${allowed}, msg = ${JSON.stringify(message)};
  function receive(e) {
    if (allowed.indexOf(e.origin) === -1) return;
    window.removeEventListener("message", receive);
    window.opener && window.opener.postMessage(msg, e.origin);
    setTimeout(function () { window.close(); }, 200);
  }
  window.addEventListener("message", receive);
  window.opener && window.opener.postMessage("authorizing:github", "*");
})();
</script>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Set-Cookie": "cms_state=; Path=/callback; Max-Age=0; Secure; HttpOnly; SameSite=Lax" } },
  );
}

async function auth(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { GITHUB_CLIENT_ID: id } = env();
  if (!id) return authPage("error", { error: "Blog login is not set up yet (missing GitHub OAuth app)." });
  const state = crypto.randomUUID();
  const go = new URL("https://github.com/login/oauth/authorize");
  go.searchParams.set("client_id", id);
  go.searchParams.set("scope", url.searchParams.get("scope") || "repo,user");
  go.searchParams.set("state", state);
  go.searchParams.set("redirect_uri", `${url.origin}/callback`);
  return new Response(null, { status: 302, headers: { Location: go.toString(), "Set-Cookie": `cms_state=${state}; Path=/callback; Max-Age=600; Secure; HttpOnly; SameSite=Lax` } });
}

async function callback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { GITHUB_CLIENT_ID: id, GITHUB_CLIENT_SECRET: secret } = env();
  if (!id || !secret) return authPage("error", { error: "Blog login is not set up yet (missing GitHub OAuth app)." });
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)cms_state=([^;]+)/)?.[1];
  if (!state || state !== cookie) return authPage("error", { error: "Sign-in expired or was tampered with. Please try again." });
  const code = url.searchParams.get("code");
  if (!code) return authPage("error", { error: url.searchParams.get("error_description") || "GitHub did not return a sign-in code." });
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: id, client_secret: secret, code, redirect_uri: `${url.origin}/callback` }),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!data.access_token) return authPage("error", { error: data.error_description || "GitHub sign-in failed." });
  return authPage("success", { token: data.access_token });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/auth") return auth(request);
    if (pathname === "/callback") return callback(request);
    const origin = request.headers.get("origin");
    const allowed = cors(origin);

    if (pathname === "/" || pathname === "/health") {
      return Response.json({ ok: true, service: "effix-search" }, { headers: { "Cache-Control": "no-store" } });
    }
    const handler = ROUTES[pathname.replace(/\/+$/, "")];
    // allowed sites get CORS headers on errors too, so the browser shows the real problem instead of a network error
    if (!handler) return Response.json({ error: "Not found" }, { status: 404, headers: allowed });
    // Requests from other websites are refused; requests with no Origin (scripts, curl) are allowed and
    // still rate-limited per IP by the handlers.
    if (origin && !ORIGINS.has(origin)) return Response.json({ error: "Not allowed" }, { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: allowed });
    if (request.method !== "POST") return Response.json({ error: "Use POST" }, { status: 405, headers: allowed });

    const res = await handler(request);
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(allowed)) headers.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  },
};
