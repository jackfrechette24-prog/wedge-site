"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { qualifyCopy } from "@/content/flow";
import { CTAS, LEAD_FORM_PROVIDER, ROASFORM } from "@/content/site";
import { preloadRoasForm } from "@/lib/roasform";
import { RoasFormEmbed } from "./RoasFormEmbed";

type QualifyModalApi = {
  /** Opens the popup. On /apply it scrolls to the inline form instead. */
  open: (trigger?: HTMLElement | null) => void;
  close: () => void;
  /** Starts loading the embed script so the form shows up fast. */
  preload: () => void;
  /** True on /apply, where the form is inline and buttons scroll to it. */
  inline: boolean;
};

const QualifyModalContext = createContext<QualifyModalApi | null>(null);

export function useQualifyModal(): QualifyModalApi {
  const context = useContext(QualifyModalContext);
  if (!context) throw new Error("useQualifyModal must be used inside QualifyModalProvider");
  return context;
}

const TITLE_ID = "qualify-modal-title";
const enabled = LEAD_FORM_PROVIDER === "roasform";

function wantsModalFromUrl() {
  const url = new URL(window.location.href);
  return url.hash === "#qualify" || url.searchParams.get("qualify") === "1";
}

export function QualifyModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const inline = pathname === CTAS.primary.href;

  const [isOpen, setIsOpen] = useState(false);
  // The embed mounts on first open and then stays mounted, so a half-filled form survives close and reopen.
  const [embedMounted, setEmbedMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (trigger?: HTMLElement | null) => {
      if (!enabled) {
        router.push(CTAS.primary.href);
        return;
      }
      if (inline) {
        // One container id per page, so /apply never opens a second copy in the popup.
        document.getElementById(ROASFORM.containerId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      triggerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setEmbedMounted(true);
      setIsOpen(true);
    },
    [inline, router],
  );

  const close = useCallback(() => dialogRef.current?.close(), []);
  const preload = useCallback(() => {
    if (enabled) preloadRoasForm();
  }, []);

  // Keep the native dialog in sync with state. showModal() makes the page behind it inert,
  // traps focus inside, and closes on Escape.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Lock page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  // Navigating away closes the popup. Landing on /apply also drops the popup's copy of the form,
  // because /apply renders its own and the container id can only exist once.
  useEffect(() => {
    setIsOpen(false);
    if (inline) setEmbedMounted(false);
  }, [pathname, inline]);

  // Ads and emails can link straight to the popup with #qualify or ?qualify=1.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    if (!enabled) return;
    const check = () => {
      if (wantsModalFromUrl()) openRef.current(null);
    };
    // Wait a frame so the page (and /apply's inline form) is laid out first.
    const frame = requestAnimationFrame(check);
    window.addEventListener("hashchange", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", check);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  };

  const api = useMemo(() => ({ open, close, preload, inline }), [open, close, preload, inline]);

  return (
    <QualifyModalContext.Provider value={api}>
      {children}
      {enabled && !inline && (
        <dialog
          ref={dialogRef}
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          onClose={handleClose}
          onClick={(event) => {
            // The card fills the dialog box, so a click on the dialog itself is a click on the overlay.
            if (event.target === dialogRef.current) close();
          }}
          className="flex-col overflow-hidden border-t-2 border-t-lime bg-graphite p-0 text-bone backdrop:bg-obsidian/80 backdrop:backdrop-blur-sm open:flex max-sm:m-0 max-sm:h-dvh max-sm:max-h-none max-sm:w-full max-sm:max-w-none max-sm:border-x-0 max-sm:border-b-0 sm:m-auto sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-w-[720px] sm:rounded-[20px] sm:border-x sm:border-b sm:border-line-strong sm:border-t-lime"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line py-2 pl-5 pr-2 sm:pl-6">
            <h2 id={TITLE_ID} className="mono-label flex items-center gap-2 text-mist">
              <span className="size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
              {qualifyCopy.modalLabel}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={qualifyCopy.closeLabel}
              className="flex size-11 items-center justify-center rounded-full text-mist transition-colors hover:text-bone"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain sm:h-[min(85vh,760px)] sm:min-h-[600px] sm:flex-none">
            {embedMounted && <RoasFormEmbed height="100%" />}
          </div>
        </dialog>
      )}
    </QualifyModalContext.Provider>
  );
}
