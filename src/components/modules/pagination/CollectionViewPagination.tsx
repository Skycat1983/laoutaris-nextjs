import React, { ReactNode } from "react";
import {
  ArtworkPaginationItem,
  ArtworkPaginationItemSkeleton,
} from "./ArtworkPaginationItem";
import CollectionInfo from "../wip/CollectionInfo";
import { ArtworkFrontend } from "@/lib/data/types";

interface PaginationProps {
  items: ArtworkFrontend[];
  heading: string;
  link_to: (artwork: ArtworkFrontend) => string;
}

const PaginationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8">{children}</div>
  );
};

export function ArtworkPagination({
  items,
  heading,
  link_to,
}: PaginationProps) {
  console.log("items", items);
  return (
    <>
      <CollectionInfo heading={heading} subheading={`${items.length} pieces`} />
      <PaginationLayout>
        {items.map((artwork) => (
          <ArtworkPaginationItem
            key={artwork._id}
            secure_url={artwork.image.secure_url}
            height={artwork.image.pixelHeight}
            width={artwork.image.pixelWidth}
            link_to={link_to(artwork)}
          />
        ))}
      </PaginationLayout>
    </>
  );
}

export const PaginationSkeleton = () => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8">
      <ArtworkPaginationItemSkeleton />
    </div>
  );
};
