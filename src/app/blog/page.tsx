import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { buildPageMetadata } from "@/lib/seo";
import { Calendar, Clock } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Travel Guide & Blog — Khatu Shyam Ji & Khatoo",
  description:
    "Insider guides for your Khatu yatra — best time to visit Khatu Shyam Temple, places nearby, and why our hotel in Khatoo is the ideal base.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      <Container>
        <SectionTitle
          as="h1"
          eyebrow="Travel Guide"
          title="Khatu Shyam Ji & Khatoo travel tips"
          subtitle="Plan your pilgrimage with local insights — temples, seasons, and the best accommodation in Khatoo."
        />

        <div className="mx-auto grid max-w-4xl gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-gold/15 bg-white p-6 shadow-sm transition hover:border-gold/30 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/45">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {post.readMinutes} min read
                </span>
              </div>
              <h2 className="mt-3 font-serif text-xl text-navy sm:text-2xl">
                <Link href={`/blog/${post.slug}`} className="hover:text-gold">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-gold hover:underline"
              >
                Read article &rarr;
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
