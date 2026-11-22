// Confirms YouTube channels by opening their public pages. Nothing is stored.

import { allow } from "@/lib/rate-limit";
import { canCheck, checkProfile } from "@/lib/discover/verify";

export const runtime = "nodejs";
export const maxDuration = 25;

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!allow(request, "verify", 10)) return Response.json({ error: "Too many checks. Try again in a minute." }, { status: 429, headers });
  const body = (await request.json().catch(() => ({}))) as { domain?: unknown; items?: unknown };
  const domain = typeof body.domain === "string" ? body.domain.slice(0, 253) : "";
  const items = Array.isArray(body.items) ? body.items.slice(0, 8) : [];
  const valid = items.filter(
    (i): i is { platform: string; url: string } =>
      Boolean(i) && typeof i.platform === "string" && typeof i.url === "string" && canCheck(i.platform, i.url),
  );
  if (!domain || !valid.length) return Response.json({ checks: [] }, { headers });
  const checks = await Promise.all(valid.map((i) => checkProfile(i.platform, i.url, domain)));
  return Response.json({ checks }, { headers });
}
