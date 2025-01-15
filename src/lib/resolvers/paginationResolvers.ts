import { buildUrl } from "@/utils/buildUrl";
import { IFrontendCollection } from "../client/types/collectionTypes";
import { IFrontendArtwork } from "../client/types/artworkTypes";

export type SelectedCollectionFields = Pick<
  IFrontendCollection,
  "artworks" | "slug" | "title"
>;
export type SelectedArtworkFields = Pick<IFrontendArtwork, "image" | "_id">;

export type CollectionArtwork = SelectedCollectionFields & {
  artworks: SelectedArtworkFields[];
};

export interface PaginationArtworkLink {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

export const collectionArtworkToPaginationLink = (
  collection: CollectionArtwork
): PaginationArtworkLink[] => {
  console.log("CollectionArtwork:", collection);
  return collection.artworks.map((artwork) => ({
    secure_url: artwork.image.secure_url,
    height: artwork.image.pixelHeight,
    width: artwork.image.pixelWidth,
    link_to: buildUrl(["collections", collection.slug, artwork._id]),
  }));
};
