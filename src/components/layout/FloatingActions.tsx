"use client";

import Link from "next/link";
import { MessageCircle, CalendarDays, ArrowUp } from "lucide-react";
import { HOTEL } from "@/lib/constants";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
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
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>

      <Link
        href="/book"
        className="btn-shimmer flex h-12 items-center gap-2 rounded-full bg-gold px-5 text-xs font-semibold uppercase tracking-[0.15em] text-navy shadow-xl transition-all hover:bg-gold-light hover:shadow-2xl sm:text-sm"
      >
        <CalendarDays className="h-4 w-4" />
        Book
      </Link>
    </div>
  );
}
