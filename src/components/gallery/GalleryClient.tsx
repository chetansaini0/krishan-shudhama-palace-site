"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollLock } from "@/lib/useScrollLock";

type GalleryItem = {
  src: string;
  alt: string;
  category: "rooms" | "dining" | "pool" | "events";
};

const categories = [
  { key: "all", label: "All" },
  { key: "rooms", label: "Rooms" },
  { key: "dining", label: "Dining" },
  { key: "pool", label: "Pool" },
  { key: "events", label: "Events" },
] as const;

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const availableCategories = categories.filter(
    (c) => c.key === "all" || items.some((i) => i.category === c.key),
  );

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  useScrollLock(lightbox !== null);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  }, [lightbox, filtered.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % filtered.length);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {availableCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => { setFilter(c.key); setLightbox(null); }}
            aria-pressed={filter === c.key}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
              filter === c.key ? "text-navy" : "text-charcoal/50 hover:text-navy"
            }`}
          >
            {filter === c.key && (
              <motion.div
                layoutId="gallery-filter"
                className="absolute inset-0 rounded-full bg-gold/15 border border-gold/25"
                transition={{ duration: 0.3 }}
              />
            )}
            <span className="relative z-10">{c.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          {filtered.map((item, i) => (
            <motion.button
              type="button"
              key={item.src}
              initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative mb-4 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-xl text-left shadow-md"
              onClick={() => openLightbox(i)}
              aria-label={`Open image: ${item.alt}`}
            >
              <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/30" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full bg-gold/90 px-4 py-2 text-xs font-medium text-navy">
                    View
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image viewer"
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-ivory transition hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-ivory transition hover:bg-white/20"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
              <p className="mt-3 text-center text-sm text-ivory/60">
                {filtered[lightbox].alt}
              </p>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-ivory transition hover:bg-white/20"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-ivory/40">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
