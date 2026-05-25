"use client";

import Link from "next/link";
import { MessageCircle, CalendarDays, ArrowUp, Phone } from "lucide-react";
import { HOTEL } from "@/lib/constants";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 600;
        setShowTop((prev) => (prev === next ? prev : next));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wa = `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(
    `Hello ${HOTEL.name}, I'd like to inquire about a reservation.`,
  )}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-3"
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-ivory text-navy shadow-lg transition hover:bg-gold hover:text-navy"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <Link
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
        aria-label="WhatsApp concierge"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>

      <a
        href={HOTEL.phoneTel}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-navy text-gold shadow-xl transition hover:border-gold/40 hover:bg-navy-light"
        aria-label={`Call ${HOTEL.phone}`}
      >
        <Phone className="h-5 w-5" />
      </a>

      <Link
        href="/book"
        className="btn-shimmer flex h-12 items-center gap-2 rounded-full bg-gold px-5 text-xs font-semibold uppercase tracking-[0.15em] text-navy shadow-xl transition-all hover:bg-gold-light hover:shadow-2xl sm:text-sm"
        aria-label="Book now"
      >
        <CalendarDays className="h-4 w-4" />
        Book
      </Link>
    </div>
  );
}
