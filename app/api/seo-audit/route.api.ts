// Effix SEO audit API: reads the homepage, robots.txt, sitemap and a sample of pages, then scores them.
// Nothing is stored.

import { allow } from "@/lib/rate-limit";
import { edgeAllow, notHumanResponse, readJson, tooLargeResponse, TooLarge, verifyHuman } from "@/lib/edge-guard";
import { runAudit } from "@/lib/seo-audit";
import { friendlyError, normalizeInput } from "@/lib/seo-audit/input";

export const runtime = "nodejs";
export const maxDuration = 45;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!allow(request, "seo-audit", 6) || !(await edgeAllow(request, "seo-audit"))) {
    return Response.json({ error: "Too many audits in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  let body: { url?: unknown; turnstile?: unknown };
  try {
    body = (await readJson<{ url?: unknown; turnstile?: unknown }>(request, 4_096)) ?? {};
  } catch (e) {
    if (e instanceof TooLarge) return tooLargeResponse();
    throw e;
  }
  if (!(await verifyHuman(request, body.turnstile))) return notHumanResponse();
  try {
    const report = await runAudit(normalizeInput(body.url));
    return Response.json({ report }, { headers });
  } catch (error) {
    console.error("[seo-audit]", error);
    const { message, status } = friendlyError(error);
    return Response.json({ error: message }, { status, headers });
  }
}
