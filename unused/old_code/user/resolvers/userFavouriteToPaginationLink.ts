import { buildUrl } from "@/lib/utils/buildUrl";
import { FrontendArtworkFull } from "../../../../src/lib/data/types/artworkTypes";
import { FrontendUserWithFavourites } from "@/lib/data/types/userTypes";

type SelectedUserFields = Pick<FrontendUserWithFavourites, "favourites">;
type SelectedArtworkFields = Pick<FrontendArtworkFull, "image" | "_id">;

export type UserFavouriteToPaginationBridge = SelectedUserFields & {
  favourites: SelectedArtworkFields[];
};

export interface PaginationArtworkLink {
  secure_url: string;
  height: number;
  width: number;
  link_to: string;
}

export const userFavouriteToPaginationLink = (
  userPopulated: UserFavouriteToPaginationBridge
): PaginationArtworkLink[] => {
  return userPopulated.favourites.map((artwork) => ({
    secure_url: artwork.image.secure_url,
    height: artwork.image.pixelHeight,
    width: artwork.image.pixelWidth,
    link_to: buildUrl(["account", "favourites", artwork._id]),
  }));
};
