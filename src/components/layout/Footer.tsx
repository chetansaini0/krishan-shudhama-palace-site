"use client";

import Link from "next/link";
import { useState } from "react";
import { HOTEL } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/effects/RevealOnScroll";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/amenities", label: "Amenities" },
  { href: "/banquet", label: "Banquets & Events" },
  { href: "/dining", label: "Dining" },
  { href: "/gallery", label: "Gallery" },
  { href: "/location", label: "Location" },
  { href: "/blog", label: "Travel Guide" },
  { href: "/testimonials", label: "Guest Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book Now" },
];

const socialLinks = [
  { href: HOTEL.social.instagram, label: "Instagram" },
  { href: HOTEL.social.facebook, label: "Facebook" },
].filter((link) => link.href.trim().length > 0);

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function subscribeNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newsletterEmail) return;
    const fd = new FormData(e.currentTarget);
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          website: String(fd.get("website") ?? ""),
        }),
      });
      if (!res.ok) throw new Error();
      setNewsletterStatus("ok");
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus("err");
    }
  }

  return (
    <footer className="relative mt-0 overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light/50 via-transparent to-transparent" />

      <div className="relative">
        <RevealOnScroll>
          <div className="border-b border-gold/10 py-16 text-center">
            <Container>
              <p className="text-xs font-medium uppercase tracking-[0.5em] text-gold/60">
                Begin your journey
              </p>
              <h2 className="mt-4 font-serif text-3xl text-ivory sm:text-5xl">
                Experience{" "}
                <span className="text-gold">{HOTEL.shortName}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/50">
                {HOTEL.tagline}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/book"
                  className="btn-shimmer rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
                >
                  Reserve Your Stay
                </Link>
                <a
                  href={`https://wa.me/${HOTEL.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ivory/20 px-8 py-3 text-sm font-medium text-ivory transition hover:border-gold/40 hover:text-gold"
                >
                  WhatsApp Concierge
                </a>
              </div>
            </Container>
          </div>
        </RevealOnScroll>

        <Container className="grid gap-12 py-16 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="group inline-block">
              <span className="font-serif text-2xl tracking-wider text-gold">
                {HOTEL.shortName}
              </span>
              <span className="ml-2 text-[9px] uppercase tracking-[0.4em] text-ivory/40">
                Palace
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/45">
              {HOTEL.description.slice(0, 120)}...
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/70">
              Explore
            </h4>
            <div className="flex flex-col gap-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group flex items-center gap-1 text-sm text-ivory/55 transition hover:text-ivory"
                >
                  {l.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/70">
              Contact
            </h4>
            <div className="flex flex-col gap-4 text-sm text-ivory/55">
              <a
                href={
                  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
                  "https://www.krishanshudhamapalace.com"
                }
                className="flex items-center gap-3 transition hover:text-gold"
              >
                <MapPin className="h-4 w-4 text-gold/60" />
                www.krishanshudhamapalace.com
              </a>
              <a
                href={HOTEL.phoneTel}
                className="flex items-center gap-3 transition hover:text-gold"
              >
                <Phone className="h-4 w-4 text-gold/60" />
                {HOTEL.phone}
              </a>
              <a
                href={`mailto:${HOTEL.email}`}
                className="flex items-center gap-3 transition hover:text-gold"
              >
                <Mail className="h-4 w-4 text-gold/60" />
                {HOTEL.email}
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold/60" />
                <span>{HOTEL.fullAddress}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/70">
              Social
            </h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-ivory/55 transition hover:text-ivory"
                >
                  {s.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                </a>
              ))}
            </div>
            <div className="mt-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-ivory/30">
                Newsletter
              </p>
              <form
                className="flex gap-2"
                onSubmit={subscribeNewsletter}
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 rounded-full border border-ivory/10 bg-white/5 px-4 py-2 text-sm text-ivory placeholder:text-ivory/25 focus:border-gold/30 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className="rounded-full bg-gold/20 px-4 py-2 text-xs font-medium text-gold transition hover:bg-gold/30"
                >
                  {newsletterStatus === "loading" ? "..." : "Join"}
                </button>
              </form>
              {newsletterStatus === "ok" ? (
                <p className="mt-2 text-xs text-emerald-300" role="status" aria-live="polite">
                  Subscribed successfully.
                </p>
              ) : null}
              {newsletterStatus === "err" ? (
                <p className="mt-2 text-xs text-rose-300" role="alert" aria-live="assertive">
                  Unable to subscribe right now.
                </p>
              ) : null}
            </div>
          </div>
        </Container>

        <div className="border-t border-white/5 py-6 text-center text-xs text-ivory/30">
          <Container>
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <span>
                &copy; {new Date().getFullYear()} {HOTEL.name}. All rights reserved.
              </span>
              <span className="hidden text-gold/30 sm:inline">|</span>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <Link href="/privacy" className="transition hover:text-ivory/60">
                  Privacy
                </Link>
                <Link href="/terms" className="transition hover:text-ivory/60">
                  Terms
                </Link>
                <Link href="/cancellation" className="transition hover:text-ivory/60">
                  Cancellation
                </Link>
                <Link href="/cookies" className="transition hover:text-ivory/60">
                  Cookies
                </Link>
                <Link href="/disclaimer" className="transition hover:text-ivory/60">
                  Disclaimer
                </Link>
                <Link href="/admin/login" className="transition hover:text-ivory/60">
                  Staff
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>
  );
}
