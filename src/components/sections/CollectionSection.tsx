import { SectionLayout } from "../layouts/public/SectionLayout";
import { ReactNode } from "react";
import {
  CollectionCard,
  CollectionCardSkeleton,
} from "../modules/cards/CollectionCard";
import { SkeletonFactory } from "../compositions/SkeletonFactory";
import { CollectionFrontend } from "@/lib/data/types/collectionTypes";
interface GridLayoutProps {
  children: ReactNode;
}

export const CollectionGrid = ({ children }: GridLayoutProps) => {
  return (
    <section className="grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 p-4 w-full py-8 gap-5">
      {children}
    </section>
  );
};

interface CollectionSectionProps {
  collections: CollectionFrontend[];
}

export const CollectionSection = ({ collections }: CollectionSectionProps) => {
  // console.log("collections", collections);
  return (
    <SectionLayout
      heading="Collections:"
      subheading="Curated by the family"
      buttonLabel="See more"
      buttonLink="/collections"
    >
      <CollectionGrid>
        {collections.map((collection, index) => (
          <CollectionCard key={index} collection={collection} />
        ))}
      </CollectionGrid>
    </SectionLayout>
  );
};

export const CollectionSectionSkeleton = () => (
  <SkeletonFactory
    Layout={CollectionGrid}
    Card={CollectionCardSkeleton}
    count={6}
  />
);
