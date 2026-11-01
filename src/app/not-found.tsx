import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { notFoundCopy as copy } from "@/content/flow";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-24 md:py-36">
        <Container className="max-w-3xl">
          <Eyebrow className="mb-5">{copy.eyebrow}</Eyebrow>
          <h1 className="text-5xl md:text-7xl">{copy.title}</h1>
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
