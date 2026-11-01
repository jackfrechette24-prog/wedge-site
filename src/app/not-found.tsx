import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import { SectionLabel } from "@/components/SectionLabel";
import { notFoundCopy as copy } from "@/content/flow";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-24 md:py-36">
        <Container className="max-w-3xl">
          <SectionLabel className="mb-6">{copy.eyebrow}</SectionLabel>
          <Headline segments={copy.title} as="h1" size={1} />
          <p className="mt-6 text-xl text-muted">{copy.body}</p>
          <div className="mt-8">
            <ButtonLink href="/" arrow>{copy.link}</ButtonLink>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
