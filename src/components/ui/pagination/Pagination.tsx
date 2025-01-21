import { delay } from "@/utils/debug";
import React from "react";
import PaginationItem from "./PaginationItem";
import { Skeleton } from "../shadcn/skeleton";
import { PaginationArtworkLink } from "@/lib/server/collection/resolvers/collectionArtworkToPaginationLink";
import CollectionInfo from "../common/CollectionInfo";
import PaginationLayout from "@/components/layouts/PaginationLayout";

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

export { Pagination };
