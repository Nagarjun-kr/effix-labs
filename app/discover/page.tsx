// Effix Discover — free visibility audit at /discover (linked from the homepage audit form and buttons).
import type { Metadata } from "next";

import DiscoverClient from "./discover-client";
import "./discover.css";

const TITLE = "Effix Discover: Free Visibility Audit | Effix Labs";
const DESC = "Free visibility audit: enter your website and see live Google results for your brand on YouTube, Instagram, Facebook, LinkedIn, X, Reddit, Quora and Threads.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://effixlabs.in/discover" },
  // Results pages only; the audit starts from the homepage search box.
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESC, url: "https://effixlabs.in/discover", type: "website", images: [{ url: "https://effixlabs.in/images/og-home.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["https://effixlabs.in/images/og-home.jpg"] },
};

export default function DiscoverPage() {
  return (
    <>
      <DiscoverClient />
    </>
  );
}
