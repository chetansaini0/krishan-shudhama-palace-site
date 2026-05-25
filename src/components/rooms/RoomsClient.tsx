"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoomCard } from "./RoomCard";
import type { RoomPublic } from "@/data/static-rooms";

const filters = [
  { key: "all", label: "All Rooms" },
  { key: "deluxe", label: "Deluxe" },
  { key: "suite", label: "Suite" },
  { key: "executive", label: "Executive" },
] as const;

export function RoomsClient({ rooms }: { rooms: RoomPublic[] }) {
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? rooms : rooms.filter((r) => r.category === active);

  return (
    <>
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`relative rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              active === f.key
                ? "text-navy"
                : "text-charcoal/50 hover:text-navy"
            }`}
          >
            {active === f.key && (
              <motion.div
                layoutId="room-filter"
                className="absolute inset-0 rounded-full bg-gold/15 border border-gold/25"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span className="relative z-10">{f.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((r, i) => (
            <RoomCard key={r.slug} room={r} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
