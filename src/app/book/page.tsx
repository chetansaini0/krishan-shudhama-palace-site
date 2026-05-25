import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getRooms } from "@/lib/rooms";

export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Secure direct booking at Krishan Shudhama Palace — stay beside Khatu Shyam Ji.",
};

export default async function BookPage() {
  const rooms = await getRooms();

  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Direct Booking"
          title="Reserve your perfect stay"
          subtitle="Book directly for the best rates, complimentary upgrades, and personalized yatra assistance."
        />
        <BookingFlow rooms={rooms} />
      </Container>
    </div>
  );
}
