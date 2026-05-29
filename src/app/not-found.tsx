import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HOTEL } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center bg-ivory pt-28 pb-20 lg:pt-36">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.5em] text-gold-muted">
            Page not found
          </p>
          <h1 className="mt-4 font-serif text-5xl text-navy sm:text-6xl">404</h1>
          <p className="mt-4 text-base leading-relaxed text-charcoal/60">
            The page you are looking for may have moved or no longer exists. Let us help you
            find your way back to {HOTEL.shortName}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="btn-shimmer rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-navy transition hover:bg-gold-light"
            >
              Return Home
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-navy/15 px-8 py-3 text-sm font-medium text-navy transition hover:border-gold hover:text-gold"
            >
              Book a Stay
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-navy/15 px-8 py-3 text-sm font-medium text-navy transition hover:border-gold hover:text-gold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
