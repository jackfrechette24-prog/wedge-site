"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { bookCopy as copy } from "@/content/flow";
import { BOOKING_PREFILL_PARAMS, CONTACT_EMAIL } from "@/content/site";
import { isQualified, loadPrefill } from "./session";

const EMBED_URL = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL;
const EMBED_SCRIPT = process.env.NEXT_PUBLIC_BOOKING_EMBED_SCRIPT;

function buildCalendarUrl(base: string) {
  const url = new URL(base);
  const prefill = loadPrefill();
  if (prefill) {
    url.searchParams.set(BOOKING_PREFILL_PARAMS.firstName, prefill.firstName);
    url.searchParams.set(BOOKING_PREFILL_PARAMS.lastName, prefill.lastName);
    url.searchParams.set(BOOKING_PREFILL_PARAMS.email, prefill.email);
    url.searchParams.set(BOOKING_PREFILL_PARAMS.phone, prefill.phone);
  }
  return url.toString();
}

export function BookingEmbed() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!isQualified()) {
      router.replace("/apply");
      return;
    }
    if (EMBED_URL) setSrc(buildCalendarUrl(EMBED_URL));
    setReady(true);
  }, [router]);

  if (ready && !EMBED_URL) {
    return (
      <div className="surface-card featured-card p-6 md:p-10">
        <h2 className="card-title">{copy.noCalendar.title}</h2>
        <p className="mt-3 text-muted">{copy.noCalendar.body}</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-lime">
          {copy.noCalendar.linkLabel}
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-[900px] overflow-hidden rounded-[22px] border border-line-strong bg-bone">
      {src && <iframe src={src} title={copy.calendarTitle} className="h-[900px] w-full border-0" />}
      {src && EMBED_SCRIPT && <Script src={EMBED_SCRIPT} strategy="afterInteractive" />}
    </div>
  );
}
