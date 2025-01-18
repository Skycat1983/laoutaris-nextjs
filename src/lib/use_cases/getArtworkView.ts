import { fetchAndResolveObj } from "@/utils/fetchAndResolveObj";
import { SanitizedArtwork, artworkToView } from "../resolvers/artworkToView";
import { FrontendArtworkUnpopulated } from "../types/artworkTypes";
import { fetchArtwork } from "../server/artwork/data-fetching/fetchArtwork";

export const getArtworkView = async ({
  artworkId,
  currentUserId,
}: {
  artworkId: string;
  currentUserId?: string;
}): Promise<SanitizedArtwork> => {
  const fetcher = fetchArtwork;

  const identifierKey = "_id";
  const identifierValue = artworkId;
  const artworkFields: string[] = [];

  // const result = await fetchArtwork<FrontendArtworkUnpopulated>(
  //   identifierKey,
  //   identifierValue,
  //   artworkFields
  // );

  // console.log("result in getArtworkView", result);

  const resolver = (artwork: FrontendArtworkUnpopulated): SanitizedArtwork => {
    return artworkToView(artwork, currentUserId);
  };

  const sanitzedArtwork = await fetchAndResolveObj<
    FrontendArtworkUnpopulated,
    SanitizedArtwork
  >(fetcher, identifierKey, identifierValue, artworkFields, resolver)();

  return sanitzedArtwork;
};
