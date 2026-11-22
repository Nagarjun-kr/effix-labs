// Brand search API: runs the search workflow on our server (no browser widget, no CAPTCHA).
// With "Accept: application/x-ndjson" it streams progress lines while it works, then the result;
// otherwise it answers once with JSON (used by scripts). Nothing is stored or cached.

import { cleanBrand, findMentions, mentionsConfigured, type Progress } from "@/lib/discover/mentions";
import { allow } from "@/lib/rate-limit";
import { edgeAllow, notHumanResponse, readJson, tooLargeResponse, TooLarge, verifyHuman } from "@/lib/edge-guard";

export const runtime = "nodejs";
export const maxDuration = 60; // the workflow normally takes 15–30 s; 60 s fits every Vercel plan

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!mentionsConfigured()) return Response.json({ configured: false }, { headers });
  if (!allow(request, "mentions", 6) || !(await edgeAllow(request, "mentions"))) {
    return Response.json({ error: "Too many searches in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  // each brand search costs Serper credits, so it is the call that needs the bot check
  let body: { brand?: unknown; domain?: unknown; turnstile?: unknown };
  try {
    body = (await readJson<{ brand?: unknown; domain?: unknown; turnstile?: unknown }>(request, 4_096)) ?? {};
  } catch (e) {
    if (e instanceof TooLarge) return tooLargeResponse();
    throw e;
  }
  if (!(await verifyHuman(request, body.turnstile))) return notHumanResponse();
  const brand = typeof body.brand === "string" ? cleanBrand(body.brand) : "";
  const domain = typeof body.domain === "string" ? body.domain.slice(0, 253) : "";
  if (brand.length < 2) return Response.json({ error: "Enter a brand name to search." }, { status: 400, headers });
  const failed = "The search service isn't responding right now. Please try again in a minute.";
  const noKeys = "Live brand search is paused for a short while. Please try again later.";
  const why = (e: unknown) => ((e as { code?: string })?.code === "no_keys" ? noKeys : failed);

  if (!(request.headers.get("accept") ?? "").includes("application/x-ndjson")) {
    try {
      const result = await findMentions(brand, domain);
      if (result.platforms.every((p) => p.error)) throw new Error("all failed");
      return Response.json({ configured: true, brand, ...result }, { headers });
    } catch (e) {
      return Response.json({ error: why(e) }, { status: 502, headers });
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
      } catch (e) {
        send({ type: "error", message: why(e) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { ...headers, "Content-Type": "application/x-ndjson; charset=utf-8", "X-Accel-Buffering": "no" } });
}
