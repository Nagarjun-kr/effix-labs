// Brand search API: runs the search workflow on our server (no browser widget, no CAPTCHA).
// With "Accept: application/x-ndjson" it streams progress lines while it works, then the result;
// otherwise it answers once with JSON (used by scripts). Nothing is stored or cached.
import { NextResponse } from "next/server";

import { cleanBrand, findMentions, mentionsConfigured, type Progress } from "@/lib/discover/mentions";
import { allow } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!mentionsConfigured()) return NextResponse.json({ configured: false }, { headers });
  if (!allow(request, "mentions", 6)) {
    return NextResponse.json({ error: "Too many searches in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  const body = (await request.json().catch(() => ({}))) as { brand?: unknown; domain?: unknown };
  const brand = typeof body.brand === "string" ? cleanBrand(body.brand) : "";
  const domain = typeof body.domain === "string" ? body.domain.slice(0, 253) : "";
  if (brand.length < 2) return NextResponse.json({ error: "Enter a brand name to search." }, { status: 400, headers });
  const failed = "The search service isn't responding right now. Please try again in a minute.";

  if (!(request.headers.get("accept") ?? "").includes("application/x-ndjson")) {
    try {
      const result = await findMentions(brand, domain);
      if (result.platforms.every((p) => p.error)) throw new Error("all failed");
      return NextResponse.json({ configured: true, brand, ...result }, { headers });
    } catch {
      return NextResponse.json({ error: failed }, { status: 502, headers });
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        const result = await findMentions(brand, domain, (p: Progress) => send(p));
        if (result.platforms.every((p) => p.error)) send({ type: "error", message: failed });
        else send({ type: "result", configured: true, brand, ...result });
      } catch {
        send({ type: "error", message: failed });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { ...headers, "Content-Type": "application/x-ndjson; charset=utf-8", "X-Accel-Buffering": "no" } });
}
