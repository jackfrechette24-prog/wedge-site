import { LEGAL_TEMPLATE_NOTICE, LEGAL_UPDATED, type LegalSection } from "@/content/legal";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./Container";
import { Headline } from "./Headline";
import { WedgeList } from "./WedgeMark";

type Props = { title: string; path: string; sections: LegalSection[] };

export function LegalPage({ title, path, sections }: Props) {
  return (
    <div className="pb-20 pt-8 lg:pb-28">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: title, path }]} />
        <p className="mono-label mt-10 rounded-xl border border-line-strong p-4 text-mist">{LEGAL_TEMPLATE_NOTICE}</p>
        <Headline segments={[{ text: title }]} as="h1" size={1} className="mt-8" />
        <p className="mt-4 text-sm text-mist">{LEGAL_UPDATED}</p>
        <div className="prose-legal mt-4">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && <WedgeList items={section.bullets} className="mt-4 text-mist" />}
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
