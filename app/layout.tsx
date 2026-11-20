import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://effix.co.in"),
  title: "Effix Labs",
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
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
