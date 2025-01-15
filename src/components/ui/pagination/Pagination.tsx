import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";
import { fetchCollectionArtwork } from "@/lib/server/collection/data-fetching/fetchCollectionArtwork";
import { delay } from "@/utils/debug";
import { fetchAndResolve } from "@/utils/fetchAndResolve";
import {
  PaginationArtworkLink,
  collectionArtworkToPaginationLink,
} from "@/utils/resolvers";
import React from "react";

export type SelectedCollectionFields = Pick<
  IFrontendCollection,
  "artworks" | "slug" | "title"
>;
export type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "_id">;

export type CollectionArtwork = SelectedCollectionFields & {
  artworks: SelectedArtworkFields[];
};

interface PaginationProps {
  collectionSlug: string;
}

//! v1 with resolver
const Pagination = async ({ collectionSlug }: PaginationProps) => {
  await delay(1000);

  const fetcher = fetchCollectionArtwork;
  const collectionKey = "slug";
  const collectionValue = collectionSlug;
  const collectionFields = ["slug", "title"];

  const artworkFields = [
    "_id",
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];
  const resolver = collectionArtworkToPaginationLink;

  const fetchLinks = fetchAndResolve<
    CollectionArtwork,
    PaginationArtworkLink[]
  >(
    fetcher,
    collectionKey,
    collectionValue,
    collectionFields,
    resolver,
    artworkFields
  );

  const paginationData = await fetchLinks();

  console.log("paginationData", paginationData);

  return <div>Pagination</div>;
};

export { Pagination };

// const Pagination = async ({ collectionSlug }: PaginationProps) => {
//   await delay(1000);
//   const collectionKey = "slug";
//   const collectionValue = collectionSlug;
//   const collectionFields = ["slug", "title"];

//   const artworkFields = [
//     "_id",
//     "image.secure_url",
//     "image.pixelHeight",
//     "image.pixelWidth",
//   ];
//   const response = await fetchCollectionArtwork(
//     collectionKey,
//     collectionValue,
//     collectionFields,
//     artworkFields
//   );

//   console.log("response in Pagination", response);

//   const artworkLinks = response.data.artworks;

//   return <div>

//   </div>;
// };
