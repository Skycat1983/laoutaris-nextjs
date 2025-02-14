import { fetchAndResolveObj } from "@/utils/fetchAndResolveObj";
import {
  SanitizedArtwork,
  artworkToView,
} from "../../../transforms/artworkToPublic";
import { FrontendArtworkUnpopulated } from "../../../types/artworkTypes";
import { fetchArtwork } from "../data-fetching/fetchArtwork";
import { getUserIdFromSession } from "../../user/session/getUserIdFromSession";

// Aim: prevent the user from accessing an artwork that doesn't belong to a collection.

//Options:

//1) Fetch using collection model + populate the artworks?
//? is this any better than just making two calls, one for the collection and one for the artwork?

//2) Fetch the artworkById regardless. Then check in the resolver if the artwork belongs to the collection.

//* Rationale: for a user to try to access an artwork that doesn't belong to a collection is an unlikely scenario of no conceivably good reason nor gain.
//* It makes more sense to channel the overhead of checking if the artwork belongs to the collection to the resolver, where it can be handled more efficiently when these unlikely requests are made, rather than on every legitimate request.
//! Problem: We can't check what collection the artwork belongs to in the resolver because collections have artworks but artworks don't currently have collections
export const getArtworkView = async ({
  slug,
  artworkId,
}: // userId,
{
  slug: string;
  artworkId: string;
  // userId?: string | null;
}): Promise<SanitizedArtwork> => {
  const userId = await getUserIdFromSession();
  console.log("userId :>> ", userId);

  const fetcher = fetchArtwork;

  const identifierKey = "_id";
  const identifierValue = artworkId;
  const artworkFields: string[] = [];

  const resolver = (artwork: FrontendArtworkUnpopulated): SanitizedArtwork => {
    return artworkToView(artwork, userId);
  };

  const sanitzedArtwork = await fetchAndResolveObj<
    FrontendArtworkUnpopulated,
    SanitizedArtwork
  >(fetcher, identifierKey, identifierValue, artworkFields, resolver)();

  return sanitzedArtwork;
};
