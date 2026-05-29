import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${HOTEL.name} uses cookies and similar technologies on our website.`,
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 2026";

const sections = [
  {
    heading: "1. What Are Cookies?",
    body: [
      "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you signed in, and understand how visitors use our pages.",
    ],
  },
  {
    heading: "2. How We Use Cookies",
    body: [
      "Essential cookies: Required for core functionality such as booking flows, form security, and session management. These cannot be disabled without affecting site operation.",
      "Analytics cookies: Help us understand traffic patterns, popular pages, and booking funnel performance so we can improve the guest experience. These are only loaded when analytics is enabled.",
      "Preference cookies: Remember choices such as language or display settings where applicable.",
    ],
  },
  {
    heading: "3. Third-Party Cookies",
    body: [
      "We use trusted third-party services that may set their own cookies, including Google Analytics (when configured), Razorpay for secure payments, and embedded Google Maps on our location page.",
      "These providers have their own privacy policies governing how they use data.",
    ],
  },
  {
    heading: "4. Managing Cookies",
    body: [
      "You can control or delete cookies through your browser settings. Most browsers allow you to block third-party cookies, clear stored cookies, or receive alerts before cookies are set.",
      "Disabling essential cookies may prevent you from completing bookings or using certain features.",
    ],
  },
  {
    heading: "5. Updates",
    body: [
      "We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Cookie Policy"
          subtitle={`Last updated: ${LAST_UPDATED}`}
        />

        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm leading-relaxed text-charcoal/65">
            This policy explains how {HOTEL.name} uses cookies and similar tracking technologies on
            our website.
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
            <h2 className="font-serif text-xl text-navy">6. Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              Questions about our use of cookies? Reach us at{" "}
              <a href={`mailto:${HOTEL.email}`} className="text-gold-muted hover:text-gold">
                {HOTEL.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
