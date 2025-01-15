import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { delay } from "@/utils/debug";
import React from "react";
import PaginationItem, { PaginationArtworkLink } from "./PaginationItem";

export type SelectedCollectionFields = Pick<
  IFrontendCollection,
  "artworks" | "slug" | "title"
>;
export type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "_id">;

export type CollectionArtwork = SelectedCollectionFields & {
  artworks: SelectedArtworkFields[];
};

interface PaginationProps {
  getData: () => Promise<PaginationArtworkLink[]>;
}

const Pagination = async ({ getData }: PaginationProps) => {
  await delay(2000);

  const paginationData = await getData();

  console.log("paginationData", paginationData);

  return (
    <>
      {paginationData.map((artworkLink) => (
        <PaginationItem
          key={artworkLink.link_to}
          secure_url={artworkLink.secure_url}
          height={artworkLink.height}
          width={artworkLink.width}
          link_to={artworkLink.link_to}
        />
      ))}
    </>
  );
};

export { Pagination };
