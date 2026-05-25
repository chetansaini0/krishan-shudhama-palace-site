"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HOTEL } from "@/lib/constants";

export function BanquetHero({ imageSrc }: { imageSrc: string }) {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      <Image src={imageSrc} alt="Banquet hall" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
      <Container className="relative z-10 flex h-full items-end pb-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-gold">
            Events & Celebrations
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl lg:text-6xl">
            Grand <span className="text-gold">Celebrations</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ivory/60">
            Weddings, receptions, conferences — celebrate in royal style.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#inquire"
              className="btn-shimmer rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wider text-navy transition hover:bg-gold-light"
            >
              Inquire Now
            </a>
            <Link
              href={`https://wa.me/${HOTEL.whatsapp}`}
              target="_blank"
              className="rounded-full border border-ivory/20 px-8 py-3 text-sm font-medium text-ivory transition hover:border-gold/40 hover:text-gold"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
