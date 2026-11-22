import type { NextConfig } from "next";

// Old static-site URLs and duplicate service pages -> canonical routes
const dupes: Record<string, string> = {
  "google-business-profile-growth": "google-business-profile",
  "reddit-quora-visibility": "reddit-marketing",
  "reddit-quora-marketing": "reddit-marketing",
  "ai-blog-seo": "content-writing",
  "ai-assisted-blog-seo": "content-writing",
  "ai-search-visibility": "seo-aeo-services",
};
const services = [
  "google-business-profile",
  "reddit-marketing",
  "content-writing",
  "seo-aeo-services",
  "website-design-development",
];

// `next build` produces a plain HTML site in out/ (uploaded to the web host; public/.htaccess gives it clean URLs and
// the redirects below). The search API (app/api/**/route.api.ts) only runs in `next dev`; in production it runs on
// the Cloudflare Worker in worker/.
const STATIC = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Changes on every build / dev start; appended to the legacy page scripts so browsers never run stale copies.
  env: { NEXT_PUBLIC_ASSET_V: String(Date.now()) },
  output: STATIC ? "export" : undefined,
  images: { unoptimized: true },
  pageExtensions: STATIC ? ["tsx", "ts"] : ["tsx", "ts", "api.ts"],
  // Static export can't run redirects; public/.htaccess does the same on the web host.
  ...(STATIC ? {} : { redirects }),
};

async function redirects() {
    const r = [
      { source: "/index.html", destination: "/", permanent: true },
      ...Object.entries(dupes).flatMap(([from, to]) => [
        { source: `/services/${from}`, destination: `/services/${to}`, permanent: true },
        { source: `/services/${from}.html`, destination: `/services/${to}`, permanent: true },
        { source: `/services/${from}/index.html`, destination: `/services/${to}`, permanent: true },
      ]),
      ...services.flatMap((s) => [
        { source: `/services/${s}.html`, destination: `/services/${s}`, permanent: true },
        { source: `/services/${s}/index.html`, destination: `/services/${s}`, permanent: true },
      ]),
    ];
    return r;
}

export default nextConfig;
