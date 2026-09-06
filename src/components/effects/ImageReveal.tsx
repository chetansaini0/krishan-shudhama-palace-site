"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ImageReveal({ children, className = "", delay = 0 }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.clipPath = "none";
      el.style.opacity = "1";
      return;
    }

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.15,
            delay,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }, el);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`gsap-image-reveal overflow-hidden ${className}`}
      style={{ clipPath: "inset(0 100% 0 0)" }}
    >
      {children}
    </div>
  );
}
