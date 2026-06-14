import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { HOTEL } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { MapPin, Clock, Navigation, Phone, Mail, Star } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Location — Hotel Near Khatu Shyam Temple, Khatoo",
  description: `${HOTEL.name} is steps from Khatu Shyam Ji temple in Khatoo, Rajasthan. Map, directions, parking & nearby attractions for your yatra.`,
  path: "/location",
});

const nearby = [
  { place: "Khatu Shyam Temple", time: "2 min walk" },
  { place: "Main market & shopping", time: "5 min" },
  { place: "Salasar Balaji Temple", time: "1 hr drive" },
  { place: "Sikar city", time: "45 min" },
  { place: "Jaipur airport", time: "3 hr" },
];

export default function LocationPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Location", path: "/location" },
        ]}
      />
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Getting Here"
          title="Steps away from the temple"
          subtitle={HOTEL.fullAddress}
        />

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-2xl border border-gold/10 shadow-2xl">
            <iframe
              title={`${HOTEL.name} location near Khatu Shyam Temple`}
              src={HOTEL.mapsEmbedUrl}
              className="aspect-[16/11] min-h-[320px] w-full"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col justify-between rounded-2xl bg-navy p-8 text-ivory shadow-xl lg:p-10">
            <div>
              <div className="mb-6 inline-flex rounded-xl bg-gold/10 p-3">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <h2 className="font-serif text-2xl">Hotel address</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">{HOTEL.fullAddress}</p>
              <p className="mt-1 text-sm text-ivory/50">
                {HOTEL.city}, {HOTEL.state} {HOTEL.postalCode}
              </p>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-ivory/70">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a href={HOTEL.phoneTel} className="transition hover:text-gold">
                    {HOTEL.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-ivory/70">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${HOTEL.email}`} className="transition hover:text-gold">
                    {HOTEL.email}
                  </a>
                </div>
              </dl>

              <h3 className="mt-8 font-serif text-lg">Hours</h3>
              <ul className="mt-3 space-y-2 text-sm text-ivory/60">
                <li>Front desk: {HOTEL.businessHours.frontDesk}</li>
                <li>Check-in: {HOTEL.businessHours.checkIn}</li>
                <li>Check-out: {HOTEL.businessHours.checkOut}</li>
                <li>Restaurant: {HOTEL.businessHours.restaurant}</li>
              </ul>

              <h3 className="mt-8 font-serif text-lg">Nearby landmarks</h3>
              <div className="mt-4 space-y-3">
                {nearby.map((n) => (
                  <div
                    key={n.place}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm"
                  >
                    <span className="text-ivory/70">{n.place}</span>
                    <span className="flex items-center gap-1 text-xs text-gold/70">
                      <Clock className="h-3 w-3" />
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={HOTEL.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-sm font-semibold text-navy transition hover:bg-gold-light"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
              </Link>
              <Link
                href={HOTEL.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-gold/30 py-3 text-sm text-gold transition hover:bg-gold/10"
              >
                <Star className="h-4 w-4" />
                Find us on Google
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center rounded-xl border border-ivory/15 py-3 text-sm text-ivory/70 transition hover:border-gold/30 hover:text-gold"
              >
                Request Pickup
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
