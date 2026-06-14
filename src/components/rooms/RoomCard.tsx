"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { RoomPublic } from "@/data/static-rooms";
import { BedDouble, Users, Maximize, ArrowUpRight } from "lucide-react";

export function RoomCard({ room, index = 0 }: { room: RoomPublic; index?: number }) {
  const img = room.images[0];
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? undefined : { opacity: 0, y: 30 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-navy/10"
    >
      <Link
        href={`/rooms/${room.slug}`}
        className="relative block aspect-[4/3] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <Image
          src={img}
          alt={room.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          priority={index < 2}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

        <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-navy">
          {room.comingSoon ? "Coming Soon" : room.category}
        </span>

        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs text-ivory/80">
          {!room.comingSoon && room.inventory > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3 w-3" />
              {room.inventory} rooms
            </span>
          )}
          {room.sizeSqFt && (
            <span className="flex items-center gap-1">
              <Maximize className="h-3 w-3" />
              {room.sizeSqFt} sqft
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {room.maxGuests} guests
          </span>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl text-navy group-hover:text-gold-muted transition-colors">
              {room.name}
            </h3>
            <p className="mt-1 text-sm text-charcoal/50">{room.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            {room.comingSoon ? (
              <>
                <p className="text-[10px] uppercase tracking-widest text-gold-muted">Status</p>
                <p className="font-serif text-xl text-navy">Coming Soon</p>
              </>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-widest text-gold-muted">From</p>
                <p className="font-serif text-2xl text-navy">
                  ₹{room.basePrice.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-charcoal/40">per night</p>
              </>
            )}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-charcoal/55">
          {room.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-gold/10 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full bg-cream px-2.5 py-1 text-[10px] text-charcoal/60"
              >
                {a.split(" ").slice(0, 2).join(" ")}
              </span>
            ))}
          </div>
          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-gold-muted transition hover:text-gold hover:gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            View <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
