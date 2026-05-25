"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { RollingNumber } from "@/components/effects/RollingNumber";
import { SPIRITUAL_IMAGES } from "@/lib/spiritual-media";
import { HOTEL } from "@/lib/constants";
import Link from "next/link";

const stats = [
  { value: 10, label: "Years of Hospitality", suffix: "+" },
  { value: 15, label: "Happy Guests", suffix: "K+" },
  { value: 98, label: "Guest Satisfaction", suffix: "%" },
];

const highlights = [
  { src: "/images/story/discover-room-2.png", alt: "Comfortable hotel room with elegant bed setup" },
  { src: "/images/story/discover-restaurant.png", alt: "In-house restaurant seating area" },
  { src: "/images/story/discover-dish.png", alt: "Freshly served signature dish" },
];

export function SpiritualExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <Container>
        <SectionTitle
          eyebrow="Our Story"
          title="A perfect blend of heritage & modern comfort"
          subtitle="Inspired by the spiritual aura of Khatu Shyam Temple, we blend Rajasthani palace grandeur with serene seva-style care."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <RevealOnScroll direction="left">
            <div className="relative">
              <motion.div
                style={{ y: reduce ? 0 : imgY }}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src={SPIRITUAL_IMAGES.luxuryInterior}
                  alt="Luxury palace interior"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
              </motion.div>

              <div className="absolute -bottom-6 -right-6 z-10 rounded-2xl bg-navy p-6 shadow-xl sm:-bottom-8 sm:-right-8 sm:p-8">
                <p className="font-serif text-4xl text-gold sm:text-5xl">
                  <RollingNumber value={stats[2].value} suffix={stats[2].suffix} />
                </p>
                <p className="mt-1 text-xs text-ivory/60">{stats[2].label}</p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right" delay={0.2}>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-charcoal/70 lg:text-lg">
                {HOTEL.description}
              </p>
              <p className="text-sm leading-relaxed text-charcoal/60">
                From the first glow of evening lamps to unhurried mornings, every frame is meant
                to feel blessed. Whether you are on a pilgrimage, celebrating a milestone, or
                seeking premium comfort near the temple, our palace-style hospitality ensures
                a stay that stays with you.
              </p>

              <div className="grid grid-cols-3 gap-6 border-t border-gold/15 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-2xl text-navy sm:text-3xl">
                      <RollingNumber value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-xs text-charcoal/50">{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold-muted transition hover:text-gold hover:gap-3"
              >
                Discover more about us
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.1}>
          <div className="mt-20 grid gap-4 sm:grid-cols-3">
            {highlights.map((shot) => (
              <motion.div
                key={shot.src}
                whileHover={reduce ? undefined : { scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg"
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent opacity-0 transition-opacity hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
