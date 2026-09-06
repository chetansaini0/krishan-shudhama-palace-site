"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  UtensilsCrossed,
  Car,
  Wifi,
  Dumbbell,
  ConciergeBell,
  Waves,
  ShieldCheck,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SPIRITUAL_IMAGES } from "@/lib/spiritual-media";

const amenities = [
  { icon: Waves, label: "Pool & Relaxation", desc: "Serene infinity pool with poolside refreshments" },
  { icon: Sparkles, label: "Spa & Wellness", desc: "Traditional & modern treatments for mind and body" },
  { icon: UtensilsCrossed, label: "Multi-Cuisine Dining", desc: "Satvik, Rajasthani, Continental & more" },
  { icon: Dumbbell, label: "Fitness Center", desc: "Modern equipment & personal training on request" },
  { icon: ConciergeBell, label: "24/7 Concierge", desc: "Yatra assistance, travel desk & local guides" },
  { icon: Car, label: "Valet & Transfers", desc: "Temple-route shuttles & airport pickups" },
  { icon: Wifi, label: "High-Speed Wi-Fi", desc: "Complimentary throughout the property" },
  { icon: ShieldCheck, label: "Safety & Security", desc: "Round-the-clock security & CCTV surveillance" },
  { icon: Coffee, label: "Club Lounge", desc: "Exclusive access for suite guests" },
];

export function AmenitiesStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-navy py-[var(--space-section)]">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Image
          src={SPIRITUAL_IMAGES.resortEvening}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/95 to-navy" />

      <Container className="relative z-10">
        <SectionTitle
          eyebrow="Facilities"
          title="Exceptional amenities for every guest"
          subtitle="From ancient wellness traditions to modern luxuries — everything designed for your comfort."
          dark
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item, i) => (
            <motion.div
              key={item.label}
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.3 } }}
              className="group rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-gold/20 hover:bg-white/[0.06]"
            >
              <div className="mb-4 inline-flex rounded-xl bg-gold/10 p-3 text-gold transition-colors group-hover:bg-gold/20">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg text-ivory">{item.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/45">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
