"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarRange } from "lucide-react";
import type { RoomPublic } from "@/data/static-rooms";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function RoomBookingPanel({ room }: { room: RoomPublic }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [checkIn, setCheckIn] = useState(sp.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") ?? "");
  const [guests, setGuests] = useState(Number(sp.get("guests") ?? 2));
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const validGuests = useMemo(
    () => Math.min(Math.max(guests, 1), room.maxGuests),
    [guests, room.maxGuests],
  );

  async function checkAndBook() {
    if (room.comingSoon) return;
    setLoading(true);
    setHint(null);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomSlug: room.slug, checkIn, checkOut, guests: validGuests }),
      });
      const data = await res.json();
      if (!res.ok) { setHint(data.error ?? "Unable to check availability"); setLoading(false); return; }
      if (!data.available) { setHint("These dates are unavailable. Please adjust your stay."); setLoading(false); return; }
      const q = new URLSearchParams({ room: room.slug, checkIn, checkOut, guests: String(validGuests) });
      router.push(`/book?${q.toString()}`);
    } catch {
      setHint("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10";

  if (room.comingSoon) {
    return (
      <aside className="h-fit rounded-2xl bg-navy p-8 text-ivory shadow-xl lg:p-10">
        <div className="flex items-center gap-3">
          <CalendarRange className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-xl">{room.name}</h2>
        </div>
        <p className="mt-6 rounded-xl border border-gold/25 bg-gold/10 px-4 py-5 text-center font-serif text-2xl text-gold">
          Coming Soon
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ivory/60">
          Executive Club rooms are launching shortly. Book Deluxe King or Royal Suite now, or contact us for updates.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/rooms"
            className="flex items-center justify-center rounded-xl bg-gold py-3 text-sm font-semibold text-navy transition hover:bg-gold-light"
          >
            View Available Rooms
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-xl border border-ivory/15 py-3 text-sm text-ivory/70 transition hover:border-gold/30 hover:text-gold"
          >
            Contact Us
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-2xl bg-navy p-8 text-ivory shadow-xl lg:p-10">
      <div className="flex items-center gap-3">
        <CalendarRange className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-xl">Reserve this room</h2>
      </div>
      <div className="mt-4">
        <span className="text-xs text-ivory/40">From</span>
        <p className="font-serif text-3xl text-gold">
          ₹{room.basePrice.toLocaleString("en-IN")}
          <span className="ml-1 text-sm font-sans text-ivory/40">/ night</span>
        </p>
      </div>
      {room.sizeSqFt && (
        <p className="mt-2 text-xs text-ivory/40">
          {room.sizeSqFt} sqft · Max {room.maxGuests} guests
          {!room.comingSoon && room.inventory > 0 ? ` · ${room.inventory} rooms` : ""}
        </p>
      )}
      {!room.sizeSqFt && !room.comingSoon && room.inventory > 0 && (
        <p className="mt-2 text-xs text-ivory/40">{room.inventory} rooms available</p>
      )}

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-gold/60">Check-in</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-gold/60">Check-out</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-gold/60">Guests</span>
          <select value={validGuests} onChange={(e) => setGuests(Number(e.target.value))} className={inputCls}>
            {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} className="bg-navy text-ivory">{n}</option>
            ))}
          </select>
        </label>
      </div>

      {hint && <p className="mt-4 text-sm text-red-400">{hint}</p>}

      <Button
        type="button"
        onClick={checkAndBook}
        disabled={loading || !checkIn || !checkOut}
        variant="gold"
        className="mt-6 w-full !rounded-xl !py-3.5"
      >
        {loading ? "Checking..." : "Continue to Checkout"}
      </Button>
      <p className="mt-3 text-center text-[11px] text-ivory/35">
        No payment until you review your stay summary.
      </p>
    </aside>
  );
}
