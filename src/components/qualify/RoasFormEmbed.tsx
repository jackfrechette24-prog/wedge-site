"use client";

import { useEffect, useRef, useState } from "react";
import { qualifyCopy } from "@/content/flow";
import { CONTACT_EMAIL, ROASFORM } from "@/content/site";
import { cn } from "@/lib/cn";
import { loadRoasForm, roasFormOptions, type RoasFormInstance } from "@/lib/roasform";

type Props = {
  /** Any CSS height. The iframe fills it, with the script's own 600px minimum. */
  height?: string;
  className?: string;
};

type Status = "loading" | "ready" | "error";

/**
 * The ROASForm iframe. Render at most one per page: the container id is fixed by the form.
 * The container div is owned by the embed script (it clears it and inserts the iframe), so React never
 * renders children into it. The skeleton is a sibling layered on top.
 */
export function RoasFormEmbed({ height = "600px", className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    let instance: RoasFormInstance | null = null;
    setStatus("loading");

    loadRoasForm()
      .then((createForm) => {
        // Unmounted (or a strict mode re-run) before the script arrived: never mount into a dead container.
        if (cancelled || !containerRef.current?.isConnected) return;
        instance = createForm(roasFormOptions());
        if (!instance) {
          setStatus("error");
          return;
        }
        const iframe = instance.iframe;
        iframe.addEventListener("load", () => !cancelled && setStatus("ready"), { once: true });
        iframe.addEventListener("error", () => !cancelled && setStatus("error"), { once: true });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      // Removes the iframe, its message listener, and the container claim, so a remount starts clean.
      instance?.destroy();
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <div id={ROASFORM.containerId} ref={containerRef} style={{ width: "100%", height: "100%" }} />
      {status !== "ready" && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col gap-4 p-5 sm:p-8",
            status === "loading" && "pointer-events-none",
          )}
          role="status"
        >
          {status === "loading" ? (
            <>
              <span className="sr-only">{qualifyCopy.loading}</span>
              <div aria-hidden="true" className="flex animate-pulse flex-col gap-4">
                <div className="h-3 w-24 rounded-full bg-bone/10" />
                <div className="h-8 w-4/5 rounded-lg bg-bone/10" />
                <div className="h-8 w-3/5 rounded-lg bg-bone/[0.07]" />
                <div className="mt-4 h-14 w-full rounded-xl bg-bone/[0.06]" />
                <div className="h-14 w-full rounded-xl bg-bone/[0.06]" />
                <div className="mt-2 h-12 w-40 rounded-[10px] bg-lime/20" />
              </div>
            </>
          ) : (
            <div className="m-auto max-w-sm text-center">
              <p className="text-muted">{qualifyCopy.error.body}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-lime"
              >
                {qualifyCopy.error.linkLabel}: {CONTACT_EMAIL}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
