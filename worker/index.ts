// Effix search server on Cloudflare Workers (free plan). Runs the same API route handlers as `next dev`
// (app/api/**/route.api.ts) for the static HTML site: Effix Discover's brand search and the SEO audit.
// Secrets (SERPER_API_KEYS, optional GROQ_API_KEY, PAGESPEED_API_KEY, ALERT_WEBHOOK_URL) are set with
// `npx wrangler secret put NAME` and reach the shared code as process.env.NAME.
import * as discovery from "../app/api/discovery/route.api";
import * as mentions from "../app/api/discovery/mentions/route.api";
import * as verify from "../app/api/discovery/verify/route.api";
import * as seoAudit from "../app/api/seo-audit/route.api";
import * as speed from "../app/api/seo-audit/speed/route.api";

type Handler = (request: Request) => Promise<Response>;
const ROUTES: Record<string, Handler> = {
  "/api/discovery": discovery.POST,
  "/api/discovery/mentions": mentions.POST,
  "/api/discovery/verify": verify.POST,
  "/api/seo-audit": seoAudit.POST,
  "/api/seo-audit/speed": speed.POST,
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

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    const origin = request.headers.get("origin");
    const allowed = cors(origin);

    if (pathname === "/" || pathname === "/health") {
      return Response.json({ ok: true, service: "effix-search" }, { headers: { "Cache-Control": "no-store" } });
    }
    const handler = ROUTES[pathname.replace(/\/+$/, "")];
    if (!handler) return Response.json({ error: "Not found" }, { status: 404 });
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
