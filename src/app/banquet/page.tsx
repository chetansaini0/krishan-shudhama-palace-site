import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EventInquiryForm } from "@/components/banquet/EventInquiryForm";
import { BanquetHero } from "@/components/banquet/BanquetHero";
import { BANQUET, HOTEL } from "@/lib/constants";
import { Check, Music, Lightbulb, Car, Utensils, Mic2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Banquets & Events",
  description: `${BANQUET.hallName} — weddings, corporate events, and celebrations at ${HOTEL.name}.`,
};

const banquetGallery = [
  {
    src: "/images/banquet/banquet-hall-main.png",
    alt: "Grand banquet hall with stage lighting, buffet setup, and elegant seating at Krishan Shudhama Palace",
  },
  {
    src: "/images/banquet/banquet-hall-seating.png",
    alt: "Formal banquet seating arrangement with stage and warm ambient lighting",
  },
  {
    src: "/images/banquet/wedding-stage.png",
    alt: "Premium wedding stage decoration with floral arches and crystal chandeliers",
  },
] as const;

const services = [
  { icon: Utensils, label: "Custom catering & live counters" },
  { icon: Lightbulb, label: "Intelligent lighting & stage design" },
  { icon: Music, label: "DJ, live band & sound engineering" },
  { icon: Mic2, label: "MC, valet & guest protocols" },
  { icon: Car, label: "Ample covered parking" },
  { icon: Check, label: "Dedicated event director" },
];

export default function BanquetPage() {
  return (
    <div className="bg-ivory">
      <BanquetHero
        imageSrc={banquetGallery[0].src}
        imageAlt={banquetGallery[0].alt}
      />

      <section className="py-24 lg:py-32">
        <Container>
          <SectionTitle
            eyebrow="At a Glance"
            title="Designed for landmark occasions"
            subtitle="High ceilings, modular layouts, and seamless guest circulation — engineered for weddings, milestone birthdays, and executive summits."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {banquetGallery.map((item) => (
              <div
                key={item.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              align="left"
              eyebrow="Capacity & Flow"
              title="Scale to perfection"
              subtitle="From intimate gatherings to grand celebrations — our venue adapts."
              dark
            />
            <ul className="space-y-3">
              {BANQUET.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-sm text-ivory/70">
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gold/10 bg-white/[0.03] p-10 backdrop-blur-sm">
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold/70">
              Guest Capacity
            </p>
            <p className="mt-4 font-serif text-5xl text-ivory">
              {BANQUET.capacityMin}–{BANQUET.capacityMax}
            </p>
            <p className="mt-2 text-sm text-ivory/50">
              Guests · pillar-free · climate controlled
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {services.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 text-sm text-ivory/60"
                >
                  <s.icon className="h-5 w-5 shrink-0 text-gold/60" />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="inquire" className="py-24 lg:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionTitle
              align="left"
              eyebrow="Plan Your Event"
              title="Tell us about your celebration"
              subtitle="Share capacity, dates, and creative direction — we will respond with packages, floorplans, and transparent pricing."
            />
          </div>
          <EventInquiryForm />
        </Container>
      </section>
    </div>
  );
}
