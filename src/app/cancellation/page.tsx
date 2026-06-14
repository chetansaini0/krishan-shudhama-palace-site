import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cancellation & Refund Policy",
  description: `Booking cancellation, modification, and refund terms for ${HOTEL.name} — hotel in Khatoo near Khatu Shyam Temple.`,
  path: "/cancellation",
  keywords: [HOTEL.name, "hotel cancellation policy Khatu"],
});

const LAST_UPDATED = "May 2026";

const sections = [
  {
    heading: "1. General Policy",
    body: [
      "All reservations at Krishan Shudhama Palace are subject to availability and confirmation. Cancellation and refund eligibility depend on the rate plan selected at the time of booking and the timing of your cancellation request.",
      "For banquet and event bookings, separate terms may apply as outlined in your event contract or quotation.",
    ],
  },
  {
    heading: "2. Room Bookings — Standard Rate",
    body: [
      "Cancellations made 72 hours or more before the scheduled check-in time: full refund of the amount paid, minus applicable payment gateway charges if any.",
      "Cancellations made between 72 and 24 hours before check-in: 50% refund of the total booking amount.",
      "Cancellations made within 24 hours of check-in, or no-shows: no refund.",
    ],
  },
  {
    heading: "3. Room Bookings — Non-Refundable / Promotional Rates",
    body: [
      "Bookings made under non-refundable, advance purchase, or special promotional rates are not eligible for cancellation or refund unless otherwise stated at the time of booking.",
      "Modifications to stay dates for non-refundable bookings are subject to availability and may incur additional charges.",
    ],
  },
  {
    heading: "4. Modifications",
    body: [
      "Date changes or room upgrades may be requested by contacting our reservations team. Changes are subject to availability and rate differences.",
      "We recommend contacting us as early as possible to avoid cancellation penalties.",
    ],
  },
  {
    heading: "5. Refund Processing",
    body: [
      "Approved refunds are processed to the original payment method within 7–10 business days, depending on your bank or payment provider.",
      "For payments made via Razorpay, refund timelines follow the payment gateway's standard processing schedule.",
    ],
  },
  {
    heading: "6. Force Majeure",
    body: [
      "In exceptional circumstances beyond our control — including natural disasters, government restrictions, or temple-related closures — we will work with guests on rescheduling or credit options on a case-by-case basis.",
    ],
  },
  {
    heading: "7. Event & Banquet Cancellations",
    body: [
      "Event cancellations require written notice. Deposit and cancellation terms for weddings, receptions, and corporate events are specified in your signed event agreement.",
      "Partial deposits may be non-refundable depending on how close the cancellation is to the event date and resources already committed.",
    ],
  },
];

export default function CancellationPolicyPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Cancellation & Refund Policy"
          subtitle={`Last updated: ${LAST_UPDATED}`}
        />

        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm leading-relaxed text-charcoal/65">
            We understand plans can change. This policy outlines how cancellations, modifications, and
            refunds are handled for stays and events at {HOTEL.name}.
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
            <h2 className="font-serif text-xl text-navy">8. Contact for Cancellations</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              To cancel or modify a booking, please contact us as soon as possible:
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
              <li>
                WhatsApp:{" "}
                <a
                  href={`https://wa.me/${HOTEL.whatsapp}`}
                  className="text-gold-muted hover:text-gold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message us
                </a>
              </li>
            </ul>
          </section>
        </div>
      </Container>
    </div>
  );
}
