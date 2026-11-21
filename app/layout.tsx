import type { Metadata } from "next";
import { organizationLd, ldString } from "@/lib/site";

const ORG_LD = ldString(organizationLd());

export const metadata: Metadata = {
  metadataBase: new URL("https://effix.co.in"),
  title: "Effix Labs",
  robots: { index: true, follow: true },
};

const FONTS = [
  "/fonts/AppleGaramond-Light.woff2",
  "/fonts/AppleGaramond-LightItalic.woff2",
  "/fonts/PlusJakartaSans-Light.woff2",
  "/fonts/PlusJakartaSans-Bold.woff2",
  "/fonts/GeistMono-Regular.woff2",
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_LD }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
