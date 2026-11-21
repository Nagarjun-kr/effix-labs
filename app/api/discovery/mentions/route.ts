// Brand mentions API: searches the brand on eight platforms from our server (no browser widget, no CAPTCHA).
import { NextResponse } from "next/server";

import { cleanBrand, findMentions, mentionsConfigured } from "@/lib/discover/mentions";
import { allow } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 20;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!mentionsConfigured()) return NextResponse.json({ configured: false }, { headers });
  if (!allow(request, "mentions", 8)) {
    return NextResponse.json({ error: "Too many searches in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  const body = (await request.json().catch(() => ({}))) as { brand?: unknown };
  const brand = typeof body.brand === "string" ? cleanBrand(body.brand) : "";
  if (brand.length < 2) return NextResponse.json({ error: "Enter a brand name to search." }, { status: 400, headers });
  try {
    const platforms = await findMentions(brand);
    if (platforms.every((p) => p.error)) throw new Error("all failed");
    return NextResponse.json({ configured: true, brand, platforms }, { headers });
  } catch {
    return NextResponse.json({ error: "The search service isn't responding right now. Please try again in a minute." }, { status: 502, headers });
  }
}
