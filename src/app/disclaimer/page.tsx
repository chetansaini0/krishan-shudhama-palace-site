import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description: `Website disclaimer and liability information for ${HOTEL.name}.`,
  path: "/disclaimer",
  keywords: [HOTEL.name],
});

const LAST_UPDATED = "May 2026";

const sections = [
  {
    heading: "1. Website Information",
    body: [
      "The information on this website is provided for general informational purposes about Krishan Shudhama Palace, its rooms, dining, events, and services. While we strive to keep content accurate and up to date, details such as rates, availability, amenities, and images may change without notice.",
    ],
  },
  {
    heading: "2. No Warranty",
    body: [
      "This website and its content are provided \"as is\" without warranties of any kind, express or implied. We do not guarantee uninterrupted access, error-free operation, or that the site is free of viruses or harmful components.",
    ],
  },
  {
    heading: "3. Booking & Pricing",
    body: [
      "Displayed room rates, packages, and promotions are indicative and subject to confirmation at the time of booking. Final pricing, taxes, and inclusions will be shown before payment.",
      "Online availability is not guaranteed until a booking is confirmed and payment is successfully processed.",
    ],
  },
  {
    heading: "4. Third-Party Links",
    body: [
      "Our website may contain links to third-party sites such as social media, maps, and payment providers. We are not responsible for the content, privacy practices, or availability of external websites.",
    ],
  },
  {
    heading: "5. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Krishan Shudhama Palace shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of this website or reliance on its content.",
      "Nothing in this disclaimer limits liability where such limitation is prohibited by applicable law.",
    ],
  },
  {
    heading: "6. Intellectual Property",
    body: [
      "All text, images, logos, and design elements on this website are the property of Krishan Shudhama Palace or used under license. Unauthorized reproduction or distribution is prohibited.",
    ],
  },
  {
    heading: "7. Governing Law",
    body: [
      "This disclaimer is governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Rajasthan, India.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          align="left"
          eyebrow="Legal"
          title="Disclaimer"
          subtitle={`Last updated: ${LAST_UPDATED}`}
        />

        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm leading-relaxed text-charcoal/65">
            Please read this disclaimer carefully before using the {HOTEL.name} website or making
            reservations through it.
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
            <h2 className="font-serif text-xl text-navy">8. Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              For questions about this disclaimer, contact{" "}
              <a href={`mailto:${HOTEL.email}`} className="text-gold-muted hover:text-gold">
                {HOTEL.email}
              </a>{" "}
              or call{" "}
              <a href={HOTEL.phoneTel} className="text-gold-muted hover:text-gold">
                {HOTEL.phone}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
