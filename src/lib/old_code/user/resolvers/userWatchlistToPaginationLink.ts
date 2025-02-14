import { buildUrl } from "@/lib/utils/buildUrl";
import { FrontendArtworkFull } from "../../../data/types/artworkTypes";
import { FrontendUserWithWatcherlist } from "@/lib/data/types/userTypes";
import { PaginationArtworkLink } from "@/components/modules/pagination/CollectionViewPagination";

type SelectedUserFields = Pick<FrontendUserWithWatcherlist, "watchlist">;

export type UserWatchlistToPaginationBridge = SelectedUserFields;

export const userWatchlistToPaginationLink = (
  userPopulated: UserWatchlistToPaginationBridge
): PaginationArtworkLink[] => {
  return userPopulated.watchlist.map((artwork) => ({
    secure_url: artwork.image.secure_url,
    height: artwork.image.pixelHeight,
    width: artwork.image.pixelWidth,
    link_to: buildUrl(["account", "watchlist", artwork._id]),
  }));
};
