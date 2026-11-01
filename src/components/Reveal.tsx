"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Phase = "static" | "armed" | "visible";

/** Content starts visible, so it stays readable if scripts never load. Only below-the-fold content gets hidden. */
function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
    setPhase("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPhase("visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, phase };
}

/** Fades and slides children in on scroll. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, phase } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(phase === "armed" && "reveal-armed", phase === "visible" && "reveal-visible", className)}
      style={delay && phase === "visible" ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
