import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `How ${HOTEL.name} collects, uses, and protects your personal information when you book our hotel in Khatoo.`,
  path: "/privacy",
  keywords: [HOTEL.name, "hotel privacy policy Khatu"],
});

const LAST_UPDATED = "May 2026";

const sections = [
  {
    heading: "1. Information We Collect",
    body: [
      "We collect information you provide directly when you make a booking, submit an inquiry, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, stay dates, and payment-related details processed by our secure payment partner.",
      "We also automatically collect limited technical data such as device, browser, and usage information to operate and improve our website.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: [
      "We use your information to confirm and manage reservations, process payments, respond to inquiries, send service communications, and improve our guest experience.",
      "With your consent, we may send promotional offers. You can opt out of marketing communications at any time.",
    ],
  },
  {
    heading: "3. Payment Processing",
    body: [
      "Payments are processed securely through our payment gateway partner. We do not store your full card details on our servers. All transactions are encrypted and handled in accordance with industry security standards.",
    ],
  },
  {
    heading: "4. Cookies & Tracking",
    body: [
      "Our website uses essential cookies to function correctly and may use analytics cookies to understand usage. You can control cookies through your browser settings.",
    ],
  },
  {
    heading: "5. Data Sharing",
    body: [
      "We do not sell your personal information. We share data only with trusted service providers (such as payment, email, and SMS partners) strictly to deliver our services, or when required by law.",
    ],
  },
  {
    heading: "6. Data Security",
    body: [
      "We apply reasonable technical and organizational measures to protect your information, including encryption in transit, access controls, and secure infrastructure. No method of transmission is fully secure, but we work to safeguard your data.",
    ],
  },
  {
    heading: "7. Your Rights",
    body: [
      "You may request access to, correction of, or deletion of your personal data, and you may withdraw consent for marketing at any time. To exercise these rights, contact us using the details below.",
    ],
  },
  {
    heading: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy periodically. Material changes will be reflected on this page with an updated revision date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Privacy Policy"
          subtitle={`Last updated: ${LAST_UPDATED}`}
        />

        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm leading-relaxed text-charcoal/65">
            At {HOTEL.name}, we respect your privacy and are committed to protecting your personal
            information. This policy explains what we collect, how we use it, and the choices you have.
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
            <h2 className="font-serif text-xl text-navy">9. Contact Us</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              For privacy questions or requests, contact us at:
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
