import type { Metadata } from "next";
import "./fx.css";
import { organizationLd, websiteLd, ldString } from "@/lib/site";

const ORG_LD = ldString([organizationLd(), websiteLd()]);

export const metadata: Metadata = {
  metadataBase: new URL("https://effixlabs.in"),
  title: "Effix Labs",
};

// Preload only the fonts every page's first screen needs (display headline, its italic word, body text); the bold
// and mono fonts load normally when used.
const FONTS = [
  "/fonts/AppleGaramond-Light.woff2",
  "/fonts/AppleGaramond-LightItalic.woff2",
  "/fonts/PlusJakartaSans-Light.woff2",
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-K2B7LH3R" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());`,
          }}
        />
        {FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_LD }} />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
