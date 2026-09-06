"use client";

import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  const Heading = as;

  return (
    <div
      className={`mb-14 space-y-4 lg:mb-16 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
    >
      {eyebrow && (
        <>
          <div
            className={`mb-4 h-px w-10 bg-gradient-to-r from-gold/80 to-transparent ${centered ? "mx-auto" : ""}`}
            aria-hidden
          />
          <p
            className={`text-[11px] font-medium uppercase tracking-[0.4em] ${dark ? "text-gold" : "text-gold-muted"}`}
          >
            {eyebrow}
          </p>
        </>
      )}
      <Heading
        className={`font-serif text-3xl leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-ivory" : "text-navy"
        }`}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={`text-base leading-relaxed lg:text-lg ${dark ? "text-ivory/58" : "text-charcoal/60"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
