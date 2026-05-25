"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useCallback, useState, type MouseEvent, type ReactNode } from "react";

const base =
  "btn-shimmer relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-[0.98]";

const variants: Record<string, string> = {
  primary:
    "bg-navy text-ivory shadow-md hover:bg-navy-light hover:shadow-lg",
  gold:
    "bg-gold text-navy shadow-md shadow-gold/20 hover:bg-gold-light hover:shadow-lg",
  outline:
    "border border-navy/15 bg-transparent text-navy hover:border-gold hover:text-gold hover:shadow-md",
  ghost: "text-navy hover:bg-navy/5",
};

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  href,
  onClick,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (reduceMotion || disabled) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const id = performance.now();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((p) => p.id !== id));
      }, 700);
    },
    [reduceMotion, disabled],
  );

  const cls = `${base} ${variants[variant]} ${className}`;

  const content = (
    <>
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">{children}</span>
      {ripples.map((rip) => (
        <span
          key={rip.id}
          className="btn-ripple-dot"
          style={{ left: rip.x, top: rip.y }}
          aria-hidden
        />
      ))}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        onClick={(e) => addRipple(e)}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={(e) => {
        addRipple(e);
        onClick?.();
      }}
      disabled={disabled}
      className={`${cls} disabled:opacity-50`}
    >
      {content}
    </button>
  );
}
