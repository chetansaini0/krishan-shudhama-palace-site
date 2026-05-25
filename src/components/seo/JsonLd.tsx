import { HOTEL } from "@/lib/constants";

export function JsonLd() {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.includes("://")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.NEXT_PUBLIC_SITE_URL
      ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
      : "http://localhost:3000";

  const data = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: HOTEL.name,
    description: HOTEL.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: HOTEL.addressLine,
      addressLocality: HOTEL.city,
      addressRegion: HOTEL.state,
      postalCode: HOTEL.postalCode,
      addressCountry: "IN",
    },
    telephone: HOTEL.phone,
    email: HOTEL.email,
    url: site,
    image: HOTEL.heroVideoPoster,
    sameAs: [HOTEL.social.instagram, HOTEL.social.facebook].filter(Boolean),
    checkinTime: "13:00",
    checkoutTime: "11:00",
    priceRange: "₹₹",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
