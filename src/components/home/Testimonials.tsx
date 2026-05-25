"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

const reviews = [
  {
    quote: "After darshan, coming back to such calm rooms felt like a blessing. The banquet team handled our reception with royal warmth.",
    name: "Meera & Rahul",
    context: "Wedding near Khatu Shyam Ji",
    rating: 5,
  },
  {
    quote: "Peaceful, premium, and genuinely caring staff — exactly what our family needed for a multi-day yatra. Booking direct was seamless.",
    name: "James K.",
    context: "Family pilgrimage stay",
    rating: 5,
  },
  {
    quote: "The luxury rooms exceeded our expectations. Perfect blend of traditional Rajasthani decor with modern comforts. Will definitely return!",
    name: "Priya S.",
    context: "Anniversary celebration",
    rating: 5,
  },
  {
    quote: "Best hotel near Khatu Shyam Temple. The concierge arranged everything for our group yatra. Dining was exceptional — pure vegetarian paradise.",
    name: "Anil M.",
    context: "Group pilgrimage",
    rating: 5,
  },
];

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
    <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
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
              className="rounded-full border border-navy/15 p-2.5 text-navy transition hover:border-gold hover:text-gold"
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
              className="rounded-full border border-navy/15 p-2.5 text-navy transition hover:border-gold hover:text-gold"
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
