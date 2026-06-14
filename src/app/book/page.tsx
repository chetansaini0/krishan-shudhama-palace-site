import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getRooms, getBookableRooms } from "@/lib/rooms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Book Hotel in Khatoo — Direct Booking Near Khatu Shyam Ji",
  description:
    "Book your stay at the best hotel near Khatu Shyam Temple. Secure direct booking, best rates, instant confirmation at Krishan Shudhama Palace, Khatoo.",
  path: "/book",
});

export default async function BookPage() {
  const rooms = getBookableRooms(await getRooms());

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
