// Effix Discover — free visibility audit at /discover (linked from the homepage audit form and buttons).
import type { Metadata } from "next";

import DiscoverClient from "./discover-client";
import "./discover.css";

const TITLE = "Effix Discover: Free Visibility Audit | Effix Labs";
const DESC = "Free visibility audit: enter your website and see live Google results for your brand on YouTube, Instagram, Facebook, LinkedIn, X, Reddit, Quora and Threads.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://effix.co.in/discover" },
  openGraph: { title: TITLE, description: DESC, url: "https://effix.co.in/discover", type: "website", images: [{ url: "https://effix.co.in/images/og-home.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["https://effix.co.in/images/og-home.jpg"] },
};

export default function DiscoverPage() {
  return (
    <>
      <DiscoverClient />
    </>
  );
}
