import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about stays, bookings, dining, events, and policies at ${HOTEL.name}.`,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ · ${HOTEL.name}`,
    description: `Answers to common questions about ${HOTEL.name}.`,
    url: "/faq",
  },
};

const faqs = [
  {
    q: "Where is Krishan Shudhama Palace located?",
    a: `We are located near Khatu Shyam Ji temple — ${HOTEL.fullAddress}. The temple is just a short walk away, making us ideal for pilgrims and families.`,
  },
  {
    q: "What are the check-in and check-out times?",
    a: "Standard check-in is from 1:00 PM and check-out is by 11:00 AM. Early check-in and late check-out can be arranged on request, subject to availability.",
  },
  {
    q: "How do I book a room?",
    a: "You can book directly on our website via the Book page for the best rates, or contact our concierge by phone or WhatsApp for assisted bookings and group reservations.",
  },
  {
    q: "Is the kitchen pure vegetarian?",
    a: "Yes. Our restaurant is 100% pure vegetarian, serving satvik, Rajasthani, South Indian, Chinese, and Continental cuisine prepared with care.",
  },
  {
    q: "Do you host weddings and events?",
    a: "Absolutely. Our pillar-free banquet hall hosts weddings, receptions, corporate events, and family celebrations with in-house catering, decor, and event planning support.",
  },
  {
    q: "Is parking available?",
    a: "Yes, we offer ample on-site parking with valet service and a separate guest entry for events.",
  },
  {
    q: "What amenities are included with my stay?",
    a: "All stays include complimentary high-speed Wi-Fi, air-conditioned rooms, 24/7 service, CCTV security, room service, and access to our restaurant. Explore the Amenities page for the full list.",
  },
  {
    q: "Do you provide temple transfers or yatra assistance?",
    a: "Yes. Our concierge and travel desk arrange temple-route shuttles, airport pickups, local guides, and complete yatra planning for our guests.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellation terms depend on the rate and dates booked and are shown during checkout. For specific assistance, please contact our team directly.",
  },
  {
    q: "How can I contact the hotel?",
    a: `Call us at ${HOTEL.phone}, email ${HOTEL.email}, or message us on WhatsApp. Our team responds promptly to all inquiries.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Help Center"
          title="Frequently asked questions"
          subtitle="Everything you need to know before your stay. Can't find an answer? Our concierge is here to help."
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-gold/15 bg-white px-5 py-1 shadow-sm transition hover:border-gold/30 open:border-gold/40 open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-base text-navy outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:text-lg">
                <span>{f.q}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-5 pr-9 text-sm leading-relaxed text-charcoal/60">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-gold/15 bg-navy p-8 text-center text-ivory">
          <h2 className="font-serif text-2xl">Still have questions?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ivory/55">
            Our concierge team is available 24/7 to help plan your perfect stay.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={HOTEL.phoneTel}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-light"
            >
              Call {HOTEL.phone}
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-ivory/20 px-6 py-2.5 text-sm text-ivory transition hover:border-gold/50 hover:text-gold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
