"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Users, Search } from "lucide-react";

export function QuickBookingWidget() {
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
      className="glass-dark grid w-full gap-px overflow-hidden rounded-2xl shadow-2xl shadow-black/40 sm:grid-cols-2 lg:grid-cols-4"
    >
      <label className="flex flex-col gap-1.5 p-4 transition hover:bg-white/5 lg:p-5">
        <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-gold/70">
          <Calendar className="h-3.5 w-3.5" /> Check-in
        </span>
        <input
          type="date"
          required
          min={todayIso}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full border-none bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 border-l border-white/5 p-4 transition hover:bg-white/5 lg:p-5">
        <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-gold/70">
          <Calendar className="h-3.5 w-3.5" /> Check-out
        </span>
        <input
          type="date"
          required
          min={checkIn || todayIso}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full border-none bg-transparent text-sm text-ivory outline-none placeholder:text-ivory/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 border-l border-white/5 p-4 transition hover:bg-white/5 lg:p-5">
        <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-gold/70">
          <Users className="h-3.5 w-3.5" /> Guests
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border-none bg-transparent text-sm text-ivory outline-none"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n} className="bg-navy text-ivory">
              {n} guest{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end border-l border-white/5 p-4 lg:p-5">
        <button
          type="submit"
          className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
        >
          <Search className="h-4 w-4" />
          Check Availability
        </button>
      </div>
    </form>
  );
}
