"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GUEST_REVIEWS } from "@/lib/reviews";

const reviews = GUEST_REVIEWS;

export function Testimonials() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const next = useCallback(() => setActive((i) => (i + 1) % reviews.length), []);
  const prev = useCallback(() => setActive((i) => (i - 1 + reviews.length) % reviews.length), []);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      if (!document.hidden) next();
    }, 6000);
    return () => {
      clearInterval(timer);
    };
  }, [next, reduce]);

  return (
    <section className="relative overflow-hidden bg-cream py-[var(--space-section)]">
      <Container className="relative z-10">
        <SectionTitle
          eyebrow="Guest Reviews"
          title="Stories from our guests"
          subtitle="Trusted by pilgrims, families, and celebrations — hear what makes every stay memorable."
        />

        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <Quote className="mx-auto mb-6 h-10 w-10 text-gold/30" />

              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: reviews[active].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>

              <blockquote className="font-serif text-xl leading-relaxed text-navy sm:text-2xl lg:text-3xl">
                &ldquo;{reviews[active].quote}&rdquo;
              </blockquote>

              <div className="mt-8">
                <p className="text-base font-semibold text-navy">{reviews[active].name}</p>
                <p className="mt-1 text-sm text-charcoal/50">{reviews[active].context}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              className="rounded-md border border-navy/15 p-2.5 text-navy transition hover:border-gold hover:text-gold"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-gold" : "w-2 bg-navy/15 hover:bg-navy/30"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="rounded-md border border-navy/15 p-2.5 text-navy transition hover:border-gold hover:text-gold"
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
