// Blog editor at /admin (not linked from the site, blocked in robots.txt, noindex).
import type { Metadata } from "next";

import AdminApp from "./app";
import "../about/about.css";
import "../blog/blog.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Blog editor | Effix Labs",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return <AdminApp />;
}
