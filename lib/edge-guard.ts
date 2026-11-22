// Shared abuse protection for the API routes (runs in the Cloudflare Worker and in `next dev`):
// - readJson: reads a request body with a size cap, so huge payloads are refused before parsing.
// - edgeAllow: Cloudflare Workers Rate Limiting (bindings in wrangler.jsonc), shared across Worker instances.
//   It sits on top of the in-memory limits in lib/rate-limit.ts; outside the Worker it always allows.
// - verifyHuman: Cloudflare Turnstile check. Active only when the TURNSTILE_SECRET secret is set (and the site key
//   in lib/turnstile.ts is filled in); until then it allows every request.
import { clientKey } from "@/lib/rate-limit";

type Limiter = { limit: (o: { key: string }) => Promise<{ success: boolean }> };
type Bindings = Partial<Record<string, Limiter>>;

/** The Worker stores its env bindings here (worker/index.ts) so shared route code can reach them. */
export function setEdgeBindings(env: unknown) {
  (globalThis as { __effixEnv?: unknown }).__effixEnv = env;
}

const BINDING: Record<string, string> = {
  contact: "RL_CONTACT",
  "seo-audit": "RL_AUDIT",
  "seo-speed": "RL_SPEED",
  discovery: "RL_DISCOVERY",
  mentions: "RL_MENTIONS",
  verify: "RL_VERIFY",
};

export async function edgeAllow(request: Request, name: string): Promise<boolean> {
  const env = (globalThis as { __effixEnv?: Bindings }).__effixEnv;
  const limiter = env?.[BINDING[name]];
  if (!limiter) return true;
  try {
    return (await limiter.limit({ key: `${name}:${clientKey(request)}` })).success;
  } catch {
    return true; // never block real visitors because the limiter itself failed
  }
}

export { readJson, TooLarge } from "./read-json";

export const tooLargeResponse = () =>
  Response.json({ error: "That request is too large." }, { status: 413, headers: { "Cache-Control": "no-store" } });

/** Cloudflare Turnstile server check. Allows everything while TURNSTILE_SECRET is not set. */
export async function verifyHuman(request: Request, token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true;
  if (typeof token !== "string" || !token || token.length > 4096) return false;
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    const ip = clientKey(request);
    if (ip !== "unknown") form.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, signal: AbortSignal.timeout(8000) });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export const notHumanResponse = () =>
  Response.json({ error: "We couldn't confirm you're a person. Please reload the page and try again." }, { status: 403, headers: { "Cache-Control": "no-store" } });
