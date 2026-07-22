export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readMinutes: number;
  keywords: string[];
  sections: { heading: string; paragraphs: string[] }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "top-places-near-khatu-shyam-temple",
    title: "Top Places to Visit Near Khatu Shyam Temple",
    description:
      "Plan your Khatu yatra with the best temples, markets, and day trips near Khatu Shyam Ji — plus where to stay comfortably in Khatoo.",
    publishedAt: "2026-06-01",
    readMinutes: 6,
    keywords: [
      "places near Khatu Shyam Temple",
      "Khatoo sightseeing",
      "Khatu yatra guide",
      "hotel near Khatu Shyam Ji",
    ],
    sections: [
      {
        heading: "Khatu Shyam Temple — the heart of your yatra",
        paragraphs: [
          "Khatu Shyam Ji is the spiritual centre of every pilgrimage to Khatoo (Khatu). Most devotees begin their day with morning darshan and return for evening aarti. Staying at a hotel within walking distance saves travel time and keeps your yatra peaceful.",
          "Krishan Shudhama Palace is located steps from the temple, making it one of the most convenient luxury stays for families and groups visiting Khatu Shyam Ji.",
        ],
      },
      {
        heading: "Salasar Balaji & nearby temples",
        paragraphs: [
          "Many pilgrims combine Khatu Shyam Ji with Salasar Balaji (about one hour by road). Other nearby spiritual stops include Jeen Mata and local shrines in the Sikar district.",
          "Our concierge can arrange temple-route shuttles and guided day trips so you focus on devotion while we handle logistics.",
        ],
      },
      {
        heading: "Local markets & evening walks",
        paragraphs: [
          "Khatoo's main market is a short walk from the temple — ideal for prasad, souvenirs, and evening strolls after darshan. The area is lively during festival seasons and pleasantly calm on weekdays.",
        ],
      },
    ],
  },
  {
    slug: "best-time-to-visit-khatu-shyam-ji",
    title: "Best Time to Visit Khatu Shyam Ji",
    description:
      "When to plan your Khatu Shyam yatra — festivals, weather, crowd levels, and tips for booking the best hotel in Khatoo in advance.",
    publishedAt: "2026-06-05",
    readMinutes: 5,
    keywords: [
      "best time to visit Khatu Shyam Ji",
      "Khatoo weather",
      "Khatu Shyam festival",
      "book hotel Khatu",
    ],
    sections: [
      {
        heading: "Peak seasons & festivals",
        paragraphs: [
          "The busiest periods at Khatu Shyam Ji include Phalguna Mela and major Hindu festivals when lakhs of devotees visit. Rooms in Khatoo fill quickly — we recommend booking your hotel at least 2–4 weeks ahead during peak season.",
          "Krishan Shudhama Palace offers direct booking on our website with transparent rates and instant confirmation.",
        ],
      },
      {
        heading: "Weather across the year",
        paragraphs: [
          "October to March offers pleasant weather for temple visits and family stays. Summer months (April–June) are warm but manageable with air-conditioned rooms. Monsoon (July–September) brings fewer crowds and a serene atmosphere.",
        ],
      },
      {
        heading: "Tips for a smooth yatra",
        paragraphs: [
          "Arrive a day early during festivals to avoid last-minute rush. Pack modest temple attire, comfortable footwear, and light layers for early-morning darshan. Our team provides yatra assistance, parking, and vegetarian dining on-site.",
        ],
      },
    ],
  },
  {
    slug: "why-choose-our-hotel-in-khatoo",
    title: "Why Choose Our Hotel in Khatoo Near Khatu Shyam Temple",
    description:
      "Discover why Krishan Shudhama Palace is rated among the best hotels in Khatoo — temple-adjacent location, luxury rooms, pure veg dining, and banquet facilities.",
    publishedAt: "2026-06-10",
    readMinutes: 5,
    keywords: [
      "best hotel in Khatoo",
      "luxury hotel Khatu",
      "hotel near Khatu Shyam Temple",
      "family hotel Khatoo",
    ],
    sections: [
      {
        heading: "Walkable to Khatu Shyam Ji",
        paragraphs: [
          "Location matters on a pilgrimage. Our hotel in Khatoo is minutes from Khatu Shyam Temple — no long commutes after darshan. Families, elderly guests, and group yatras especially appreciate the short walk back to restful rooms.",
        ],
      },
      {
        heading: "Luxury rooms for every traveller",
        paragraphs: [
          "From Deluxe King rooms for couples to Royal Suites for families, we offer luxury accommodation in Khatoo with Rajasthani-inspired interiors, climate control, and attentive service.",
        ],
      },
      {
        heading: "Dining, events & direct booking",
        paragraphs: [
          "Enjoy 100% pure vegetarian multi-cuisine dining. Host weddings and receptions in our pillar-free banquet hall. Book directly on our website for the best rates — no third-party commissions, secure Razorpay checkout, and dedicated concierge support.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
