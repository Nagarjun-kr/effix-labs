import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { SITE_URL, SERVICE_SLUGS } from "@/lib/site";

export const dynamic = "force-static";

// lastModified is given only where we know the real date (blog posts and the blog index). Static pages leave it out:
// stamping every page with the build time on each daily rebuild would teach Google to ignore the field.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const postDate = (p: (typeof posts)[number]) => new Date(p.updated ?? p.date);
  const newest = posts.length ? new Date(Math.max(...posts.map((p) => postDate(p).getTime()))) : undefined;
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...SERVICE_SLUGS.map((slug) => ({ url: `${SITE_URL}/services/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/blog`, lastModified: newest, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: postDate(p), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/casestudy/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/seo-audit-tool/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
