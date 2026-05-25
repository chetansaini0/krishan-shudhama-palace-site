"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HOTEL } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { QuickBookingWidget } from "@/components/home/QuickBookingWidget";
import { ParticleField } from "@/components/effects/ParticleField";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [enableVideo, setEnableVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrowViewport = window.matchMedia("(max-width: 768px)").matches;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const saveData = Boolean(nav.connection?.saveData);
    const slowNetwork = nav.connection?.effectiveType === "2g";

    setEnableVideo(!reduced && !narrowViewport && !saveData && !slowNetwork);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.5, 0.85]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduce ? 1 : videoScale, opacity: reduce ? 1 : videoOpacity }}
      >
        <Image
          src={HOTEL.heroVideoPoster}
          alt={`${HOTEL.name} hero visual`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {enableVideo && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={HOTEL.heroVideoPoster}
          >
            <source src={HOTEL.heroVideoSrc} type="video/mp4" />
          </video>
        )}
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-navy"
        style={{ opacity: reduce ? 0.6 : overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/30 via-transparent to-navy/30" />

      <ParticleField count={15} />

      <div className="grain pointer-events-none absolute inset-0" />

      <Container className="relative z-10 flex h-full flex-col justify-center pb-32 pt-24">
        <motion.div
          style={{ y: reduce ? 0 : textY }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-gold/60" />
              <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-gold">
                {HOTEL.spiritualLine}
              </p>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-shadow-hero font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {HOTEL.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg"
          >
            {HOTEL.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/book"
              className="btn-shimmer rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/20"
            >
              Reserve Your Stay
            </Link>
            <Link
              href="/rooms"
              className="rounded-full border border-ivory/25 px-8 py-3.5 text-sm font-medium text-ivory transition-all hover:border-gold/50 hover:text-gold"
            >
              Explore Rooms
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-6 sm:px-5 md:px-7 lg:px-9"
      >
        <div className="mx-auto max-w-[min(100%,90rem)]">
          <QuickBookingWidget />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 sm:bottom-32"
      >
        <ChevronDown className="animate-scroll-bounce h-6 w-6 text-ivory/40" />
      </motion.div>
    </section>
  );
}
