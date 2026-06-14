import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { RollingNumber } from "@/components/effects/RollingNumber";
import { SPIRITUAL_IMAGES } from "@/lib/spiritual-media";
import { HOTEL } from "@/lib/constants";
import { HeartHandshake, Sparkles, Crown, Leaf } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us — Best Hotel in Khatoo Near Khatu Shyam Temple",
  description: `Discover ${HOTEL.name} — a luxury family hotel in Khatoo (Khatu) near Khatu Shyam Ji. Rajasthani palace hospitality, pure veg dining & banquet hall.`,
  path: "/about",
});

const values = [
  {
    icon: HeartHandshake,
    title: "Seva-Led Hospitality",
    desc: "Every guest is welcomed in the spirit of devotion — warm, attentive, and heartfelt service rooted in Rajasthani tradition.",
  },
  {
    icon: Crown,
    title: "Royal Comfort",
    desc: "Palace-inspired interiors blend regal grandeur with modern luxury, creating restful sanctuaries for body and soul.",
  },
  {
    icon: Leaf,
    title: "Peaceful Sanctuary",
    desc: "Calm spaces, satvik dining, and serene surroundings — designed so your yatra feels restorative and unhurried.",
  },
  {
    icon: Sparkles,
    title: "Detail & Craft",
    desc: "From handcrafted decor to curated menus, we obsess over the small details that make a stay truly memorable.",
  },
];

const milestones = [
  { year: "Heritage", label: "Rooted in Rajasthani palace traditions and temple-town hospitality." },
  { year: "Today", label: "A modern luxury retreat steps from Khatu Shyam Ji temple." },
  { year: "Always", label: "Committed to peaceful, premium, and warmly welcoming stays." },
];

const stats = [
  { value: 4.9, decimals: 1, suffix: "★", label: "Guest Rating" },
  { value: 35, suffix: "k+", label: "Happy Guests" },
  { value: 100, suffix: "%", label: "Pure Veg Kitchen" },
  { value: 24, suffix: "/7", label: "Concierge Care" },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <section className="relative h-[58vh] min-h-[380px] overflow-hidden">
        <Image
          src={SPIRITUAL_IMAGES.indiaHeritageFacade}
          alt={`${HOTEL.name} heritage facade`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
        <Container className="relative z-10 flex h-full items-end pb-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-gold">
              Our Story
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">
              Where devotion meets <span className="text-gold">royal luxury</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/65">
              {HOTEL.tagline}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <RevealOnScroll direction="left">
              <SectionTitle
                align="left"
                eyebrow="Who We Are"
                title="A sanctuary for pilgrims, families & celebrations"
                subtitle={HOTEL.description}
              />
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/book"
                  className="btn-shimmer rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
                >
                  Reserve Your Stay
                </Link>
                <Link
                  href="/rooms"
                  className="rounded-full border border-navy/15 px-8 py-3 text-sm font-medium text-navy transition hover:border-gold hover:text-gold"
                >
                  Explore Rooms
                </Link>
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={SPIRITUAL_IMAGES.luxuryInterior}
                  alt={`Interior at ${HOTEL.name}`}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      <section className="bg-navy py-24 lg:py-32">
        <Container>
          <SectionTitle
            eyebrow="Our Values"
            title="The philosophy behind every stay"
            subtitle="Hospitality offered as seva — with warmth, grace, and an eye for detail."
            dark
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <RevealOnScroll key={v.title} delay={i * 0.06}>
                <div className="group h-full rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-gold/20 hover:bg-white/[0.06]">
                  <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3 text-gold transition-colors group-hover:bg-gold/20">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg text-ivory">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/45">{v.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid gap-4 rounded-2xl border border-gold/10 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-4xl text-navy">
                  <RollingNumber value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gold-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {milestones.map((m, i) => (
              <RevealOnScroll key={m.year} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-gold/10 bg-cream/40 p-8">
                  <p className="font-serif text-2xl text-gold">{m.year}</p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{m.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl text-ivory sm:text-4xl">
              Begin your royal escape
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ivory/50">
              Let us host your next yatra, family holiday, or celebration with the warmth of a palace.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="btn-shimmer rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
              >
                Book Now
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-ivory/20 px-8 py-3.5 text-sm font-medium text-ivory transition hover:border-gold/40 hover:text-gold"
              >
                Talk to Concierge
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
