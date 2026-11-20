import type { NextConfig } from "next";

// Old static-site URLs and duplicate service pages -> canonical routes
const dupes: Record<string, string> = {
  "google-business-profile-growth": "google-business-profile",
  "reddit-quora-visibility": "reddit-marketing",
  "reddit-quora-marketing": "reddit-marketing",
  "ai-blog-seo": "ai-assisted-blog-seo",
};
const services = [
  "google-business-profile",
  "reddit-marketing",
  "ai-assisted-blog-seo",
  "ai-search-visibility",
  "website-design-development",
];

const nextConfig: NextConfig = {
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
