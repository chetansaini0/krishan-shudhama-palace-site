"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import type { RoomPublic } from "@/data/static-rooms";
import { Button } from "@/components/ui/Button";
import { ElegantSpinner } from "@/components/effects/ElegantSpinner";
import { HOTEL } from "@/lib/constants";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Step = "details" | "done";

export function BookingFlow({ rooms }: { rooms: RoomPublic[] }) {
  const [roomSlug, setRoomSlug] = useState(rooms[0]?.slug ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>("details");
  const [summary, setSummary] = useState<{ nights: number; totalRupees: number; available: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const todayIso = new Date().toISOString().slice(0, 10);

  const room = useMemo(() => rooms.find((r) => r.slug === roomSlug) ?? rooms[0], [rooms, roomSlug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    setRoomSlug(sp.get("room") ?? rooms[0]?.slug ?? "");
    setCheckIn(sp.get("checkIn") ?? "");
    setCheckOut(sp.get("checkOut") ?? "");
    const qGuests = Number(sp.get("guests") ?? 2);
    setGuests(Number.isFinite(qGuests) && qGuests > 0 ? qGuests : 2);
  }, [rooms]);

  useEffect(() => {
    if (room && guests > room.maxGuests) setGuests(room.maxGuests);
  }, [room, guests]);

  async function refreshQuote() {
    if (!room || !checkIn || !checkOut) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomSlug: room.slug, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Quote failed");
      setSummary({ nights: data.nights, totalRupees: data.totalRupees, available: data.available });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setSummary(null);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void refreshQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.slug, checkIn, checkOut, guests]);

  async function createBooking(): Promise<string | null> {
    if (!room) return null;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomSlug: room.slug, guestName, email, phone, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      return data.bookingId as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function payWithRazorpay(bookingId: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Configure Razorpay keys + MongoDB.");
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: HOTEL.name,
        description: `${room?.name ?? "Room"} reservation`,
        order_id: data.orderId,
        prefill: {
          name: guestName,
          email,
          contact: phone.replace(/\s+/g, ""),
        },
        notes: {
          bookingId,
          roomSlug: room?.slug ?? "",
        },
        // Lead with UPI so guests see Scan QR / UPI apps first — no EMI
        config: {
          display: {
            hide: [
              { method: "emi" },
              { method: "cardless_emi" },
              { method: "paylater" },
            ],
            blocks: {
              upi: {
                name: "Pay with UPI / Scan QR",
                instruments: [{ method: "upi" }],
              },
              other: {
                name: "Other methods",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, bookingId }),
          });
          if (!verify.ok) {
            setError("Payment received but verification failed. Please contact the hotel with your payment ID.");
            return;
          }
          setStep("done");
        },
        theme: { color: "#0a1628" },
        modal: { ondismiss: () => setBusy(false) },
      };
      const rz = window.Razorpay;
      if (!rz) throw new Error("Razorpay SDK not loaded — refresh and try again.");
      new rz(options).open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment error");
    } finally {
      setBusy(false);
    }
  }

  async function handleContinue() {
    if (!guestName || !email || !phone) { setError("Please complete guest details."); return; }
    if (!summary?.available) { setError("Dates unavailable — adjust your stay."); return; }
    const id = await createBooking();
    if (!id) return;
    if (id === "demo-local") { setStep("done"); return; }
    await payWithRazorpay(id);
  }

  if (!room) return <p className="p-8 text-center text-navy">No rooms configured.</p>;

  const inputCls = "mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-2xl border border-gold/10 bg-white p-8 shadow-lg lg:p-10">
          <motion.ol layout className="flex flex-wrap gap-2 border-b border-gold/10 pb-5 text-[11px] font-medium uppercase tracking-widest">
            <motion.li layout className={`rounded-full px-4 py-1.5 ${step === "details" ? "bg-navy text-ivory" : "bg-gold/15 text-navy"}`}>1 · Stay Details</motion.li>
            <li aria-hidden className="self-center text-gold/30">&rarr;</li>
            <motion.li layout className={`rounded-full px-4 py-1.5 ${step === "details" ? "text-charcoal/40" : "bg-gold text-navy"}`}>2 · Confirmed</motion.li>
          </motion.ol>

          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div key="details" className="space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block" htmlFor="booking-room"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Room</span>
                    <select id="booking-room" value={roomSlug} onChange={(e) => setRoomSlug(e.target.value)} className={inputCls}>{rooms.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}</select>
                  </label>
                  <label className="block" htmlFor="booking-guests"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Guests</span>
                    <select id="booking-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={inputCls}>{Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select>
                  </label>
                  <label className="block" htmlFor="booking-check-in"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Check-in</span>
                    <input id="booking-check-in" type="date" min={todayIso} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={inputCls} />
                  </label>
                  <label className="block" htmlFor="booking-check-out"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Check-out</span>
                    <input id="booking-check-out" type="date" min={checkIn || todayIso} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={inputCls} />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2" htmlFor="booking-guest-name"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Full Name</span>
                    <input id="booking-guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} className={inputCls} placeholder="As per ID" autoComplete="name" />
                  </label>
                  <label className="block" htmlFor="booking-email"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Email</span>
                    <input id="booking-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
                  </label>
                  <label className="block" htmlFor="booking-phone"><span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Phone</span>
                    <input id="booking-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} autoComplete="tel" />
                  </label>
                </div>
                {error && <p className="text-sm text-red-600" role="alert" aria-live="assertive">{error}</p>}
                <Button type="button" variant="gold" className="w-full !rounded-xl !py-3.5" disabled={busy || !summary?.available} onClick={() => void handleContinue()}>
                  {busy ? <span className="inline-flex items-center gap-2"><ElegantSpinner /> Processing...</span> : "Review & Pay Securely"}
                </Button>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-cream/50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="font-serif text-2xl text-navy">Booking Confirmed!</p>
                <p className="mt-3 text-sm text-charcoal/55">
                  Payment successful. A confirmation email has been sent to <span className="font-medium text-navy">{email}</span>.
                </p>
                <p className="mt-2 text-sm text-charcoal/55">
                  Our team has also been notified and may reach you on {phone || "your phone"} if needed.
                </p>
                <dl className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-charcoal/70">
                  <div className="flex justify-between gap-4"><dt>Room</dt><dd className="font-medium text-navy">{room.name}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Stay</dt><dd className="font-medium text-navy">{checkIn} → {checkOut}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Guests</dt><dd className="font-medium text-navy">{guests}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Total paid</dt><dd className="font-medium text-navy">₹{summary?.totalRupees != null ? summary.totalRupees.toLocaleString("en-IN") : "—"}</dd></div>
                </dl>
                <Button href="/" variant="outline" className="mt-6">Return Home</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="h-fit rounded-2xl bg-navy p-8 text-ivory shadow-xl lg:p-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold/60">Summary</p>
          <h2 className="mt-3 font-serif text-2xl">{room.name}</h2>
          <dl className="mt-6 space-y-3 text-sm text-ivory/70">
            <div className="flex justify-between"><dt>Dates</dt><dd>{checkIn || "—"} &rarr; {checkOut || "—"}</dd></div>
            <div className="flex justify-between"><dt>Nights</dt><dd>{summary?.nights ?? "—"}</dd></div>
            <div className="flex justify-between"><dt>Guests</dt><dd>{guests}</dd></div>
          </dl>
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-gold/60">Total</p>
            <p className="mt-1 font-serif text-4xl text-gold">₹{summary?.totalRupees != null ? summary.totalRupees.toLocaleString("en-IN") : "—"}</p>
            <p className="mt-2 text-xs text-ivory/40">Taxes as applicable</p>
          </div>
        </aside>
      </div>
    </>
  );
}
