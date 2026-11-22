// A blog post: split header (category, title, author, date | cover to the edge) with the diamond band, a single
// reading column, optional FAQs, then the contact form and the site footer. BlogPosting/Breadcrumb/FAQ schema.
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categoryOf, formatDate, getPost, getPosts, postUrl, relatedPosts } from "@/lib/blog";
import { SITE_URL, ldString } from "@/lib/site";
import { SiteFooter, SiteNav } from "../../about/chrome";
import ContactForm from "../contact-form";
import { CategoryChip, Cover, DiamondBand } from "../parts";
import ReadingLine from "../reading-line";
import "../../about/about.css";
import "../blog.css";

export const dynamicParams = false;
export function generateStaticParams() {
  const posts = getPosts();
  // Static export needs at least one path; with no posts yet, a placeholder path that returns "not found".
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_none" }];
}

const imageOf = (cover?: string) => (cover ? (cover.startsWith("http") ? cover : `${SITE_URL}${cover}`) : `${SITE_URL}/images/og-home.jpg`);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Post not found | Effix Labs", robots: { index: false } };
  const url = postUrl(post.slug);
  return {
    title: post.metaTitle || `${post.title} | Effix Labs`,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: { title: post.metaTitle || post.title, description: post.description, url, type: "article", publishedTime: post.date, modifiedTime: post.updated ?? post.date, authors: [post.author], section: categoryOf(post.category).name, tags: post.tags, images: [{ url: imageOf(post.cover) }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [imageOf(post.cover)] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = postUrl(post.slug);
  const related = relatedPosts(post, 3);

  const ld = ldString({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        inLanguage: "en-IN",
        articleSection: categoryOf(post.category).name,
        keywords: post.tags.join(", "),
        image: imageOf(post.cover),
        author: { "@type": "Person", name: post.author, url: `${SITE_URL}/about`, worksFor: { "@id": `${SITE_URL}/#organization` } },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      ...(post.faq.length
        ? [{ "@type": "FAQPage", mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
    ],
  });

  return (
    <div className="ab bl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
      <SiteNav current="blog" />
      <ReadingLine />

      <main>
        <article>
          <header className="bl-post-hero">
            <div className="bl-post-copy">
              <a href="/blog" className="bl-back">← All posts</a>
              <CategoryChip category={post.category} />
              <h1>{post.title}</h1>
              <div className="bl-byline">
                <span className="bl-avatar" aria-hidden="true">{post.author.charAt(0)}</span>
                <span className="bl-byline-name">{post.author}</span>
                <span className="bl-byline-date">
                  Published: <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {post.updated && post.updated !== post.date ? <> · Updated: <time dateTime={post.updated}>{formatDate(post.updated)}</time></> : null}
                </span>
              </div>
            </div>
            <div className="bl-post-media"><Cover post={post} /></div>
            <DiamondBand />
          </header>

          <div className="bl-read">
            {post.takeaways.length > 0 && (
              <section className="bl-takeaways" aria-labelledby="bl-tk">
                <h2 id="bl-tk">Key takeaways</h2>
                <ul>{post.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
              </section>
            )}
            <div className="bl-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

            {/* FAQs: every question is its own heading with the answer visible (good for readers, Google and AI answers) */}
            {post.faq.length > 0 && (
              <section className="bl-faq" aria-labelledby="bl-faq-t">
                <h2 id="bl-faq-t">Frequently asked questions</h2>
                {post.faq.map((f) => (
                  <div key={f.q} className="bl-faq-item">
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </section>
            )}

            {related.length > 0 && (
              <section className="bl-related-list" aria-labelledby="bl-rel-t">
                <h2 id="bl-rel-t">Related articles</h2>
                <ul>{related.map((r) => <li key={r.slug}><a href={`/blog/${r.slug}`}>{r.title}</a></li>)}</ul>
              </section>
            )}

            {post.sources.length > 0 && (
              <p className="bl-sources">
                Sources reviewed {formatDate(post.updated ?? post.date)}:{" "}
                {post.sources.map((x, i) => (
                  <span key={x.url}>
                    <a href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>
                    {i < post.sources.length - 1 ? ", " : "."}
                  </span>
                ))}
              </p>
            )}

            <footer className="bl-post-foot">
              <span className="bl-post-foot-left">
                <CategoryChip category={post.category} />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              <span className="bl-post-foot-author">
                <span className="bl-avatar" aria-hidden="true">{post.author.charAt(0)}</span>
                {post.author}
              </span>
            </footer>
          </div>
        </article>

        {related.length > 0 && (
          <section className="bl-more" aria-labelledby="bl-more-t">
            <div className="bl-wrap">
              <h2 id="bl-more-t">More articles</h2>
              <div className="bl-more-grid">
                {related.map((r) => (
                  <a key={r.slug} href={`/blog/${r.slug}`} className="bl-more-card">
                    <Cover post={r} />
                    <span>{r.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bl-contact" aria-labelledby="bl-contact-t">
          <div className="bl-contact-in">
            <h2 id="bl-contact-t">Contact <em>us</em></h2>
            <p className="bl-contact-sub">Tell us about your business. We&apos;ll show you where you can be found, and how to get there.</p>
            <ContactForm source={url} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
