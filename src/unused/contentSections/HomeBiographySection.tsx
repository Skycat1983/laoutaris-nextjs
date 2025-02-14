import ButtonDivider from "../../components/elements/misc/ButtonDivider";
import HorizontalDivider from "../../components/elements/misc/HorizontalDivider";
import SectionHeading from "../../components/elements/typography/SectionHeading";
import { ScrollArea, ScrollBar } from "../../components/shadcn/scroll-area";
import BiographyCard from "../../components/modules/cards/BiographyCard";
import { BiographyCardData } from "../../components/loaders/sectionLoaders/BiographySectionLoader";

interface HomeBiographySectionProps {
  articles: BiographyCardData[];
}

export function HomeBiographySection({ articles }: HomeBiographySectionProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SectionHeading
        heading="Biography:"
        subheading="Read my grandfather's story"
      />
      <HorizontalDivider />
      <ScrollArea className="container whitespace-nowrap rounded-md h-[500px]">
        <section
          className="p-4 flex w-max space-x-4 h-[500px] mx-auto"
          data-testid="biography-content"
        >
          {articles.map((article, index) => (
            <BiographyCard entry={article} key={article.slug || index} />
          ))}
        </section>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ButtonDivider label="Read more" link="/biography" />
    </div>
  );
}
