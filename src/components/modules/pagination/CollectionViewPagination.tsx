import React, { ReactNode } from "react";
import { ArtworkPaginationItem } from "./ArtworkPaginationItem";
import CollectionInfo from "../wip/CollectionInfo";
import { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { buildUrl } from "@/lib/utils/buildUrl";

interface PaginationProps {
  slug: string;
  items: ArtworkNavFields[];
}

const CollectionPaginationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-start justify-start pl-4 gap-8">{children}</div>
  );
};

export function CollectionPagination({ slug, items }: PaginationProps) {
  return (
    <>
      <CollectionInfo
        heading="More from this collection"
        subheading={`${items.length} pieces`}
      />
      <CollectionPaginationLayout>
        {items.map((artwork) => (
          <ArtworkPaginationItem
            key={artwork._id}
            secure_url={artwork.image.secure_url}
            height={artwork.image.pixelHeight}
            width={artwork.image.pixelWidth}
            link_to={buildUrl(["collections", slug, artwork._id])}
          />
        ))}
      </CollectionPaginationLayout>
    </>
  );
}
