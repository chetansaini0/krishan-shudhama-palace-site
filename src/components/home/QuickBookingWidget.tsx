"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Users, Search } from "lucide-react";

export function QuickBookingWidget({ elevated = false }: { elevated?: boolean }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const todayIso = new Date().toISOString().slice(0, 10);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (checkIn) q.set("checkIn", checkIn);
    if (checkOut) q.set("checkOut", checkOut);
    q.set("guests", String(guests));
    router.push(`/book?${q.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={`grid w-full gap-px overflow-hidden rounded-xl shadow-2xl shadow-black/25 sm:grid-cols-2 lg:grid-cols-4 ${
        elevated ? "glass-light border border-navy/10" : "glass-dark"
      }`}
    >
      <label className={`flex flex-col gap-1.5 p-4 transition lg:p-5 ${elevated ? "hover:bg-navy/[0.03]" : "hover:bg-white/5"}`}>
        <span
          className={`flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] ${
            elevated ? "text-gold-muted" : "text-gold/70"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" /> Check-in
        </span>
        <input
          type="date"
          required
          min={todayIso}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={`w-full border-none bg-transparent text-sm outline-none ${
            elevated ? "text-navy" : "text-ivory placeholder:text-ivory/30"
          }`}
        />
      </label>

      <label
        className={`flex flex-col gap-1.5 border-l p-4 transition lg:p-5 ${
          elevated ? "border-navy/8 hover:bg-navy/[0.03]" : "border-white/5 hover:bg-white/5"
        }`}
      >
        <span
          className={`flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] ${
            elevated ? "text-gold-muted" : "text-gold/70"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" /> Check-out
        </span>
        <input
          type="date"
          required
          min={checkIn || todayIso}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className={`w-full border-none bg-transparent text-sm outline-none ${
            elevated ? "text-navy" : "text-ivory placeholder:text-ivory/30"
          }`}
        />
      </label>

      <label
        className={`flex flex-col gap-1.5 border-l p-4 transition lg:p-5 ${
          elevated ? "border-navy/8 hover:bg-navy/[0.03]" : "border-white/5 hover:bg-white/5"
        }`}
      >
        <span
          className={`flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] ${
            elevated ? "text-gold-muted" : "text-gold/70"
          }`}
        >
          <Users className="h-3.5 w-3.5" /> Guests
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className={`w-full border-none bg-transparent text-sm outline-none ${
            elevated ? "text-navy" : "text-ivory"
          }`}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="text-navy">
              {n} {n === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="btn-shimmer flex items-center justify-center gap-2 bg-gold px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy transition hover:bg-gold-light sm:col-span-2 lg:col-span-1"
      >
        <Search className="h-4 w-4" />
        Check Availability
      </button>
    </form>
  );
}
