import type { Metadata } from "next";
import { RoomsClient } from "@/components/rooms/RoomsClient";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getPublicRooms, getRooms } from "@/lib/rooms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Rooms in Khatoo — Luxury Hotel Near Khatu Shyam Temple",
  description:
    "Book luxury rooms in Khatoo at Krishan Shudhama Palace — Deluxe King from ₹1,500 and Royal Suite from ₹2,500 near Khatu Shyam Ji.",
  path: "/rooms",
});

export default async function RoomsPage() {
  const rooms = getPublicRooms(await getRooms());

  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
        ]}
      />
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Accommodations"
          title="Luxury rooms in Khatoo near Khatu Shyam Ji"
          subtitle="Affordable to premium accommodation near Khatu Shyam Temple — family-friendly rooms with Rajasthani palace comfort and modern amenities."
        />
        <RoomsClient rooms={rooms} />
      </Container>
    </div>
  );
}
