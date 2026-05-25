import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Spiritual ambience & palace stays — Krishan Shudhama Palace near Khatu Shyam Ji.",
};

const galleryItems = [
  { src: "/images/gallery/gallery-room-bed-close.png", alt: "Deluxe room bed setup", category: "rooms" as const },
  { src: "/images/gallery/gallery-paneer-tikka.png", alt: "Paneer tikka with mint chutney", category: "dining" as const },
  { src: "/images/gallery/gallery-dining-hall-mural.png", alt: "Dining hall with wall art and seating", category: "dining" as const },
  { src: "/images/gallery/gallery-table-spread.png", alt: "Table spread with signature dishes", category: "dining" as const },
  { src: "/images/gallery/gallery-rice-bowl.png", alt: "Spiced rice bowl garnish close-up", category: "dining" as const },
  { src: "/images/gallery/gallery-dining-hall-rows.png", alt: "Spacious restaurant seating area", category: "events" as const },
  { src: "/images/gallery/gallery-veggie-pizza.png", alt: "Freshly baked vegetable pizza", category: "dining" as const },
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
