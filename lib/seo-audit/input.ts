// Validates the website a visitor typed (adds https:// when missing) and maps errors to friendly text.
import { RetrievalPolicyError, validateWebsiteUrl } from "@/lib/discover/url-policy";

export function normalizeInput(value: unknown): URL {
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

export function friendlyError(error: unknown): { message: string; status: number } {
  if (error instanceof RetrievalPolicyError) return { message: friendly[error.code] ?? error.message, status: 400 };
  return { message: "We couldn't open that website. Check the address and try again.", status: 502 };
}
