"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { HOTEL } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [enableVideo, setEnableVideo] = useState(false);
  const hasVideo = Boolean(HOTEL.heroVideoSrc?.trim());

  useEffect(() => {
    if (!hasVideo) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrowViewport = window.matchMedia("(max-width: 768px)").matches;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const saveData = Boolean(nav.connection?.saveData);
    const slowNetwork = nav.connection?.effectiveType === "2g";

    setEnableVideo(!reduced && !narrowViewport && !saveData && !slowNetwork);
  }, [hasVideo]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -48]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.45, 0.8]);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduce ? 1 : mediaScale, opacity: reduce ? 1 : mediaOpacity }}
      >
        <Image
          src={HOTEL.heroVideoPoster}
          alt={`${HOTEL.name} — best luxury hotel in Khatoo near Khatu Shyam Temple`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {enableVideo && hasVideo && (
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
        style={{ opacity: reduce ? 0.55 : overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-navy/50" />
      <div className="grain pointer-events-none absolute inset-0" />

      <Container className="relative z-10 flex h-full flex-col justify-end pb-16 pt-28 sm:pb-20 lg:justify-center lg:pb-24">
        <motion.div style={{ y: reduce ? 0 : textY }} className="max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-medium uppercase tracking-[0.42em] text-gold"
          >
            {HOTEL.spiritualLine}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-shadow-hero mt-5 font-serif text-[2.75rem] leading-[1.05] tracking-tight text-ivory sm:text-6xl md:text-7xl lg:text-[5.25rem]"
          >
            {HOTEL.name}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-lg text-base leading-relaxed text-ivory/75 sm:text-lg"
          >
            {HOTEL.tagline}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap gap-3 sm:gap-4"
          >
            <Link
              href="/book"
              className="btn-shimmer rounded-md bg-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-navy transition hover:bg-gold-light"
            >
              Reserve Your Stay
            </Link>
            <Link
              href="/rooms"
              className="rounded-md border border-ivory/30 px-7 py-3.5 text-sm font-medium text-ivory transition hover:border-gold/55 hover:text-gold"
            >
              Explore Rooms
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      <a
        href="#quick-book"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-ivory/45 transition hover:text-gold"
        aria-label="Continue to booking"
      >
        <ChevronDown className="animate-scroll-bounce h-6 w-6" />
      </a>
    </section>
  );
}
