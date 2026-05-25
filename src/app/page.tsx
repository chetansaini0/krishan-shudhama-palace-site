import dynamic from "next/dynamic";
import { HomeHero } from "@/components/home/HomeHero";
import { SpiritualExperience } from "@/components/home/SpiritualExperience";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { HomeSectionSkeleton } from "@/components/home/HomeSectionSkeleton";
import { getRooms } from "@/lib/rooms";
import { HOTEL } from "@/lib/constants";
import Link from "next/link";

const AmenitiesStrip = dynamic(
  () => import("@/components/home/AmenitiesStrip").then((m) => m.AmenitiesStrip),
  { loading: () => <HomeSectionSkeleton compact /> },
);
const DiningPreview = dynamic(
  () => import("@/components/home/DiningPreview").then((m) => m.DiningPreview),
  { loading: () => <HomeSectionSkeleton /> },
);
const Promotions = dynamic(
  () => import("@/components/home/Promotions").then((m) => m.Promotions),
  { loading: () => <HomeSectionSkeleton /> },
);
const Testimonials = dynamic(
  () => import("@/components/home/Testimonials").then((m) => m.Testimonials),
  { loading: () => <HomeSectionSkeleton /> },
);
const MapPreview = dynamic(
  () => import("@/components/home/MapPreview").then((m) => m.MapPreview),
  { loading: () => <HomeSectionSkeleton /> },
);

export default async function HomePage() {
  const rooms = await getRooms();

  return (
    <>
      <HomeHero />

      <SpiritualExperience />

      <RevealOnScroll>
        <section className="bg-white-warm py-24 lg:py-32">
          <Container>
            <SectionTitle
              eyebrow="Accommodations"
              title="Rooms & suites crafted for comfort"
              subtitle="Rajasthani-inspired interiors, restful silence, and attentive service — so you return from darshan to true comfort."
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, i) => (
                <RoomCard key={room.slug} room={room} index={i} />
              ))}
            </div>
            <div className="mt-14 flex justify-center">
              <Link
                href="/rooms"
                className="rounded-full border border-navy/15 px-8 py-3 text-sm font-medium text-navy transition hover:border-gold hover:text-gold"
              >
                Explore all rooms &rarr;
              </Link>
            </div>
          </Container>
        </section>
      </RevealOnScroll>

      <AmenitiesStrip />

      <DiningPreview />

      <Promotions />

      <Testimonials />

      <MapPreview />

      <section className="bg-navy py-24 lg:py-32">
        <Container>
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gold/60">
                Ready to experience
              </p>
              <h2 className="mt-4 font-serif text-3xl text-ivory sm:text-5xl">
                Plan your stay with us
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ivory/50">
                More than a room near Khatu Shyam Ji — a peaceful, premium experience rooted
                in seva and Rajasthani warmth.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}
                  className="btn-shimmer rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
                >
                  Call {HOTEL.phone}
                </Link>
                <Link
                  href={`https://wa.me/${HOTEL.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ivory/20 px-8 py-3.5 text-sm font-medium text-ivory transition hover:border-gold/40 hover:text-gold"
                >
                  WhatsApp Concierge
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </Container>
      </section>
    </>
  );
}
