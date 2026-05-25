"use client";

import { useState } from "react";
import { HOTEL } from "@/lib/constants";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiries/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          message: fd.get("message"),
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
      <div>
        <h3 className="font-serif text-2xl text-navy">Send us a message</h3>
        <p className="mt-1 text-sm text-charcoal/50">We will respond within 24 hours.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block" htmlFor="contact-name">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Name</span>
          <input
            id="contact-name"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="block" htmlFor="contact-phone">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Phone</span>
          <input
            id="contact-phone"
            name="phone"
            required
            className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
            placeholder="+91 00000 00000"
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="block" htmlFor="contact-email">
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Email (optional)</span>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10"
          placeholder="your@email.com"
          autoComplete="email"
        />
      </label>

      <label className="block" htmlFor="contact-message">
        <span className="text-xs font-medium uppercase tracking-wider text-charcoal/50">Message</span>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded-xl border border-gold/15 bg-cream/30 px-4 py-3 text-sm text-navy outline-none transition focus:border-gold/40 focus:ring-2 focus:ring-gold/10 resize-none"
          placeholder="Tell us about your inquiry..."
        />
      </label>

      {status === "ok" && (
        <div
          className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-4 w-4" />
          Thank you — we will get back to you shortly!
        </div>
      )}
      {status === "err" && (
        <p className="text-sm text-red-600" role="alert" aria-live="assertive">
          Something went wrong. Please call us at {HOTEL.phone}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-ivory transition hover:bg-navy-light disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
