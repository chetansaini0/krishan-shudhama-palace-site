import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GalleryClient } from "@/components/gallery/GalleryClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Photo Gallery — Luxury Hotel Near Khatu Shyam Temple",
  description:
    "View rooms, dining, and banquet photos of Krishan Shudhama Palace — the best luxury hotel in Khatoo near Khatu Shyam Ji.",
  path: "/gallery",
});

const galleryItems = [
  {
    src: "/images/gallery/gallery-room-bed-close.png",
    alt: "Luxury hotel room near Khatu Shyam Temple — deluxe bed setup at Krishan Shudhama Palace Khatoo",
    category: "rooms" as const,
  },
  {
    src: "/images/gallery/gallery-paneer-tikka.png",
    alt: "Pure vegetarian paneer tikka at hotel restaurant in Khatoo near Khatu Shyam Ji",
    category: "dining" as const,
  },
  {
    src: "/images/gallery/gallery-dining-hall-mural.png",
    alt: "Vegetarian restaurant dining hall at best hotel in Khatoo",
    category: "dining" as const,
  },
  {
    src: "/images/gallery/gallery-table-spread.png",
    alt: "Multi-cuisine vegetarian table spread at Krishan Shudhama Palace Khatu",
    category: "dining" as const,
  },
  {
    src: "/images/gallery/gallery-rice-bowl.png",
    alt: "Signature Rajasthani rice dish at hotel near Khatu Shyam Temple",
    category: "dining" as const,
  },
  {
    src: "/images/gallery/gallery-dining-hall-rows.png",
    alt: "Spacious banquet and dining hall for events in Khatoo hotel",
    category: "events" as const,
  },
  {
    src: "/images/gallery/gallery-veggie-pizza.png",
    alt: "Fresh vegetable pizza at luxury hotel restaurant in Khatoo",
    category: "dining" as const,
  },
];

export default function GalleryPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Visual Story"
          title="Moments of devotion & luxury"
          subtitle="A glimpse of the calm we curate — from lamp-lit evenings to restorative suites."
        />
        <GalleryClient items={galleryItems} />
      </Container>
    </div>
  );
}
