import type { CaseStudy } from "@/content/caseStudies";
import type { Segments } from "@/content/types";
import { QualifyButton } from "./qualify/QualifyButton";
import { Headline } from "./Headline";
import { VideoCard } from "./VideoCard";

const GRID_COLUMNS = 4;

type Props = { studies: CaseStudy[]; nextCard: { title: Segments; body: string } };

/** Scroll-snap carousel on mobile, a grid of 4 on desktop. A call to action fills any spare columns. */
export function ResultsRow({ studies, nextCard }: Props) {
  const spare = GRID_COLUMNS - studies.length;
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
      {studies.map((study) => (
        <div key={study.slug} className="w-[72vw] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none">
          <VideoCard study={study} />
        </div>
      ))}
      {spare > 0 && (
        <div
          style={{ gridColumn: `span ${spare}` }}
          className="surface-card featured-card flex w-[72vw] max-w-[300px] shrink-0 snap-center flex-col justify-end p-6 md:w-auto md:max-w-none md:p-8"
        >
          <Headline segments={nextCard.title} as="h3" size={3} />
          <p className="mt-4 text-muted">{nextCard.body}</p>
          <div className="mt-6">
            <QualifyButton arrow />
          </div>
        </div>
      )}
    </div>
  );
}
