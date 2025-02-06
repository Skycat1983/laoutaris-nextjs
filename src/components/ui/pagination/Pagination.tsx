import React from "react";
import PaginationItem from "./PaginationItem";
import CollectionInfo from "../common/CollectionInfo";
import PaginationLayout from "@/components/layouts/PaginationLayout";
import { ArtworkNavFields } from "@/lib/types/navigationTypes";
import { buildUrl } from "@/utils/buildUrl";

interface PaginationProps {
  slug: string;
  items: ArtworkNavFields[];
}

export function Pagination({ slug, items }: PaginationProps) {
  return (
    <>
      <CollectionInfo
        heading="More from this collection"
        subheading={`${items.length} pieces`}
      />
      <PaginationLayout>
        {items.map((artwork) => (
          <PaginationItem
            key={artwork._id}
            secure_url={artwork.image.secure_url}
            height={artwork.image.pixelHeight}
            width={artwork.image.pixelWidth}
            link_to={buildUrl(["collections", slug, artwork._id])}
          />
        ))}
      </PaginationLayout>
    </>
  );
}
