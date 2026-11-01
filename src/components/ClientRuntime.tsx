"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { captureAttribution } from "@/lib/attribution";
import { flushLeadQueue } from "@/lib/leadQueue";
import { trackPageView } from "@/lib/tracking";

/** Background work for every page: attribution cookie, queued leads, and in-app page views. */
export function ClientRuntime() {
  const pathname = usePathname();
  const firstView = useRef(true);

  useEffect(() => {
    captureAttribution();
    void flushLeadQueue();
  }, []);

  useEffect(() => {
    // The first page view is sent by the base script.
    if (firstView.current) firstView.current = false;
    else trackPageView();
  }, [pathname]);

  return null;
}
