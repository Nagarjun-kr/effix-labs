// Effix SEO audit at /seo-audit: technical, content, AI visibility, speed and brand visibility dashboard.
import type { Metadata } from "next";

import { DISCOVER_PSE_ID } from "@/lib/site";
import SeoAuditClient from "./seo-audit-client";
import "./audit.css";
import "./dashboard.css";

const TITLE = "Free SEO Audit | Effix Labs";
const DESC = "Free website audit: technical SEO, content, AI-search visibility and Google speed scores with an action plan, plus live Google results for your brand on nine platforms.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://effix.co.in/seo-audit" },
  openGraph: { title: TITLE, description: DESC, url: "https://effix.co.in/seo-audit", type: "website", images: [{ url: "https://effix.co.in/images/og-home.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["https://effix.co.in/images/og-home.jpg"] },
};

export default function SeoAuditPage() {
  return (
    <>
      {/* Google's search element must render on demand (one element per platform), not by scanning the page. */}
      <script dangerouslySetInnerHTML={{ __html: 'window.__gcse = { parsetags: "explicit" };' }} />
      <SeoAuditClient engineId={DISCOVER_PSE_ID} />
    </>
  );
}
