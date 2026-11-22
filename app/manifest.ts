import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Web app manifest (out/manifest.webmanifest): name, colours and icons used when the site is saved to a home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Effix Labs",
    short_name: "Effix Labs",
    description: "Effix Labs helps businesses get found on Google, in online communities and in AI search.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#151515",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
