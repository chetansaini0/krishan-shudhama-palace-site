"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Tag, ArrowRight } from "lucide-react";

type Offer = {
  title: string;
  description: string;
  code: string;
  discountPercent: number;
  validUntil: string;
};

export function Promotions() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    fetch("/api/offers")
      .then((r) => r.json())
      .then((d) => setOffers(d.offers ?? []))
      .catch(() => setOffers([]));
  }, []);

  if (!offers.length) return null;

  return (
    <section className="bg-ivory py-[var(--space-section)]">
      <Container>
        <SectionTitle
          eyebrow="Special Offers"
          title="Exclusive deals for direct guests"
          subtitle="Book directly and unlock premium rates, complimentary upgrades, and exclusive packages."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {offers.map((o, i) => (
            <motion.div
              key={o.code}
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-navy p-8 text-ivory shadow-xl transition-transform hover:-translate-y-1 lg:p-10"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-md bg-gold/5" aria-hidden />
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-gold via-gold-light to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-gold/10 p-3">
                  <Tag className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-gold/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold">
                      Save {o.discountPercent}%
                    </span>
                    <span className="text-xs text-ivory/40">
                      Until {new Date(o.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/55">{o.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 font-mono text-sm font-semibold text-gold">
                  {o.code}
                </span>
                <Link
                  href="/book"
                  className="flex items-center gap-2 text-sm font-medium text-gold transition hover:gap-3"
                >
                  Apply at checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
