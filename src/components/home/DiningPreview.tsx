"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { RollingNumber } from "@/components/effects/RollingNumber";
import { Clock, UtensilsCrossed, Leaf } from "lucide-react";

const cuisineTypes = [
  "Pure Vegetarian",
  "Rajasthani Thali",
  "South Indian",
  "Chinese & Continental",
  "Kathiyawadi Special",
];

const hours = [
  { meal: "Breakfast", time: "7:00 AM — 10:30 AM" },
  { meal: "Lunch", time: "12:00 PM — 3:30 PM" },
  { meal: "Dinner", time: "7:00 PM — 11:00 PM" },
];

export function DiningPreview() {
  const reduce = useReducedMotion();
  const diningSectionImage = "/images/dining/dining-section-main.png";

  return (
    <section className="relative overflow-hidden bg-ivory py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <RevealOnScroll direction="left">
            <div className="relative">
              <motion.div
                whileHover={reduce ? undefined : { scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src={diningSectionImage}
                  alt="Hotel dining experience"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              </motion.div>

              <div className="absolute -bottom-4 -left-4 z-10 rounded-xl bg-gold p-5 shadow-xl sm:-bottom-6 sm:-left-6">
                <UtensilsCrossed className="h-8 w-8 text-navy" />
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right" delay={0.15}>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-10 bg-gold" />
                <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-gold-muted">
                  Dining
                </p>
              </div>
              <h2 className="font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">
                A feast for
                <br />
                <span className="text-gold">every palate</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-charcoal/60">
                Our multi-cuisine restaurant brings together authentic Rajasthani flavors,
                aromatic South Indian delicacies, and global favorites — all prepared with
                fresh ingredients and served in an elegant setting.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {cuisineTypes.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs font-medium text-navy"
                  >
                    <Leaf className="h-3 w-3 text-gold" />
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-3 rounded-xl border border-gold/10 bg-cream/50 p-6">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-gold-muted">
                  <Clock className="h-4 w-4" /> Restaurant Hours
                </div>
                {hours.map((h) => (
                  <div key={h.meal} className="flex justify-between text-sm">
                    <span className="font-medium text-navy">{h.meal}</span>
                    <span className="text-charcoal/50">{h.time}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-gold/10 bg-white p-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold-muted">Dishes</p>
                  <p className="mt-1 font-serif text-2xl text-navy">
                    <RollingNumber value={85} suffix="+" />
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold-muted">Rating</p>
                  <p className="mt-1 font-serif text-2xl text-navy">
                    <RollingNumber value={4.9} decimals={1} suffix="+" />
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold-muted">Guests</p>
                  <p className="mt-1 font-serif text-2xl text-navy">
                    <RollingNumber value={35} suffix="k+" />
                  </p>
                </div>
              </div>

              <Link
                href="/dining"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-sm font-medium text-ivory transition hover:bg-navy-light"
              >
                View Full Menu
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </Container>
    </section>
  );
}
