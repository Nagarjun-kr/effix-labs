// Effix Discover API: safely reads ONE public web page and returns the brand name it shows
// and the social profile links it lists. Nothing is stored.

import { extractBrandIdentity, nameFromHost } from "@/lib/discover/brand-identity";
import { retrieveSafely } from "@/lib/discover/safe-retrieval";
import { parseWebsite } from "@/lib/discover/input";
import { RetrievalPolicyError, validateWebsiteUrl } from "@/lib/discover/url-policy";

export const runtime = "nodejs";
export const maxDuration = 30;

// Best-effort abuse guard: 10 requests per minute per client address, per server instance.
const buckets = new Map<string, { count: number; resetAt: number }>();
function consume(request: Request) {
  const key =
    request.headers.get("cf-connecting-ip") ??
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

const friendly: Record<string, string> = {
  timeout: "That website took too long to respond. Please try again.",
  http_status: "That website didn't return a normal page. Check the address and try again.",
  too_many_redirects: "That website keeps redirecting, so we couldn't read it.",
  unsupported_content_type: "That address doesn't point to a web page.",
  response_too_large: "That page is too large to check.",
  unsafe_dns: "We couldn't find a public website at that address. Check the spelling and try again.",
};

type Fetched = Awaited<ReturnType<typeof retrieveSafely>>;

/** Tries the homepage, then www./non-www, then http://, then the exact page typed; returns the first that loads. */
async function readSite(host: string, entered: string): Promise<{ page?: Fetched; blockedBy?: number; error?: unknown }> {
  const alt = host.startsWith("www.") ? host.slice(4) : `www.${host}`;
  const tries = [...new Set([`https://${host}/`, `https://${alt}/`, `http://${host}/`, entered])];
  let blockedBy: number | undefined;
  let lastError: unknown;
  for (const t of tries) {
    try {
      return { page: await retrieveSafely(validateWebsiteUrl(t), "html", { maxBytes: 5_000_000 }) };
    } catch (error) {
      const code = error instanceof RetrievalPolicyError ? Number(error.message.match(/HTTP (\d{3})/)?.[1]) : 0;
      if ([401, 403, 406, 429, 503].includes(code)) blockedBy ??= code;
      // A clear answer from the site ("blocked", "not a web page") won't change on the other addresses, except
      // a 404 on the homepage, where the exact page typed may still work.
      if (error instanceof RetrievalPolicyError && ["unsafe_ip", "unsafe_host", "unsafe_url", "unsafe_port"].includes(error.code)) return { error };
      lastError = error;
      if (error instanceof RetrievalPolicyError && error.code === "timeout") {
        blockedBy ??= 408; // some sites never answer automated visits; treat like a refusal and still search
        break;
      }
    }
  }
  return { blockedBy, error: lastError };
}

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!consume(request)) {
    return Response.json({ error: "Too many checks in a short time. Please try again in a minute." }, { status: 429, headers });
  }
  try {
    const body = (await request.json().catch(() => ({}))) as { url?: unknown };
    const parsed = parseWebsite(body.url);
    if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400, headers });
    const { page, blockedBy, error } = await readSite(parsed.host, parsed.entered);
    if (!page) {
      // Site refuses or ignores automated visits: still search, using the name from the address.
      if (blockedBy) {
        const domain = parsed.host.replace(/^www\./, "");
        return Response.json({ identity: { name: nameFromHost(domain), domain, sourceUrl: parsed.homepage, profiles: [] }, blocked: true }, { headers });
      }
      throw error ?? new Error("unreachable");
    }
    const identity = extractBrandIdentity(page.body, page.url);
    return Response.json({ identity }, { headers });
  } catch (error) {
    if (error instanceof RetrievalPolicyError) {
      return Response.json({ error: friendly[error.code] ?? error.message }, { status: 400, headers });
    }
    const code = (error as { code?: string })?.code;
    if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
      return Response.json({ error: "We couldn't find a website at that address. Check the spelling and try again." }, { status: 400, headers });
    }
    return Response.json({ error: "We couldn't open that website. Check the address and try again." }, { status: 502, headers });
  }
}
