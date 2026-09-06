import type { Metadata } from "next";
import { HOTEL } from "@/lib/constants";

export const DEFAULT_OG_IMAGE = "/images/og-default.png";

/** Primary + secondary local search keywords (Khatu / Khatoo variants). */
export const SEO_KEYWORDS = [
  "hotel in Khatoo",
  "hotel in Khatu",
  "best hotel in Khatoo",
  "best hotel in Khatu",
  "hotel near Khatu Shyam Ji",
  "hotel near Khatu Shyam Temple",
  "best stay near Khatu Shyam Temple",
  "rooms in Khatoo",
  "luxury hotel in Khatoo",
  "family hotel in Khatoo",
  "luxury rooms in Khatoo",
  "affordable hotel near Khatu Shyam Temple",
  "accommodation in Khatoo",
  "palace hotel Khatu",
  "banquet hall Khatu",
  "wedding venue Khatu Shyam",
  HOTEL.name,
  "Krishan Shudhama Palace Khatu",
  "krishanshudhamapalace",
  "krishanshudhamapalace.com",
  "www.krishanshudhamapalace.com",
  "direct hotel booking Khatu",
] as const;

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
};

/** Consistent per-page metadata: title, description, canonical, OG, Twitter. */
export function buildPageMetadata(input: PageMetaInput): Metadata {
  const image = input.ogImage ?? DEFAULT_OG_IMAGE;
  const fullTitle = input.title;

  return {
    title: fullTitle,
    description: input.description,
    keywords: input.keywords ?? [...SEO_KEYWORDS],
    alternates: { canonical: input.path },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: input.path,
      type: "website",
      locale: "en_IN",
      siteName: HOTEL.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
  };
}
