import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions",
  description: `The terms governing bookings, stays, and use of the ${HOTEL.name} website and services.`,
  path: "/terms",
  keywords: [HOTEL.name, "hotel booking terms Khatu"],
});

const LAST_UPDATED = "May 2026";

const sections = [
  {
    heading: "1. Acceptance of Terms",
    body: [
      `By accessing this website or making a reservation with ${HOTEL.name}, you agree to these Terms & Conditions. If you do not agree, please discontinue use of our services.`,
    ],
  },
  {
    heading: "2. Bookings & Reservations",
    body: [
      "All bookings are subject to availability and confirmation. Rates are quoted per the selected room category and dates, and may vary on weekends, festivals, and peak seasons.",
      "Guests must provide accurate information at the time of booking. A valid government-issued ID is required at check-in.",
    ],
  },
  {
    heading: "3. Payments",
    body: [
      "Payments are processed securely via our payment partner. A booking is considered confirmed only after successful payment and confirmation from our system.",
      "Applicable taxes and fees are charged as per prevailing government regulations.",
    ],
  },
  {
    heading: "4. Cancellation & Refunds",
    body: [
      "Cancellation and refund eligibility depend on the rate plan and dates selected, and the terms shown at the time of booking. Certain promotional rates may be non-refundable.",
      "Refunds, where applicable, are processed to the original payment method within standard banking timelines.",
    ],
  },
  {
    heading: "5. Check-in & Check-out",
    body: [
      "Standard check-in is from 1:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges.",
    ],
  },
  {
    heading: "6. Guest Conduct & Property",
    body: [
      "Guests are expected to conduct themselves respectfully and comply with hotel policies. The hotel maintains a 100% pure vegetarian kitchen.",
      "Guests are responsible for any loss or damage to hotel property caused during their stay.",
    ],
  },
  {
    heading: "7. Events & Banquet Bookings",
    body: [
      "Event and banquet bookings are governed by separate agreements covering capacity, catering, decor, timing, and advance payments, as confirmed with our events team.",
    ],
  },
  {
    heading: "8. Liability",
    body: [
      "While we take every measure to ensure guest safety and comfort, the hotel is not liable for personal belongings, indirect losses, or events beyond our reasonable control.",
    ],
  },
  {
    heading: "9. Intellectual Property",
    body: [
      `All content on this website, including text, images, and branding, is the property of ${HOTEL.name} and may not be reproduced without permission.`,
    ],
  },
  {
    heading: "10. Changes to Terms",
    body: [
      "We may revise these Terms & Conditions at any time. Continued use of our services constitutes acceptance of the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Terms & Conditions"
          subtitle={`Last updated: ${LAST_UPDATED}`}
        />

        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm leading-relaxed text-charcoal/65">
            Please read these terms carefully before using our website or booking a stay at{" "}
            {HOTEL.name}.
          </p>

          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-xl text-navy">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-charcoal/60">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section className="rounded-2xl border border-gold/15 bg-white p-6">
            <h2 className="font-serif text-xl text-navy">11. Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              Questions about these terms? Reach us at:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-charcoal/70">
              <li>
                Email:{" "}
                <a href={`mailto:${HOTEL.email}`} className="text-gold-muted hover:text-gold">
                  {HOTEL.email}
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href={HOTEL.phoneTel} className="text-gold-muted hover:text-gold">
                  {HOTEL.phone}
                </a>
              </li>
              <li>Address: {HOTEL.fullAddress}</li>
            </ul>
          </section>
        </div>
      </Container>
    </div>
  );
}
