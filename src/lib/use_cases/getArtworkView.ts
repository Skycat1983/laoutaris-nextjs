import { fetchAndResolveObj } from "@/utils/fetchAndResolveObj";
import {
  SanitizedArtwork,
  artworkToView,
} from "../resolvers/artworkToSanitizedIdArr";
import { fetchArtworks } from "../server/artwork/data-fetching/fetchArtworks";
import { FrontendArtworkUnpopulated } from "../client/types/artworkTypes";

export const getArtworkView = async ({
  artworkId,
  currentUserId,
}: {
  artworkId: string;
  currentUserId?: string;
}): Promise<SanitizedArtwork> => {
  const fetcher = fetchArtworks;
  const identifierKey = "_id";
  const identifierValue = artworkId;
  const artworkFields: string[] = [];
  const resolver = (artwork: FrontendArtworkUnpopulated): SanitizedArtwork => {
    return artworkToView(artwork, currentUserId);
  };
  const sanitzedArtwork = await fetchAndResolveObj<
    FrontendArtworkUnpopulated,
    SanitizedArtwork
  >(fetcher, identifierKey, identifierValue, artworkFields, resolver)();

  return sanitzedArtwork;
};
