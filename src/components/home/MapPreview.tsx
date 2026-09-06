"use client";

import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HOTEL } from "@/lib/constants";
import { Reveal } from "@/components/effects/Reveal";
import Link from "next/link";
import { MapPin, Navigation, Clock } from "lucide-react";

const nearby = [
  { label: "Khatu Shyam Temple", time: "2 min walk" },
  { label: "Main market & shopping", time: "5 min" },
  { label: "Bus station", time: "10 min" },
  { label: "Sikar city", time: "45 min" },
];

export function MapPreview() {
  return (
    <section className="relative overflow-hidden bg-ivory py-[var(--space-section)]">
      <Container>
        <SectionTitle
          eyebrow="Location"
          title="Prime address near the temple"
          subtitle={HOTEL.fullAddress}
        />

        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="overflow-hidden rounded-2xl border border-gold/10 shadow-2xl">
              <iframe
                title="Hotel location"
                src={HOTEL.mapsEmbedUrl}
                className="aspect-[16/10] min-h-[300px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-navy p-8 text-ivory shadow-xl lg:p-10">
              <div>
                <div className="mb-6 inline-flex rounded-xl bg-gold/10 p-3">
                  <MapPin className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-serif text-2xl text-ivory">Getting Here</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/50">
                  We are steps away from Khatu Shyam Ji temple. Concierge pickup available from
                  bus station and nearby towns.
                </p>

                <div className="mt-6 space-y-4">
                  {nearby.map((n) => (
                    <div key={n.label} className="flex items-center justify-between text-sm">
                      <span className="text-ivory/70">{n.label}</span>
                      <span className="flex items-center gap-1 text-gold/70">
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
                  Get Directions
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
        </Reveal>
      </Container>
    </section>
  );
}
