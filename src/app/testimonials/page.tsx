import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { Testimonials } from "@/components/home/Testimonials";
import { buildPageMetadata } from "@/lib/seo";
import { HOTEL } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Guest Reviews — Best Hotel in Khatoo Near Khatu Shyam Temple",
  description: `Read guest reviews of ${HOTEL.name} — trusted by pilgrims, families, and wedding guests near Khatu Shyam Ji in Khatoo.`,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <div className="bg-ivory">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Guest Reviews", path: "/testimonials" },
        ]}
      />
      <Container className="pt-28 pb-8 lg:pt-36">
        <SectionTitle
          as="h1"
          eyebrow="Guest Reviews"
          title="Stories from our guests"
          subtitle="Trusted by pilgrims, families, and celebrations — hear what makes every stay at our hotel in Khatoo memorable."
        />
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/book"
            className="inline-flex rounded-full bg-gold px-8 py-3 text-sm font-semibold text-navy transition hover:bg-gold-light"
          >
            Book Your Stay
          </Link>
        </div>
      </Container>
      <Testimonials />
    </div>
  );
}
