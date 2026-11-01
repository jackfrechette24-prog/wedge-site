import Link from "next/link";
import type { ReactNode } from "react";

const INLINE = /\*\*(.+?)\*\*|\[(.+?)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1]) {
      nodes.push(<strong key={match.index} className="font-medium text-ink">{match[1]}</strong>);
    } else if (match[2] && match[3]) {
      nodes.push(
        <Link key={match.index} href={match[3]} className="underline underline-offset-4 hover:text-accent">
          {match[2]}
        </Link>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Plain text with **bold**, [links](/path), and blank-line paragraphs. */
export function SimpleMarkdown({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {text.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph} className="mt-3 first:mt-0">
          {renderInline(paragraph)}
        </p>
      ))}
    </div>
  );
}

