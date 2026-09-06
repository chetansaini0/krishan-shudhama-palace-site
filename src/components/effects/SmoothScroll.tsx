"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarsePointer) return;

    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.1,
    });

    let rafId = 0;
    let cancelled = false;
    let onScroll: (() => void) | undefined;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (onScroll) lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
