"use client";

import { useReducedMotion } from "framer-motion";

export function ParticleField({ count = 20 }: { count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 5) % 96}%`,
    size: 2 + (i % 3),
    duration: 10 + (i % 8) * 2,
    delay: (i % 7) * 1.5,
    opacity: 0.15 + (i % 4) * 0.08,
  }));

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-float-up absolute bottom-0 rounded-full bg-gold/60"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            "--duration": `${p.duration}s`,
            "--delay": `${p.delay}s`,
            opacity: p.opacity,
          } as React.CSSProperties}
        />
      ))}
      <div className="animate-ray absolute -left-1/4 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-gold/5 to-transparent blur-3xl" />
    </div>
  );
}
