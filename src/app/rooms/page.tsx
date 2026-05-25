import type { Metadata } from "next";
import { RoomsClient } from "@/components/rooms/RoomsClient";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getRooms } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Deluxe, suite, and executive accommodations at Krishan Shudhama Palace.",
};

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Accommodations"
          title="Find your perfect room"
          subtitle="Every category offers refined proportions, layered lighting, and residential comfort — whether you are here for a quiet escape or a milestone celebration."
        />
        <RoomsClient rooms={rooms} />
      </Container>
    </div>
  );
}
