import { HOTEL } from "@/lib/constants";
import { siteUrl } from "@/lib/site-url";

const LAT = 27.3660278;
const LNG = 75.3936111;

export function JsonLd() {
  const site = siteUrl();
  const ogImage = `${site}/images/our-story-room.png`;

  const hotel = {
    "@context": "https://schema.org",
    "@type": ["Hotel", "LodgingBusiness"],
    "@id": `${site}/#hotel`,
    name: HOTEL.name,
    alternateName: HOTEL.shortName,
    description: HOTEL.description,
    url: site,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    image: [ogImage, HOTEL.heroVideoPoster].filter(Boolean),
    logo: `${site}/logo-light.png`,
    priceRange: "₹₹",
    checkinTime: "13:00",
    checkoutTime: "11:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: HOTEL.addressLine,
      addressLocality: HOTEL.city,
      addressRegion: HOTEL.state,
      postalCode: HOTEL.postalCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LAT,
      longitude: LNG,
    },
    hasMap: HOTEL.mapsLink,
    sameAs: [HOTEL.social.instagram, HOTEL.social.facebook, HOTEL.mapsLink].filter(Boolean),
    ...(HOTEL.googlePlaceId
      ? { identifier: { "@type": "PropertyValue", propertyID: "Google Place ID", value: HOTEL.googlePlaceId } }
      : {}),
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site}/#localbusiness`,
    name: HOTEL.name,
    description: HOTEL.description,
    url: site,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    image: ogImage,
    address: hotel.address,
    geo: hotel.geo,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: HOTEL.name,
    url: site,
    description: HOTEL.description,
    publisher: { "@id": `${site}/#hotel` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site}/rooms?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const graph = [hotel, localBusiness, website];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
