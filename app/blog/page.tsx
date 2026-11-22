// Blog home: tinted header with title and description, diamond band, category pills, 3-column grid of posts.
import type { Metadata } from "next";

import { CATEGORIES, getPosts, postUrl } from "@/lib/blog";
import { SITE_URL, ldString } from "@/lib/site";
import { SiteFooter, SiteNav } from "../about/chrome";
import TopicFilter from "./filter";
import { DiamondBand, PostCard } from "./parts";
import "../about/about.css";
import "./blog.css";

const TITLE = "Effix Labs Blog: Guides to Getting Found on Google, Reddit and AI Search";
const DESC =
  "Practical guides from Effix Labs on Google Business Profile, SEO, AEO (AI search), Reddit and online communities, content and websites.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${SITE_URL}/blog`, types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` } },
  openGraph: { title: TITLE, description: DESC, url: `${SITE_URL}/blog`, type: "website", images: [{ url: `${SITE_URL}/images/og-home.jpg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${SITE_URL}/images/og-home.jpg`] },
};

export default function BlogPage() {
  const posts = getPosts();
  const topics = CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, count: posts.filter((p) => p.category === c.slug).length }));

  const ld = ldString({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        name: "Effix Labs Blog",
        description: DESC,
        url: `${SITE_URL}/blog`,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
        blogPost: posts.slice(0, 20).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: postUrl(p.slug), datePublished: p.date, dateModified: p.updated ?? p.date })),
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` }] },
    ],
  });

  return (
    <div className="ab bl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
      <SiteNav current="blog" />

      <main>
        <header className="bl-hero">
          <div className="bl-hero-in">
            <h1>The Effix <em>Blog</em></h1>
            <p>
              Practical guides on getting found where your customers search: Google, online communities and AI answers.
              Clear steps, real evidence, no shortcuts.
            </p>
          </div>
          <DiamondBand />
        </header>

        <section className="bl-list" id="guides" aria-label="Blog posts">
          <div className="bl-wrap">
            <p className="bl-cats-label">Categories</p>
            <TopicFilter topics={topics} total={posts.length} />
            {posts.length ? (
              <>
                <div className="bl-grid">{posts.map((p) => <PostCard key={p.slug} post={p} />)}</div>
                <p className="bl-none" hidden>No posts in this category yet.</p>
              </>
            ) : (
              <p className="bl-none">The first post is coming soon.</p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
