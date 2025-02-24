import { ReactNode } from "react";

import { SectionLayout } from "../layouts/public/SectionLayout";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import {
  BiographyCard,
  BiographyCardSkeleton,
} from "@/components/modules/cards/BiographyCard";
import { SkeletonFactory } from "@/components/compositions/SkeletonFactory";
import { FrontendArticle } from "@/lib/data/types";

interface BiographySectionProps {
  articles: FrontendArticle[];
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
    <SectionLayout
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
    </SectionLayout>
  );
};

export const BiographySectionSkeleton = () => (
  <SkeletonFactory
    Layout={BiographyScroll}
    Card={BiographyCardSkeleton}
    count={5}
  />
);
