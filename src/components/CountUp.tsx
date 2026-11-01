"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1000;
const NUMBER = /^(\D*)(\d+)(.*)$/;

/** Shows the final value in the HTML, then counts up from zero when it scrolls into view. Text like "US" stays as is. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(NUMBER);
    const el = ref.current;
    if (!match || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix = "", digits = "0", suffix = ""] = match;
    const target = Number(digits);

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">{display}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
