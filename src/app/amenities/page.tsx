import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/effects/Reveal";
import { SPIRITUAL_IMAGES } from "@/lib/spiritual-media";
import { HOTEL } from "@/lib/constants";
import {
  Wifi,
  Car,
  UtensilsCrossed,
  Snowflake,
  PartyPopper,
  Clock,
  ShieldCheck,
  ConciergeBell,
  Waves,
  Sparkles,
  Dumbbell,
  Coffee,
} from "lucide-react";

import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Hotel Amenities in Khatoo — Wi-Fi, Parking, Dining & More",
  description: `Premium amenities at the best hotel in Khatoo — AC rooms, free Wi-Fi, parking, pure veg restaurant, banquet hall, 24/7 service & temple shuttle near Khatu Shyam Ji.`,
  path: "/amenities",
});

const coreAmenities = [
  { icon: Wifi, label: "Free High-Speed Wi-Fi", desc: "Complimentary connectivity throughout the property." },
  { icon: Sparkles, label: "Luxury Rooms & Suites", desc: "Palace-inspired interiors with plush bedding and royal decor." },
  { icon: Car, label: "Ample Parking & Valet", desc: "Secure on-site parking with valet and guest entry." },
  { icon: UtensilsCrossed, label: "Multi-Cuisine Restaurant", desc: "Satvik, Rajasthani, South Indian & Continental dining." },
  { icon: Snowflake, label: "Air-Conditioned Rooms", desc: "Climate-controlled comfort in every category." },
  { icon: PartyPopper, label: "Event & Banquet Hall", desc: "Pillar-free banquet for weddings and celebrations." },
  { icon: Clock, label: "24/7 Service", desc: "Round-the-clock front desk and in-room support." },
  { icon: ShieldCheck, label: "CCTV Security", desc: "Round-the-clock surveillance and trained security staff." },
  { icon: ConciergeBell, label: "Room Service", desc: "In-room dining and housekeeping at your convenience." },
];

const lifestyleAmenities = [
  { icon: Waves, label: "Pool & Relaxation", desc: "Serene pool with poolside refreshments." },
  { icon: Sparkles, label: "Spa & Wellness", desc: "Traditional and modern rejuvenation treatments." },
  { icon: Dumbbell, label: "Fitness Center", desc: "Modern equipment with training on request." },
  { icon: Coffee, label: "Club Lounge", desc: "Exclusive lounge access for suite guests." },
  { icon: Car, label: "Temple Shuttle & Transfers", desc: "Temple-route shuttles and airport pickups." },
  { icon: ConciergeBell, label: "Travel & Yatra Desk", desc: "Local guides, darshan assistance, and itineraries." },
];

export default function AmenitiesPage() {
  return (
    <div className="bg-ivory">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Amenities", path: "/amenities" },
        ]}
      />
      <section className="relative h-[52vh] min-h-[340px] overflow-hidden">
        <Image
          src={SPIRITUAL_IMAGES.resortEvening}
          alt={`Hotel amenities in Khatoo near Khatu Shyam Temple — ${HOTEL.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
        <Container className="relative z-10 flex h-full items-end pb-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-gold">
              Facilities
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">
              Crafted for your <span className="text-gold">every comfort</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/65">
              From modern essentials to indulgent extras — thoughtfully designed amenities for a seamless, luxurious stay.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-[var(--space-section)]">
        <Container>
          <SectionTitle
            eyebrow="Essentials"
            title="Everything you need, beautifully done"
            subtitle="The core comforts every guest can count on, available around the clock."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreAmenities.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.05}>
                <div className="group h-full rounded-xl border border-gold/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3 text-gold transition group-hover:bg-gold/20">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg text-navy">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/55">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-[var(--space-section)]">
        <Container>
          <SectionTitle
            eyebrow="Lifestyle & Wellness"
            title="Indulgences that elevate your stay"
            subtitle="Relax, recharge, and explore — with services curated for pilgrims, families, and celebrations."
            dark
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lifestyleAmenities.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.05}>
                <div className="group h-full rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-gold/20 hover:bg-white/[0.06]">
                  <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3 text-gold transition-colors group-hover:bg-gold/20">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg text-ivory">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/45">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <div className="rounded-2xl border border-gold/15 bg-navy p-8 text-center text-ivory lg:p-12">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/70">Plan Your Visit</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Experience it in person
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ivory/55">
              Reserve your stay or reach our concierge to tailor amenities for your group.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="btn-shimmer rounded-md bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
              >
                Book Now
              </Link>
              <a
                href={HOTEL.phoneTel}
                className="rounded-md border border-ivory/20 px-8 py-3.5 text-sm font-medium text-ivory transition hover:border-gold/40 hover:text-gold"
              >
                Call {HOTEL.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
