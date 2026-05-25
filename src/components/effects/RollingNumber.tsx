"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type RollingNumberProps = {
  value: number;
  durationMs?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

export function RollingNumber({
  value,
  durationMs = 1400,
  decimals = 0,
  suffix = "",
  className = "",
}: RollingNumberProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, inView, reduce, value]);

  const text = useMemo(
    () => `${display.toFixed(decimals)}${suffix}`,
    [decimals, display, suffix],
  );

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
