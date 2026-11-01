import { LEGAL_TEMPLATE_NOTICE, LEGAL_UPDATED, type LegalSection } from "@/content/legal";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { WedgeList } from "./WedgeMark";

type Props = { title: string; path: string; sections: LegalSection[] };

export function LegalPage({ title, path, sections }: Props) {
  return (
    <div className="py-10 md:py-14">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: title, path }]} />
        <p className="mt-10 border border-line p-4 font-mono text-xs uppercase tracking-[0.12em] text-muted">{LEGAL_TEMPLATE_NOTICE}</p>
        <h1 className="mt-8 text-4xl md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted">{LEGAL_UPDATED}</p>
        <div className="prose-legal mt-4">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <WedgeList items={section.bullets} className="mt-4 text-muted" />}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
