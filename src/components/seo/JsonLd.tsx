import { HOTEL, BANQUET } from "@/lib/constants";
import { GUEST_REVIEWS } from "@/lib/reviews";
import { siteUrl } from "@/lib/site-url";

const LAT = 27.3660278;
const LNG = 75.3936111;

const HOTEL_AMENITIES = [
  "Free Wi-Fi",
  "Air conditioning",
  "Room service",
  "Restaurant",
  "Banquet hall",
  "Parking",
  "24-hour front desk",
  "Concierge",
  "Vegetarian dining",
  "Temple shuttle",
];

export function JsonLd() {
  const site = siteUrl();
  const ogImage = `${site}/images/our-story-room.png`;
  const avgRating =
    GUEST_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / GUEST_REVIEWS.length;

  const address = {
    "@type": "PostalAddress" as const,
    streetAddress: HOTEL.addressLine,
    addressLocality: HOTEL.city,
    addressRegion: HOTEL.state,
    postalCode: HOTEL.postalCode,
    addressCountry: "IN",
  };

  const geo = {
    "@type": "GeoCoordinates" as const,
    latitude: LAT,
    longitude: LNG,
  };

  const hotel = {
    "@type": ["Hotel", "LodgingBusiness"],
    "@id": `${site}/#hotel`,
    name: HOTEL.name,
    alternateName: [
      HOTEL.shortName,
      "Krishan Shudhama Palace Khatu",
      "Hotel in Khatoo",
      "krishanshudhamapalace",
      "krishanshudhamapalace.com",
      "www.krishanshudhamapalace.com",
    ],
    description: HOTEL.description,
    url: site,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    image: [ogImage, HOTEL.heroVideoPoster].filter(Boolean),
    logo: `${site}/logo-light.png`,
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Credit Card, UPI",
    checkinTime: "13:00",
    checkoutTime: "11:00",
    numberOfRooms: 8,
    amenityFeature: HOTEL_AMENITIES.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    address,
    geo,
    hasMap: HOTEL.mapsLink,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: String(GUEST_REVIEWS.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: GUEST_REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewBody: r.quote,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
      },
    })),
    sameAs: [HOTEL.social.instagram, HOTEL.social.facebook, HOTEL.mapsLink, HOTEL.reviewsUrl].filter(
      Boolean,
    ),
    ...(HOTEL.googlePlaceId
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "Google Place ID",
            value: HOTEL.googlePlaceId,
          },
        }
      : {}),
  };

  const localBusiness = {
    "@type": "LocalBusiness",
    "@id": `${site}/#localbusiness`,
    name: HOTEL.name,
    description: `Best hotel in Khatoo near Khatu Shyam Temple — ${HOTEL.name} offers luxury rooms, pure veg dining, and banquet facilities.`,
    url: site,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    image: ogImage,
    priceRange: "₹₹₹",
    address,
    geo,
    areaServed: {
      "@type": "City",
      name: "Khatu",
      containedInPlace: { "@type": "State", name: "Rajasthan" },
    },
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Rooms & Events",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "HotelRoom", name: "Deluxe King" } },
        { "@type": "Offer", itemOffered: { "@type": "HotelRoom", name: "Royal Suite" } },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EventVenue",
            name: BANQUET.hallName,
            maximumAttendeeCapacity: BANQUET.capacityMax,
          },
        },
      ],
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: HOTEL.name,
    alternateName: ["krishanshudhamapalace", "krishanshudhamapalace.com"],
    url: site,
    description: HOTEL.description,
    publisher: { "@id": `${site}/#hotel` },
    inLanguage: "en-IN",
  };

  const graph = [hotel, localBusiness, website];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
