import type {
  FrontendUser,
  FrontendUserWithComments,
  FrontendUserWithFavourites,
  FrontendUserWithWatchlist,
} from "@/lib/data/types/userTypes";
import type { PublicArtwork } from "@/lib/transforms/artworkToPublic";
import type { ArtworkNavFields } from "@/lib/data/types/navigationTypes";
import { Fetcher } from "../../core/createFetcher";

export const createUserFetchers = (fetcher: Fetcher) => ({
  // Get user settings
  fetchUserSettings: async () => fetcher<FrontendUser>(`/api/v2/user`),

  // Get user comments
  fetchUserComments: async () =>
    fetcher<FrontendUserWithComments>(`/api/v2/user/comments`),

  // Get user favourites
  fetchUserFavourites: async () =>
    fetcher<{ favourites: ArtworkNavFields[] }>(`/api/v2/user/favourites`),

  // Get specific favourite artwork
  fetchUserFavouriteArtwork: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<PublicArtwork>(
      `/api/v2/user/favourites/${encodedArtworkId}`
    );
  },

  // Get user watchlist
  fetchUserWatchlist: async () =>
    fetcher<FrontendUserWithWatchlist>(`/api/v2/user/watchlist`),

  // Get specific watchlist artwork
  fetchUserWatchlistArtwork: async (artworkId: string) => {
    const encodedArtworkId = encodeURIComponent(artworkId);
    return fetcher<PublicArtwork>(`/api/v2/user/watchlist/${encodedArtworkId}`);
  },
});

// Type for our user fetchers object
export type UserFetchers = ReturnType<typeof createUserFetchers>;
