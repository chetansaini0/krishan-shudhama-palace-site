"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function EventInquiryForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiries/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          eventType: String(fd.get("eventType") ?? ""),
          guestCount: Number(fd.get("guestCount") ?? 100),
          eventDate: String(fd.get("preferredDate") ?? ""),
          message: String(fd.get("notes") ?? ""),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-gold/10 bg-white p-8 shadow-lg lg:p-10"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block" htmlFor="event-name">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Name</span>
          <input
            id="event-name"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            autoComplete="name"
          />
        </label>
        <label className="block" htmlFor="event-email">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Email</span>
          <input
            id="event-email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            autoComplete="email"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block" htmlFor="event-phone">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Phone</span>
          <input
            id="event-phone"
            name="phone"
            required
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            autoComplete="tel"
          />
        </label>
        <label className="block" htmlFor="event-type">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Event Type</span>
          <select
            id="event-type"
            name="eventType"
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40"
          >
            <option>Wedding & Reception</option>
            <option>Birthday & Anniversary</option>
            <option>Corporate Conference</option>
            <option>Product Launch</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block" htmlFor="event-guest-count">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Guest Count</span>
          <input
            id="event-guest-count"
            name="guestCount"
            type="number"
            min={10}
            defaultValue={100}
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
          />
        </label>
        <label className="block" htmlFor="event-preferred-date">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Preferred Date</span>
          <input
            id="event-preferred-date"
            name="preferredDate"
            type="date"
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40"
          />
        </label>
      </div>

      <label className="block" htmlFor="event-notes">
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Additional Notes</span>
        <textarea
          id="event-notes"
          name="notes"
          rows={4}
          className="mt-1.5 w-full resize-none rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
          placeholder="Tell us about your celebration..."
        />
      </label>

      {status === "ok" && (
        <div
          className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-4 w-4" />
          Thank you! Our events team will contact you within 24 hours.
        </div>
      )}
      {status === "err" && (
        <p className="text-sm text-red-600" role="alert" aria-live="assertive">
          Something went wrong. Please try again or call us.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-ivory transition hover:bg-navy-light disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
