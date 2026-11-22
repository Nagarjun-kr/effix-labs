// Shared blog pieces: generated cover art, category chip with the Effix mark, post card and the diamond band.
import { categoryOf, formatDate, type PostMeta } from "@/lib/blog";

/** Colours per category, from the Effix palette (lavender, violet, lime, blue, coral, ink). */
const PALETTE: Record<string, [string, string, string, string]> = {
  "google-business-profile": ["#dfe9ff", "#4f8df7", "#a3e635", "#7c5cf0"],
  "seo-aeo": ["#ece6ff", "#7c5cf0", "#c4b5fd", "#a3e635"],
  "reddit-communities": ["#ffe6d9", "#ff7a3d", "#ffb38a", "#7c5cf0"],
  content: ["#f1fbe2", "#8cc651", "#d9f99d", "#7c5cf0"],
  websites: ["#e9e7f2", "#2b2840", "#7c5cf0", "#a3e635"],
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** The post's own image, or generated abstract art: soft colour fields in the category palette, grain and a faint
 *  diamond texture. Each post gets a different composition (seeded by its slug). */
export function Cover({ post, className = "", eager = false }: { post: PostMeta; className?: string; eager?: boolean }) {
  if (post.cover) {
    // Any image size fits the same 16:9 frame: the picture is shown in full (never cropped) and the space around it
    // is filled with a soft, blurred copy of the same image, so the frame always takes on that image's colours.
    // width/height give the browser the recommended 16:9 size up front (the CSS frame sets the real size).
    return (
      <span className={`bl-cover is-photo ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bl-cover-bg" src={post.cover} alt="" aria-hidden="true" width={1600} height={900} loading={eager ? "eager" : "lazy"} decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bl-cover-img" src={post.cover} alt={post.coverAlt || post.title} width={1600} height={900} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />
      </span>
    );
  }
  const [base, a, b, c] = PALETTE[post.category] ?? PALETTE["seo-aeo"];
  const h = hash(post.slug);
  const p = (n: number, min: number, span: number) => min + ((h >> n) % span);
  const angle = p(3, 0, 360);
  const bg = [
    `radial-gradient(${p(1, 40, 30)}% ${p(5, 50, 30)}% at ${p(2, 5, 40)}% ${p(4, 10, 50)}%, ${a} 0%, transparent 70%)`,
    `radial-gradient(${p(6, 35, 30)}% ${p(9, 45, 30)}% at ${p(7, 55, 40)}% ${p(8, 40, 55)}%, ${b} 0%, transparent 72%)`,
    `radial-gradient(${p(10, 25, 20)}% ${p(12, 30, 20)}% at ${p(11, 30, 50)}% ${p(13, 60, 35)}%, ${c} 0%, transparent 70%)`,
    `linear-gradient(${angle}deg, ${base}, #ffffff)`,
  ].join(", ");
  return (
    <span className={`bl-cover is-art ${className}`} style={{ background: bg }} aria-hidden="true">
      <span className="bl-cover-diamonds" />
      <span className="bl-cover-grain" />
    </span>
  );
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M12 7.5L7.5 12L12 16.5L16.5 12L12 7.5Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryChip({ category }: { category: string }) {
  return (
    <span className="bl-chip">
      <Mark className="bl-chip-mark" />
      {categoryOf(category).name}
    </span>
  );
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="bl-card" data-cat={post.category}>
      <a href={`/blog/${post.slug}`} className="bl-card-cover" tabIndex={-1} aria-hidden="true">
        <Cover post={post} />
      </a>
      <h2 className="bl-card-title"><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
      <div className="bl-card-meta">
        <CategoryChip category={post.category} />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
    </article>
  );
}

/** Rows of Effix diamonds that grow from small to touching, dissolving the tinted band into white. */
export function DiamondBand() {
  return (
    <span className="bl-band" aria-hidden="true">
      <i className="r1" />
      <i className="r2" />
      <i className="r3" />
    </span>
  );
}
