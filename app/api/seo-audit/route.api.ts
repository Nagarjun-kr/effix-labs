// Effix SEO audit API: reads the homepage, robots.txt, sitemap and a sample of pages, then scores them.
// Nothing is stored.

import { allow } from "@/lib/rate-limit";
import { runAudit } from "@/lib/seo-audit";
import { friendlyError, normalizeInput } from "@/lib/seo-audit/input";

export const runtime = "nodejs";
export const maxDuration = 45;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!allow(request, "seo-audit", 6)) {
    return Response.json({ error: "Too many audits in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as { url?: unknown };
    const report = await runAudit(normalizeInput(body.url));
    return Response.json({ report }, { headers });
  } catch (error) {
    console.error("[seo-audit]", error);
    const { message, status } = friendlyError(error);
    return Response.json({ error: message }, { status, headers });
  }
}
