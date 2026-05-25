"use client";

export function ElegantSpinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-gold/25 border-t-gold border-r-navy/40 ${className}`}
      aria-hidden
    />
  );
}
