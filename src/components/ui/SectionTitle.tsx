"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
  const reduce = useReducedMotion();
  const centered = align === "center";
  const Heading = as;

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 space-y-4 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
    >
      {eyebrow && (
        <>
          <div
            className={`mb-5 h-px w-12 bg-gradient-to-r from-gold/80 to-transparent ${centered ? "mx-auto" : ""}`}
            aria-hidden
          />
          <p
            className={`text-[11px] font-medium uppercase tracking-[0.45em] ${dark ? "text-gold" : "text-gold-muted"}`}
          >
            {eyebrow}
          </p>
        </>
      )}
      <Heading
        className={`font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl ${dark ? "text-ivory" : "text-navy"}`}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={`text-base leading-relaxed lg:text-lg ${dark ? "text-ivory/60" : "text-charcoal/60"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
