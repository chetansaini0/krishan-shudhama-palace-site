"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export function OfferPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = sessionStorage.getItem("ksp_offer_seen");
    if (!seen) {
      const t = setTimeout(() => {
        if ("requestIdleCallback" in window) {
          (
            window as Window & {
              requestIdleCallback: (cb: () => void) => number;
            }
          ).requestIdleCallback(() => setOpen(true));
          return;
        }
        setOpen(true);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    sessionStorage.setItem("ksp_offer_seen", "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gold/15 bg-ivory shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Exclusive offer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gold/5" aria-hidden />

            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-charcoal/40 transition hover:bg-navy/5 hover:text-navy"
              onClick={dismiss}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8 sm:p-10">
              <div className="inline-flex rounded-full bg-gold/10 p-3">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
              <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.4em] text-gold-muted">
                Exclusive offer
              </p>
              <h3 className="mt-2 font-serif text-2xl text-navy sm:text-3xl">
                Weekend Palace Escape
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/55">
                Complimentary breakfast & priority upgrades on select suites when you book direct this month.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  onClick={dismiss}
                  className="btn-shimmer rounded-full bg-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-navy transition hover:bg-gold-light"
                >
                  Claim Offer
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-full border border-navy/15 px-6 py-2.5 text-sm text-navy transition hover:bg-navy/5"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
