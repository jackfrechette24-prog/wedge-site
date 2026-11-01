import { BookingEmbed } from "@/components/apply/BookingEmbed";
import { Container } from "@/components/Container";
import { Headline } from "@/components/Headline";
import { SectionLabel } from "@/components/SectionLabel";
import { bookCopy as copy, bookSeo } from "@/content/flow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(bookSeo, "/book", { noindex: true });

export default function BookPage() {
  return (
    <div className="py-10 lg:py-16">
      <Container className="max-w-4xl">
        <SectionLabel className="mb-5">{copy.eyebrow}</SectionLabel>
        <Headline segments={copy.title} as="h1" size={1} />
        <p className="mt-4 text-lg text-muted">{copy.body}</p>
        <div className="mt-8">
          <BookingEmbed />
        </div>
      </Container>
    </div>
  );
}
