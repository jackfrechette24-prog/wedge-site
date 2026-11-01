import { BookingEmbed } from "@/components/apply/BookingEmbed";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { bookCopy as copy, bookSeo } from "@/content/flow";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(bookSeo, "/book", { noindex: true });

export default function BookPage() {
  return (
    <div className="py-10 md:py-14">
      <Container className="max-w-4xl">
        <Eyebrow className="mb-4">{copy.eyebrow}</Eyebrow>
        <h1 className="text-4xl md:text-6xl">{copy.title}</h1>
        <p className="mt-4 text-lg text-muted">{copy.body}</p>
        <div className="mt-8">
          <BookingEmbed />
        </div>
      </Container>
    </div>
  );
}
