import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { MapPin, Clock, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "Location",
  description: `Directions and nearby highlights near ${HOTEL.name}.`,
};

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
              title="Location map"
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
              <h2 className="font-serif text-2xl">Nearby Landmarks</h2>
              <p className="mt-3 text-sm leading-relaxed text-ivory/50">
                Concierge-assisted transfers and yatra planning available for all guests.
              </p>

              <div className="mt-6 space-y-4">
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
