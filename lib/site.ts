// Site-wide configuration used for canonical URLs, sitemap and structured data.
export const SITE_URL = "https://effix.co.in";
export const ORG_ID = `${SITE_URL}/#organization`;

export const SERVICE_SLUGS = [
  "google-business-profile",
  "reddit-marketing",
  "seo-aeo-services",
  "content-writing",
  "website-design-development",
] as const;

// Business details for the Organization / ProfessionalService schema.
// Fields left empty are omitted from the JSON-LD rather than published as placeholders.
export const ORG = {
  name: "EFFIX Labs",
  alternateName: "Effix Labs",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/logo.png`, // 512x512 raster rendered from app/icon.svg (Google needs a raster logo)
  email: "effix.labs@gmail.com", // TODO: switch to a domain email (e.g. hello@effix.co.in) when available
  telephone: "", // TODO: add a public business phone number in international format, e.g. "+91-80-XXXX-XXXX"
  address: {
    streetAddress: "", // TODO: add street address if you want it public
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "", // TODO: add PIN code
    addressCountry: "IN",
  },
  sameAs: [] as string[], // TODO: add official profile URLs (LinkedIn, Google Business Profile, etc.)
};

type Json = Record<string, unknown>;

const clean = (o: Json): Json =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => !(v === "" || v == null || (Array.isArray(v) && v.length === 0)))
  );

export function organizationLd(): Json {
  return clean({
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: ORG.name,
    alternateName: ORG.alternateName,
    url: ORG.url,
    logo: ORG.logo,
    image: ORG.logo,
    email: ORG.email,
    telephone: ORG.telephone,
    address: clean({ "@type": "PostalAddress", ...ORG.address }),
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "City", name: "Bengaluru", alternateName: "Bangalore" },
    ],
    sameAs: ORG.sameAs,
  });
}

/** Serialise JSON-LD safely for an inline <script> tag. */
export function ldString(data: Json | Json[]): string {
  const body = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return JSON.stringify(body).replace(/</g, "\\u003c");
}
