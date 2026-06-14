import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";
import { buildPageMetadata } from "@/lib/seo";
import { HOTEL } from "@/lib/constants";
import { siteUrl } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article" };
  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const site = siteUrl();
  const articleUrl = `${site}/blog/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: HOTEL.name },
    publisher: {
      "@type": "Organization",
      name: HOTEL.name,
      logo: { "@type": "ImageObject", url: `${site}/logo-light.png` },
    },
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="bg-ivory pt-28 pb-20 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />
      <Container>
        <article className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm text-gold hover:underline">
            &larr; All articles
          </Link>
          <h1 className="mt-6 font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-charcoal/50">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readMinutes} min read
          </p>
          <p className="mt-6 text-base leading-relaxed text-charcoal/70">{post.description}</p>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl text-navy">{section.heading}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-sm leading-relaxed text-charcoal/65">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-gold/15 bg-navy p-8 text-center text-ivory">
            <h2 className="font-serif text-2xl">Plan your stay in Khatoo</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ivory/55">
              Book the best hotel near Khatu Shyam Temple — luxury rooms with direct booking.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/book"
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-light"
              >
                Book Your Stay
              </Link>
              <Link
                href="/rooms"
                className="rounded-full border border-ivory/20 px-6 py-2.5 text-sm text-ivory transition hover:border-gold/50"
              >
                View Rooms
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
