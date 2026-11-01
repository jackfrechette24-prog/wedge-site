import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { caseStudiesCopy as copy, caseStudiesSeo, caseStudyTemplateCopy } from "@/content/results";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(caseStudiesSeo, "/case-studies");

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: copy.breadcrumb, path: "/case-studies" }]} eyebrow={copy.eyebrow} title={copy.h1}>
        <p className="mt-6 max-w-3xl text-lg text-muted md:text-xl">{copy.intro}</p>
      </PageHero>
      <Section tone="light">
        <CaseStudyGrid />
      </Section>
      <CtaBand title={caseStudyTemplateCopy.ctaTitle} note={caseStudyTemplateCopy.ctaNote} />
    </>
  );
}
