// Ported from Effix Discover (Search Tool): guarded single-page retrieval (DNS checks, 3 redirects, 1 MB, 8 s).
import { lookup } from "node:dns/promises";
import http from "node:http";
import https from "node:https";

import { isPublicAddress, RetrievalPolicyError, validateWebsiteUrl } from "./url-policy";

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

async function resolvePublic(hostname: string, resolver: DnsLookup) {
  const addresses = await resolver(hostname);
  if (!addresses.length || addresses.some((address) => !isPublicAddress(address))) {
    throw new RetrievalPolicyError(
      "unsafe_dns",
      "The destination resolved to a private or unavailable address.",
    );
  }
}

const defaultResolver: DnsLookup = async (hostname) => {
  const entries = await lookup(hostname, { all: true, verbatim: true });
  return entries.map((entry) => entry.address);
};

function accepts(kind: RetrievalKind, contentType: string) {
  const value = contentType.toLowerCase();
  if (kind === "html")
    return value.includes("text/html") || value.includes("application/xhtml+xml");
  if (kind === "xml") return value.includes("xml") || value.includes("text/plain");
  return value.includes("text/plain") || value.includes("xml");
}

export async function retrieveSafely(
  input: string | URL,
  kind: RetrievalKind,
  options: { resolver?: DnsLookup; maxBytes?: number; redirects?: number } = {},
): Promise<RetrievedResource> {
  const url = validateWebsiteUrl(String(input));
  const resolver = options.resolver ?? defaultResolver;
  await resolvePublic(url.hostname, resolver);
  const maxBytes =
    options.maxBytes ?? (kind === "html" ? retrievalLimits.htmlBytes : retrievalLimits.textBytes);
  const redirects = options.redirects ?? 0;
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const requestFn = url.protocol === "https:" ? https.request : http.request;
    const request = requestFn(
      url,
      {
        method: "GET",
        headers: {
          Accept:
            kind === "html"
              ? "text/html,application/xhtml+xml"
              : "text/plain,application/xml,text/xml",
          "Accept-Encoding": "identity",
          "User-Agent": "Mozilla/5.0 (compatible; EffixAuditBot/1.0; +https://effixlabs.in/discover)",
        },
        timeout: retrievalLimits.timeoutMs,
        lookup: (hostname, lookupOptions, callback) => {
          resolver(hostname)
            .then((addresses) => {
              // A single custom lookup result prevents Node's normal address-family fallback.
              // Prefer IPv4 when both families are public so a host with unusable IPv6 does not
              // turn an otherwise reachable website into a false retrieval failure.
              const address =
                addresses.find((candidate) => !candidate.includes(":")) ??
                addresses.find(isPublicAddress);
              const family = address?.includes(":") ? 6 : 4;
              if (!address || addresses.some((candidate) => !isPublicAddress(candidate))) {
                if (lookupOptions.all)
                  callback(new RetrievalPolicyError("unsafe_dns", "Unsafe DNS destination."), []);
                else
                  callback(
                    new RetrievalPolicyError("unsafe_dns", "Unsafe DNS destination."),
                    "",
                    4,
                  );
              } else if (lookupOptions.all) {
                callback(null, [{ address, family }]);
              } else {
                callback(null, address, family);
              }
            })
            .catch((error: unknown) => {
              if (lookupOptions.all) callback(error as Error, []);
              else callback(error as Error, "", 4);
            });
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const location = response.headers.location;
        if ([301, 302, 303, 307, 308].includes(status) && location) {
          response.resume();
          if (redirects >= retrievalLimits.maxRedirects)
            return reject(new RetrievalPolicyError("too_many_redirects", "Too many redirects."));
          let next: URL;
          try {
            next = new URL(location, url);
          } catch {
            return reject(
              new RetrievalPolicyError("unsafe_redirect", "Redirect target is malformed."),
            );
          }
          return resolve(
            retrieveSafely(next, kind, { resolver, maxBytes, redirects: redirects + 1 }),
          );
        }
        const contentType = response.headers["content-type"] ?? "";
        if (status < 200 || status >= 300) {
          response.resume();
          return reject(
            new RetrievalPolicyError("http_status", `Website returned HTTP ${status}.`),
          );
        }
        if (!accepts(kind, contentType)) {
          response.resume();
          return reject(
            new RetrievalPolicyError(
              "unsupported_content_type",
              "Response content type is not allowed.",
            ),
          );
        }
        const chunks: Buffer[] = [];
        let bytes = 0;
        response.on("data", (chunk: Buffer) => {
          bytes += chunk.length;
          if (bytes > maxBytes) {
            response.destroy();
            reject(
              new RetrievalPolicyError(
                "response_too_large",
                "Response exceeded its retrieval limit.",
              ),
            );
          } else chunks.push(chunk);
        });
        response.on("end", () =>
          resolve({
            url: url.toString(),
            status,
            contentType,
            body: Buffer.concat(chunks).toString("utf8"),
            bytes,
            headers: response.headers,
            redirects,
            ms: Date.now() - started,
          }),
        );
        response.on("error", (error) => reject(error));
      },
    );
    request.on("timeout", () =>
      request.destroy(new RetrievalPolicyError("timeout", "Website retrieval timed out.")),
    );
    request.on("error", (error) => reject(error));
    request.end();
  });
}
