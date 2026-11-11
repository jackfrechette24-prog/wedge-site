"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { CTAS, LEAD_FORM_PROVIDER } from "@/content/site";
import { Arrow, buttonClass } from "../Button";
import { useQualifyModal } from "./QualifyModal";

type Props = {
  /** "text" leaves styling entirely to className, for footer-style links. */
  variant?: "primary" | "secondary" | "text";
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
  /** Runs before the popup opens, e.g. to close the mobile menu. */
  onClick?: () => void;
};

/**
 * Every "See If You Qualify" button on the site. Always a real link to /apply, so it works without
 * JavaScript and with open in new tab. With the ROASForm provider, a plain click opens the popup instead.
 */
export function QualifyButton({ variant = "primary", arrow, className, children = CTAS.primary.label, onClick }: Props) {
  const { open, preload, inline } = useQualifyModal();
  const classes = variant === "text" ? className : buttonClass(variant, className);
  const content = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );

  if (LEAD_FORM_PROVIDER !== "roasform") {
    return (
      <Link href={CTAS.primary.href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    // Let modified clicks (new tab, new window) behave like a normal link.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(event.currentTarget);
  };

  return (
    <a
      href={CTAS.primary.href}
      className={classes}
      aria-haspopup={inline ? undefined : "dialog"}
      onClick={handleClick}
      onPointerEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
    >
      {content}
    </a>
  );
}
