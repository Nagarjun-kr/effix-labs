// Ported from Effix Discover (Search Tool): public-website URL policy (blocks local/private targets).
import { isIP } from "node:net";

export class RetrievalPolicyError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "RetrievalPolicyError";
  }
}

export function validateWebsiteUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new RetrievalPolicyError("invalid_url", "The website URL is malformed.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new RetrievalPolicyError(
      "unsupported_protocol",
      "Only HTTP and HTTPS URLs are supported.",
    );
  }
  if (!url.hostname || url.username || url.password) {
    throw new RetrievalPolicyError("unsafe_url", "Website URLs cannot include credentials.");
  }
  if (
    url.port &&
    !(
      (url.protocol === "http:" && url.port === "80") ||
      (url.protocol === "https:" && url.port === "443")
    )
  ) {
    throw new RetrievalPolicyError("unsafe_port", "Nonstandard ports are not permitted.");
  }
  if (url.hostname.toLowerCase() === "localhost" || url.hostname.endsWith(".localhost")) {
    throw new RetrievalPolicyError("unsafe_host", "Local destinations are not permitted.");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(hostname) && !isPublicAddress(hostname)) {
    throw new RetrievalPolicyError("unsafe_ip", "Private or reserved addresses are not permitted.");
  }
  url.hash = "";
  return url;
}

/** Conservative deny-list: addresses reserved for local, private, test, or multicast use never leave the worker. */
export function isPublicAddress(address: string): boolean {
  if (address.includes(":")) {
    const value = address.toLowerCase();
    if (
      value === "::" ||
      value === "::1" ||
      value.startsWith("fe8") ||
      value.startsWith("fe9") ||
      value.startsWith("fea") ||
      value.startsWith("feb") ||
      value.startsWith("fc") ||
      value.startsWith("fd") ||
      value.startsWith("2001:db8:")
    )
      return false;
    if (value.startsWith("::ffff:")) {
      const rest = value.slice(7);
      // dotted form (::ffff:127.0.0.1) or hex form (::ffff:7f00:1); check the IPv4 address inside either way
      const hex = rest.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
      if (hex) {
        const hi = parseInt(hex[1], 16), lo = parseInt(hex[2], 16);
        return isPublicAddress(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
      }
      return isPublicAddress(rest);
    }
    return true;
  }
  const octets = address.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  )
    return false;
  const [a, b] = octets;
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && (b === 0 || b === 168)) return false;
  if (a === 198 && (b === 18 || b === 19 || b === 51)) return false;
  if (a === 203 && b === 0) return false;
  return true;
}
