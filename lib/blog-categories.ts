// Blog categories, shared by the site and the editor (no Node APIs).
export const CATEGORIES = [
  { slug: "google-business-profile", name: "Google Business Profile", icon: "Google" },
  { slug: "seo-aeo", name: "SEO & AEO", icon: "Google" },
  { slug: "reddit-communities", name: "Reddit & Communities", icon: "Reddit" },
  { slug: "content", name: "Content", icon: "" },
  { slug: "websites", name: "Websites", icon: "" },
] as const;
export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export const categoryOf = (slug: string) => CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[1];
