// Shared types for the Effix SEO audit (server checks + dashboard).
import type { BrandIdentity } from "@/lib/discover/brand-identity";

export type Category = "technical" | "content" | "ai";
export type Severity = "high" | "medium" | "low";

/** One check result. Failed checks become issues; passed checks are listed so the report shows what is fine. */
export type Check = {
  code: string;
  category: Category;
  passed: boolean;
  severity: Severity;
  title: string; // what we checked, phrased as the problem when failed
  evidence: string; // what we actually found
  fix: string; // what to do (only meaningful when failed)
  impact: number; // points taken off the category score when failed
};

export type PageData = {
  url: string;
  status: number;
  ms: number;
  bytes: number;
  title: string;
  description: string;
  canonical: string | null;
  robotsMeta: string;
  xRobots: string;
  lang: string;
  viewport: string | null;
  h1s: string[];
  headingOrder: number[]; // 1..6 in document order
  questionHeadings: string[];
  wordCount: number;
  scriptCount: number;
  images: number;
  imagesMissingAlt: number;
  internalLinks: string[];
  externalLinks: number;
  og: { title: string; description: string; image: string };
  twitterCard: string;
  schemaTypes: string[];
  schemaErrors: number;
  hasEmail: boolean;
  hasPhone: boolean;
};

export type SampledPage = {
  url: string;
  status: number | null; // null when it could not be fetched
  error?: string;
  broken?: boolean; // failed in a way a visitor would notice (4xx/5xx, timeout, redirect loop)
  title: string;
  description: string;
  h1Count: number;
  wordCount: number;
  noindex: boolean;
  ms: number;
};

export type SiteFiles = {
  robots: { found: boolean; blocksAll: boolean; sitemaps: string[]; aiBlocked: string[]; text: string };
  sitemap: { found: boolean; url: string | null; urlCount: number };
  llmsTxt: boolean;
  httpsRedirect: boolean | null; // does http:// end on https://
  hostVariantOk: boolean | null; // does www/non-www variant redirect to the same host
  hostVariant: string;
  hostVariantCanonical: string | null; // canonical on the variant copy, when it doesn't redirect
};

export type AiInsights = {
  generated: boolean;
  summary: string;
  fixes: Record<string, string>; // check code -> tailored fix
};

export type AuditReport = {
  url: string;
  host: string;
  auditedAt: string;
  page: PageData;
  site: SiteFiles;
  pages: SampledPage[];
  checks: Check[];
  scores: { technical: number; content: number; ai: number };
  identity: BrandIdentity;
  ai: AiInsights;
};

export type SpeedReport = {
  strategy: "mobile" | "desktop";
  score: number | null;
  metrics: { id: string; label: string; display: string; score: number | null }[];
  field: { label: string; category: string; display: string }[] | null;
  opportunities: { title: string; savings: string }[];
};
