// Cloudflare Worker version of lib/discover/safe-retrieval.ts (swapped in by the `alias` in wrangler.jsonc).
// Same contract and limits: public http(s) pages only, 3 redirects (each re-validated), a byte cap and an 8 s timeout.
// Workers have no raw sockets, so this uses fetch(). The DNS pinning of the Node version isn't needed here: a
// Worker's requests leave from Cloudflare's network and can't reach private or internal addresses, and
// validateWebsiteUrl still rejects IP literals, localhost and internal names before any request is made.
import { RetrievalPolicyError, validateWebsiteUrl } from "@/lib/discover/url-policy";

export const retrievalLimits = {
  maxRedirects: 3,
  htmlBytes: 1_000_000,
  textBytes: 250_000,
  timeoutMs: 8_000,
} as const;

export type RetrievalKind = "html" | "text" | "xml";
export type RetrievedResource = {
  url: string;
  status: number;
  contentType: string;
  body: string;
  bytes: number;
  headers: Record<string, string | string[] | undefined>;
  redirects: number;
  ms: number;
};
export type DnsLookup = (hostname: string) => Promise<string[]>;

function accepts(kind: RetrievalKind, contentType: string) {
  const value = contentType.toLowerCase();
  if (kind === "html") return value.includes("text/html") || value.includes("application/xhtml+xml");
  if (kind === "xml") return value.includes("xml") || value.includes("text/plain");
  return value.includes("text/plain") || value.includes("xml");
}

async function readCapped(res: Response, maxBytes: number): Promise<{ body: string; bytes: number }> {
  if (!res.body) return { body: "", bytes: 0 };
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel().catch(() => {});
      throw new RetrievalPolicyError("response_too_large", "Response exceeded its retrieval limit.");
    }
    chunks.push(value);
  }
  const all = new Uint8Array(bytes);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.byteLength; }
  return { body: new TextDecoder("utf-8").decode(all), bytes };
}

export async function retrieveSafely(
  input: string | URL,
  kind: RetrievalKind,
  options: { resolver?: DnsLookup; maxBytes?: number; redirects?: number } = {},
): Promise<RetrievedResource> {
  const url = validateWebsiteUrl(String(input));
  const maxBytes = options.maxBytes ?? (kind === "html" ? retrievalLimits.htmlBytes : retrievalLimits.textBytes);
  const redirects = options.redirects ?? 0;
  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(retrievalLimits.timeoutMs),
      headers: {
        Accept: kind === "html" ? "text/html,application/xhtml+xml" : "text/plain,application/xml,text/xml",
        "User-Agent": "Mozilla/5.0 (compatible; EffixAuditBot/1.0; +https://effix.co.in/discover)",
      },
    });
  } catch (error) {
    const name = (error as { name?: string })?.name;
    if (name === "TimeoutError" || name === "AbortError") throw new RetrievalPolicyError("timeout", "Website retrieval timed out.");
    // DNS failures and refused connections surface as a generic network error in Workers
    throw Object.assign(new Error("Website could not be reached."), { code: "ENOTFOUND" });
  }
  const status = res.status;
  const location = res.headers.get("location");
  if ([301, 302, 303, 307, 308].includes(status) && location) {
    await res.body?.cancel().catch(() => {});
    if (redirects >= retrievalLimits.maxRedirects) throw new RetrievalPolicyError("too_many_redirects", "Too many redirects.");
    let next: URL;
    try {
      next = new URL(location, url);
    } catch {
      throw new RetrievalPolicyError("unsafe_redirect", "Redirect target is malformed.");
    }
    return retrieveSafely(next, kind, { maxBytes, redirects: redirects + 1 });
  }
  const contentType = res.headers.get("content-type") ?? "";
  if (status < 200 || status >= 300) {
    await res.body?.cancel().catch(() => {});
    throw new RetrievalPolicyError("http_status", `Website returned HTTP ${status}.`);
  }
  if (!accepts(kind, contentType)) {
    await res.body?.cancel().catch(() => {});
    throw new RetrievalPolicyError("unsupported_content_type", "Response content type is not allowed.");
  }
  const { body, bytes } = await readCapped(res, maxBytes);
  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => { headers[k] = v; });
  return { url: url.toString(), status, contentType, body, bytes, headers, redirects, ms: Date.now() - started };
}
