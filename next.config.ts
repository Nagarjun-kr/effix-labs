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

const nextConfig: NextConfig = {
  // Changes on every build / dev start; appended to the legacy page scripts so browsers never run stale copies.
  env: { NEXT_PUBLIC_ASSET_V: String(Date.now()) },
  async redirects() {
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
  },
};

export default nextConfig;
