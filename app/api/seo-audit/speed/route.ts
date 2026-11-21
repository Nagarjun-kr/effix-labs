// Speed test for the audited page via Google PageSpeed Insights. Called separately so the main report shows first.
import { NextResponse } from "next/server";

import { allow } from "@/lib/rate-limit";
import { normalizeInput } from "@/lib/seo-audit/input";
import { runSpeed, SpeedError } from "@/lib/seo-audit/speed";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!allow(request, "seo-speed", 8)) {
    return NextResponse.json({ error: "Too many speed tests in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as { url?: unknown; strategy?: unknown };
    const url = normalizeInput(body.url);
    const speed = await runSpeed(url.toString(), body.strategy === "desktop" ? "desktop" : "mobile");
    return NextResponse.json({ speed }, { headers });
  } catch (error) {
    const message = error instanceof SpeedError ? error.message : "Enter a valid public website URL.";
    return NextResponse.json({ error: message }, { status: error instanceof SpeedError ? 502 : 400, headers });
  }
}
