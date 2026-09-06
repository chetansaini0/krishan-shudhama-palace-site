import { SPIRITUAL_IMAGES } from "./spiritual-media";

/** Client-safe branding via NEXT_PUBLIC_* — rebuild after changing env for client bundles. */
function pe(key: string, fallback: string): string {
  const v = process.env[key];
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

export const HOTEL = {
  name: pe("NEXT_PUBLIC_HOTEL_NAME", "Krishan Shudhama Palace"),
  shortName: pe("NEXT_PUBLIC_HOTEL_SHORT_NAME", "Krishan Shudhama"),
  tagline: pe(
    "NEXT_PUBLIC_HOTEL_TAGLINE",
    "Temple-adjacent luxury — devotion, royal ease & calm hospitality near Khatu Shyam Ji",
  ),
  description: pe(
    "NEXT_PUBLIC_HOTEL_DESCRIPTION",
    "Inspired by the spiritual aura of Khatu Shyam Temple, Krishan Shudhama Palace blends Rajasthani palace grandeur with serene seva-style care — a refined sanctuary where yatra becomes experience: peaceful, premium, and warmly welcoming for pilgrims, families, and celebrations.",
  ),
  spiritualLine: pe(
    "NEXT_PUBLIC_HOTEL_SPIRITUAL_LINE",
    "Perfect stay beside the temple · Peaceful hearts, blessed journeys",
  ),
  phone: pe("NEXT_PUBLIC_HOTEL_PHONE", "+91 80034 02154"),
  phoneTel: pe("NEXT_PUBLIC_HOTEL_PHONE_TEL", "tel:+918003402154"),
  whatsapp: pe("NEXT_PUBLIC_WHATSAPP", "918003402154"),
  email: pe("NEXT_PUBLIC_HOTEL_EMAIL", "krishanshudhama1902@gmail.com"),
  addressLine: pe(
    "NEXT_PUBLIC_HOTEL_ADDRESS_LINE",
    "Near Khatu Shyam Ji · Khatu, Rajasthan",
  ),
  city: pe("NEXT_PUBLIC_HOTEL_CITY", "Khatu"),
  state: pe("NEXT_PUBLIC_HOTEL_STATE", "Rajasthan"),
  postalCode: pe("NEXT_PUBLIC_HOTEL_POSTAL", "332602"),
  fullAddress: pe(
    "NEXT_PUBLIC_HOTEL_FULL_ADDRESS",
    "Near Khatu Shyam Temple, Khatu, Rajasthan — India",
  ),
  /** Hours shown on site + Google Business Profile (keep in sync). */
  businessHours: {
    frontDesk: "Open 24 hours",
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
    restaurant: "7:00 AM – 10:30 PM",
  },
  /** Paste into Google Business Profile → Business description */
  gbpDescription: pe(
    "NEXT_PUBLIC_GBP_DESCRIPTION",
    "Krishan Shudhama Palace is a luxury hotel in Khatoo (Khatu) near Khatu Shyam Ji Temple. We offer palace-style AC rooms, pure vegetarian dining, banquet hall for weddings, free parking, and 24/7 concierge — ideal for pilgrims, families, and group yatras visiting Khatu Shyam Temple.",
  ),
  mapsEmbedUrl: pe(
    "NEXT_PUBLIC_MAPS_EMBED_URL",
    "https://www.google.com/maps?q=27.3660278,75.3936111&z=17&output=embed",
  ),
  mapsLink: pe(
    "NEXT_PUBLIC_MAPS_LINK",
    "https://www.google.com/maps/search/?api=1&query=27.3660278,75.3936111",
  ),
  social: {
    instagram: pe(
      "NEXT_PUBLIC_INSTAGRAM_URL",
      "https://www.instagram.com/krishan_shudhama_palace/",
    ),
    /** Leave empty until Facebook page is created — set NEXT_PUBLIC_FACEBOOK_URL in Vercel. */
    facebook: pe("NEXT_PUBLIC_FACEBOOK_URL", ""),
  },
  reviewsUrl: pe(
    "NEXT_PUBLIC_REVIEWS_URL",
    "https://www.google.com/maps/place/?q=place_id:ChIJf3y_gV7tbDkR_sHEBjQk-QI",
  ),
  heroVideoPoster: pe("NEXT_PUBLIC_HERO_POSTER_URL", SPIRITUAL_IMAGES.luxuryInterior),
  /** Empty by default — set NEXT_PUBLIC_HERO_VIDEO_URL only when self-hosted property video is ready. */
  heroVideoSrc: pe("NEXT_PUBLIC_HERO_VIDEO_URL", ""),
  googlePlaceId: pe("NEXT_PUBLIC_GOOGLE_PLACE_ID", "ChIJf3y_gV7tbDkR_sHEBjQk-QI"),
};

export const BANQUET = {
  capacityMin: Number(pe("NEXT_PUBLIC_BANQUET_CAPACITY_MIN", "100")) || 100,
  capacityMax: Number(pe("NEXT_PUBLIC_BANQUET_CAPACITY_MAX", "500")) || 500,
  hallName: pe("NEXT_PUBLIC_BANQUET_HALL_NAME", "Maharaja Grand Ballroom"),
  highlights: (
    pe(
      "NEXT_PUBLIC_BANQUET_HIGHLIGHTS",
      "Pillar-free AC banquet hall with premium acoustics|Stage, intelligent lighting & premium sound system|In-house catering & curated menus|Ample valet parking & separate guest entry",
    )
  ).split("|"),
  eventTypes: (
    pe(
      "NEXT_PUBLIC_BANQUET_EVENT_TYPES",
      "Weddings & receptions|Birthdays & anniversaries|Corporate conferences|Product launches & galas",
    )
  ).split("|"),
};
