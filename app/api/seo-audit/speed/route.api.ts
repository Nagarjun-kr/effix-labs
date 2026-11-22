// Speed test for the audited page via Google PageSpeed Insights. Called separately so the main report shows first.

import { allow } from "@/lib/rate-limit";
import { edgeAllow, readJson, tooLargeResponse, TooLarge } from "@/lib/edge-guard";
import { normalizeInput } from "@/lib/seo-audit/input";
import { runSpeed, SpeedError } from "@/lib/seo-audit/speed";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!allow(request, "seo-speed", 8) || !(await edgeAllow(request, "seo-speed"))) {
    return Response.json({ error: "Too many speed tests in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  let body: { url?: unknown; strategy?: unknown };
  try {
    body = (await readJson<{ url?: unknown; strategy?: unknown }>(request, 4_096)) ?? {};
  } catch (e) {
    if (e instanceof TooLarge) return tooLargeResponse();
    throw e;
  }
  try {
    const url = normalizeInput(body.url);
    const speed = await runSpeed(url.toString(), body.strategy === "desktop" ? "desktop" : "mobile");
    return Response.json({ speed }, { headers });
  } catch (error) {
    const message = error instanceof SpeedError ? error.message : "Enter a valid public website URL.";
    return Response.json({ error: message }, { status: error instanceof SpeedError ? 502 : 400, headers });
  }
}
