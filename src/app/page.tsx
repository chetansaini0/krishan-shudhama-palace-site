import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomeHero } from "@/components/home/HomeHero";
import { QuickBookingWidget } from "@/components/home/QuickBookingWidget";
import { buildPageMetadata } from "@/lib/seo";
import { SpiritualExperience } from "@/components/home/SpiritualExperience";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/effects/Reveal";
import { HomeSectionSkeleton } from "@/components/home/HomeSectionSkeleton";
import { getPublicRooms, getRooms } from "@/lib/rooms";
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

export const metadata: Metadata = buildPageMetadata({
  title: "Krishan Shudhama Palace | Best Hotel in Khatoo Near Khatu Shyam Temple",
  description:
    "Official website of Krishan Shudhama Palace (krishanshudhamapalace.com) — the best hotel in Khatoo near Khatu Shyam Ji. Luxury rooms, pure veg dining, banquet hall & secure direct booking.",
  path: "/",
});

export default async function HomePage() {
  const rooms = getPublicRooms(await getRooms());

  return (
    <>
      <HomeHero />

      <section id="quick-book" className="relative z-20 -mt-6 bg-ivory pb-6 pt-2 sm:-mt-8">
        <Container>
          <QuickBookingWidget elevated />
        </Container>
      </section>

      <SpiritualExperience />

      <section className="bg-white-warm py-[var(--space-section)]">
        <Container>
          <Reveal>
            <SectionTitle
              eyebrow="Accommodations"
              title="Luxury rooms in Khatoo near Khatu Shyam Ji"
              subtitle="Deluxe and suite rooms with Rajasthani-inspired interiors — the best stay near Khatu Shyam Temple for pilgrims, families, and celebrations."
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room, i) => (
              <Reveal key={room.slug} delay={i * 0.08}>
                <RoomCard room={room} index={i} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 flex justify-center">
              <Link
                href="/rooms"
                className="rounded-md border border-navy/15 px-8 py-3 text-sm font-medium text-navy transition hover:border-gold hover:text-gold"
              >
                Explore all rooms &rarr;
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      <AmenitiesStrip />

      <DiningPreview />

      <Promotions />

      <Testimonials />

      <MapPreview />

      <section className="bg-navy py-[var(--space-section)]">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.4em] text-gold/65">
                Ready to experience
              </p>
              <h2 className="mt-4 font-serif text-3xl text-ivory sm:text-5xl">
                Plan your stay with us
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ivory/50">
                Book the best hotel in Khatoo for your Khatu Shyam yatra — peaceful rooms,
                pure vegetarian dining, and palace-style hospitality steps from the temple.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}
                  className="btn-shimmer rounded-md bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
                >
                  Call {HOTEL.phone}
                </Link>
                <Link
                  href={`https://wa.me/${HOTEL.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-ivory/20 px-8 py-3.5 text-sm font-medium text-ivory transition hover:border-gold/40 hover:text-gold"
                >
                  WhatsApp Concierge
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
