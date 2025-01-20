import { delay } from "@/utils/debug";
import React, { ReactNode } from "react";
import PaginationItem from "./PaginationItem";
import { Skeleton } from "../shadcn/skeleton";
import { PaginationArtworkLink } from "@/lib/server/collection/resolvers/collectionArtworkToPaginationLink";
import SectionHeading from "../common/SectionHeading";
import CollectionInfo from "../common/CollectionInfo";

const PaginationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8">{children}</div>
  );
};

const PaginationSkeleton = () => {
  return (
    <>
      <PaginationLayout>
        {[1, 2, 3, 4, 5].map((index) => (
          <Skeleton key={index} className="h-[200px] lg:h-[400px] w-[200px]" />
        ))}
      </PaginationLayout>
    </>
  );
};
interface PaginationProps {
  getData: () => Promise<PaginationArtworkLink[]>;
}

const Pagination = async ({ getData }: PaginationProps) => {
  await delay(2000);

  const paginationData = await getData();

  return (
    <>
      <CollectionInfo
        heading="More from this collection"
        subheading={`${paginationData.length} pieces`}
      />
      <PaginationLayout>
        {paginationData.map((artworkLink) => (
          <PaginationItem
            key={artworkLink.link_to}
            secure_url={artworkLink.secure_url}
            height={artworkLink.height}
            width={artworkLink.width}
            link_to={artworkLink.link_to}
          />
        ))}
      </PaginationLayout>
      ;
    </>
  );
};

export { Pagination, PaginationSkeleton };
