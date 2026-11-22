// Where the browser sends search requests. In development the Next dev server answers /api/... itself; the static
// HTML build sends them to the Cloudflare Worker that runs the search (wrangler.jsonc, worker/). Override with
// NEXT_PUBLIC_API_BASE if the Worker moves (e.g. to api.effixlabs.in).
const WORKER = "https://effix-search.effix-labs.workers.dev";

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? (process.env.NODE_ENV === "production" ? WORKER : "")).replace(/\/+$/, "");
