import {
  FrontendArtworkFull,
  FrontendCollectionFull,
} from "../client/types/populatedTypes";
import { buildUrl } from "@/utils/buildUrl";

type SelectedCollectionFields = Pick<
  FrontendCollectionFull,
  "artworks" | "slug" | "title"
>;
type SelectedArtworkFields = Pick<FrontendArtworkFull, "image" | "_id">;

export type CollectionArtworkToPaginationBridge = SelectedCollectionFields & {
  artworks: SelectedArtworkFields[];
};

export interface PaginationArtworkLink {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

export const collectionArtworkToPaginationLink = (
  collectionPopulated: CollectionArtworkToPaginationBridge
): PaginationArtworkLink[] => {
  // console.log("CollectionArtwork:", collection);
  return collectionPopulated.artworks.map((artwork) => ({
    secure_url: artwork.image.secure_url,
    height: artwork.image.pixelHeight,
    width: artwork.image.pixelWidth,
    link_to: buildUrl(["collections", collectionPopulated.slug, artwork._id]),
  }));
};
