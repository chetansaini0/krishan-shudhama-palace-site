import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getRoomBySlug, getRooms } from "@/lib/rooms";
import { RoomBookingPanel } from "@/components/rooms/RoomBookingPanel";
import { buildPageMetadata } from "@/lib/seo";
import { Check, Users, Maximize, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Room" };
  const description = room.comingSoon
    ? `${room.name} at ${room.tagline} — launching soon at Krishan Shudhama Palace, the best hotel in Khatoo near Khatu Shyam Temple.`
    : `Book ${room.name} at the best hotel in Khatoo near Khatu Shyam Temple — ${room.tagline}. From ₹${room.basePrice.toLocaleString("en-IN")}/night with direct booking.`;
  return buildPageMetadata({
    title: `${room.name} — Luxury Room in Khatoo Near Khatu Shyam Ji`,
    description,
    path: `/rooms/${slug}`,
    ogImage: room.images[0],
  });
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  return (
    <div className="bg-ivory">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
          { name: room.name, path: `/rooms/${slug}` },
        ]}
      />
      <div className="relative aspect-[21/9] min-h-[400px] w-full overflow-hidden">
        <Image
          src={room.images[0]}
          alt={`${room.name} — luxury hotel room near Khatu Shyam Temple at Krishan Shudhama Palace Khatoo`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <Container>
            <span className="rounded-full bg-gold/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy">
              {room.comingSoon ? "Coming Soon" : room.category}
            </span>
            <h1 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">{room.name}</h1>
            <p className="mt-3 max-w-2xl text-base text-ivory/70">{room.tagline}</p>
            <div className="mt-4 flex items-center gap-6 text-sm text-ivory/60">
              {room.sizeSqFt && (
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {room.sizeSqFt} sqft</span>
              )}
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Up to {room.maxGuests} guests</span>
              {!room.comingSoon && room.inventory > 0 && (
                <span>{room.inventory} rooms of this type</span>
              )}
            </div>
          </Container>
        </div>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl text-navy">Gallery</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {room.images.map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={src}
                    alt={`${room.name} room interior at hotel in Khatoo near Khatu Shyam Ji`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width:1024px) 50vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy">Experience</h2>
            <p className="mt-4 leading-relaxed text-charcoal/65">{room.description}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-navy">Amenities</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {room.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-charcoal/70">
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-cream" />}>
          <RoomBookingPanel room={room} />
        </Suspense>
      </Container>

      <Container className="pb-16">
        <Link href="/rooms" className="inline-flex items-center gap-2 text-sm font-medium text-navy transition hover:text-gold">
          <ArrowLeft className="h-4 w-4" />
          All rooms
        </Link>
      </Container>
    </div>
  );
}
