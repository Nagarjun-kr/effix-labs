// Effix Discover API: safely reads ONE public web page and returns the brand name it shows
// and the social profile links it lists. Nothing is stored.
import { NextResponse } from "next/server";

import { extractBrandIdentity, nameFromHost } from "@/lib/discover/brand-identity";
import { retrieveSafely } from "@/lib/discover/safe-retrieval";
import { RetrievalPolicyError, validateWebsiteUrl } from "@/lib/discover/url-policy";

export const runtime = "nodejs";
export const maxDuration = 15;

// Best-effort abuse guard: 10 requests per minute per client address, per server instance.
const buckets = new Map<string, { count: number; resetAt: number }>();
function consume(request: Request) {
  const key =
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 10) return false;
  current.count += 1;
  return true;
}

function normalizeInput(value: unknown): URL {
  if (typeof value !== "string" || value.trim().length < 3 || value.length > 2048) {
    throw new RetrievalPolicyError("invalid_url", "Enter a valid public website URL.");
  }
  const input = value.trim();
  return validateWebsiteUrl(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
}

const friendly: Record<string, string> = {
  timeout: "That website took too long to respond. Please try again.",
  http_status: "That website didn't return a normal page. Check the address and try again.",
  unsupported_content_type: "That address doesn't point to a web page.",
  response_too_large: "That page is too large to check.",
  unsafe_dns: "We couldn't reach a public website at that address.",
};

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!consume(request)) {
    return NextResponse.json({ error: "Too many checks in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as { url?: unknown };
    const url = normalizeInput(body.url);
    let page;
    try {
      page = await retrieveSafely(url, "html", { maxBytes: 5_000_000 }); // big homepages (e.g. 3 MB) still work
    } catch (error) {
      // Site refuses automated visitors (403/401/429/503): still search, using the name from the address.
      const code = error instanceof RetrievalPolicyError ? Number(error.message.match(/HTTP (\d{3})/)?.[1]) : 0;
      if ([401, 403, 406, 429, 503].includes(code)) {
        return NextResponse.json({ identity: { name: nameFromHost(url.hostname), domain: url.hostname.replace(/^www\./, ""), sourceUrl: url.toString(), profiles: [] }, blocked: true }, { headers });
      }
      throw error;
    }
    const identity = extractBrandIdentity(page.body, page.url);
    return NextResponse.json({ identity }, { headers });
  } catch (error) {
    if (error instanceof RetrievalPolicyError) {
      return NextResponse.json({ error: friendly[error.code] ?? error.message }, { status: 400, headers });
    }
    return NextResponse.json({ error: "We couldn't open that website. Check the address and try again." }, { status: 502, headers });
  }
}
