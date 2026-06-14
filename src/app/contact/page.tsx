import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContactForm } from "@/components/contact/ContactForm";
import { HOTEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact — Hotel in Khatoo Near Khatu Shyam Temple",
  description: `Contact ${HOTEL.name} for room bookings, banquet events & yatra assistance. Best hotel in Khatoo — call ${HOTEL.phone} or WhatsApp.`,
  path: "/contact",
});

export default function ContactPage() {
  const wa = `https://wa.me/${HOTEL.whatsapp}`;
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Get in Touch"
          title="We are here for every detail"
          subtitle="Reservations, bespoke itineraries, celebration planning, and group bookings — reach us instantly."
        />

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6 rounded-2xl bg-navy p-8 text-ivory shadow-2xl lg:p-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold/70">
                Immediate Assistance
              </p>
              <h3 className="mt-3 font-serif text-2xl">Contact Information</h3>
            </div>

            <div className="space-y-5 text-sm">
              <a
                href={HOTEL.phoneTel}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-gold/20 hover:bg-white/[0.06]"
              >
                <div className="rounded-lg bg-gold/10 p-2.5">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-ivory/40">Phone</p>
                  <p className="font-medium">{HOTEL.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${HOTEL.email}`}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-gold/20 hover:bg-white/[0.06]"
              >
                <div className="rounded-lg bg-gold/10 p-2.5">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-ivory/40">Email</p>
                  <p className="font-medium">{HOTEL.email}</p>
                </div>
              </a>

              <Link
                href={wa}
                target="_blank"
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-gold/20 hover:bg-white/[0.06]"
              >
                <div className="rounded-lg bg-green-500/10 p-2.5">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-ivory/40">WhatsApp</p>
                  <p className="font-medium">Chat with us</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="rounded-lg bg-gold/10 p-2.5">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-ivory/40">Address</p>
                  <p className="font-medium">{HOTEL.fullAddress}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-xs text-gold/60">
                <Clock className="h-3.5 w-3.5" /> Reception Hours
              </div>
              <p className="mt-2 text-sm text-ivory/60">24 hours — we never close</p>
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-gold/10 shadow-xl">
          <iframe
            title="Hotel location"
            src={HOTEL.mapsEmbedUrl}
            className="aspect-[21/9] min-h-[280px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </div>
  );
}
