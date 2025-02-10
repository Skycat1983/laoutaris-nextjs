"use server";

import ButtonDivider from "../ui/common/ButtonDivider";
import HorizontalDivider from "../ui/common/HorizontalDivider";
import SectionHeading from "../ui/common/SectionHeading";
import { ScrollArea, ScrollBar } from "../ui/shadcn/scroll-area";
import BiographyCard from "../ui/cards/biographyCard/BiographyCard";
import {
  getHomepageArticleSectionData,
  HomeBiographySectionCardData,
} from "@/lib/server/article/use_cases/getHomepageArticleSectionData";
import { FrontendArticle } from "@/lib/types/articleTypes";
import { headers } from "next/headers";
import { BiographyCardData } from "../loaders/homeBiographySectionLoader/HomeBiographySectionLoader";

interface HomeBiographySectionProps {
  articles: BiographyCardData[];
}

const HomeBiographySection: React.FC<HomeBiographySectionProps> = ({
  articles,
}) => {
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
};

export default HomeBiographySection;
