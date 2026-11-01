import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { notAFitCopy as copy, notAFitSeo } from "@/content/flow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(notAFitSeo, "/not-a-fit", { noindex: true });

type Props = { searchParams: Promise<{ reason?: string | string[] }> };

export default async function NotAFitPage({ searchParams }: Props) {
  const { reason } = await searchParams;
  const body = reason === "not_owner" || reason === "budget" ? copy.reasons[reason] : copy.reasons.default;

  return (
    <div className="py-20 md:py-32">
      <Container className="max-w-3xl">
        <Eyebrow className="mb-5">{copy.eyebrow}</Eyebrow>
        <h1 className="text-4xl md:text-6xl">{copy.title}</h1>
        <p className="mt-6 text-xl text-muted">{body}</p>
        <div className="mt-8">
          <ButtonLink href="/" variant="secondary">{copy.homeLink}</ButtonLink>
        </div>
      </Container>
    </div>
  );
}
