// Where the browser sends search requests. Empty in development (the Next dev server answers /api/... itself);
// in the static HTML build it is the Cloudflare Worker that runs the search (set NEXT_PUBLIC_API_BASE in .env.production).
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/+$/, "");
