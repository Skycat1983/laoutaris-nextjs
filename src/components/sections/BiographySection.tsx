import { HomePageSection } from "../experimental/templates/HomePageSection";
import { ReactNode } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/shadcn/scroll-area";
import {
  BiographyCard,
  BiographyCardSkeleton,
} from "@/components/ui/cards/BiographyCard";
import { BiographyCardData } from "@/components/loaders/sectionLoaders/BiographySectionLoader";
import { SkeletonFactory } from "@/components/common/SkeletonFactory";

interface BiographySectionProps {
  articles: BiographyCardData[];
}

interface ScrollLayoutProps {
  children: ReactNode;
}

export const BiographyScroll = ({ children }: ScrollLayoutProps) => {
  return (
    <ScrollArea className="container whitespace-nowrap rounded-md h-[500px]">
      <section className="p-4 flex w-max space-x-4 h-[500px] mx-auto">
        {children}
      </section>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export const BiographySection = ({ articles }: BiographySectionProps) => {
  return (
    <HomePageSection
      heading="Biography:"
      subheading="Read my grandfather's story"
      buttonLabel="Read more"
      buttonLink="/biography"
    >
      <BiographyScroll>
        {articles.map((article, index) => (
          <BiographyCard key={article.slug || index} entry={article} />
        ))}
      </BiographyScroll>
    </HomePageSection>
  );
};

export const BiographySectionSkeleton = () => (
  <SkeletonFactory
    Layout={BiographyScroll}
    Card={BiographyCardSkeleton}
    count={5}
  />
);
