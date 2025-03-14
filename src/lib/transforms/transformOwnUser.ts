import { UserBase, UserDB } from "@/lib/data/models";
import {
  EXTENDED_OWN_USER_FIELDS,
  SENSITIVE_OWN_USER_FIELDS,
  USER_OWN_FIELD_EXTENDER,
  SensitiveOwnUserFields,
  ExtendedOwnUserFields,
} from "@/lib/constants";
import {
  OwnUserLeanPopulated,
  OwnUserFrontendPopulated,
} from "../data/types/ownUserTypes";
import {
  transformArtwork,
  transformComment,
  createTransformer,
} from "@/lib/transforms";

export const transformOwnUser = createTransformer<
  UserDB,
  UserBase,
  ExtendedOwnUserFields,
  SensitiveOwnUserFields
>(EXTENDED_OWN_USER_FIELDS, SENSITIVE_OWN_USER_FIELDS, USER_OWN_FIELD_EXTENDER);

export const transformOwnUserPopulated = (
  doc: OwnUserLeanPopulated,
  userId?: string | null
): OwnUserFrontendPopulated => {
  const userPublic = transformOwnUser.toFrontend(doc, userId);
  const { favourites, watchlist, comments, ...baseDoc } = doc;
  const transformedFavourites = favourites.map((favourite) =>
    transformArtwork.toFrontend(favourite, userId)
  );
  const transformedWatchlist = watchlist.map((watchlist) =>
    transformArtwork.toFrontend(watchlist, userId)
  );
  const transformedComments = comments.map((comment) =>
    transformComment.toFrontend(comment, userId)
  );
  const populatedUser = {
    ...userPublic,
    favourites: transformedFavourites,
    watchlist: transformedWatchlist,
    comments: transformedComments,
  } satisfies OwnUserFrontendPopulated;

  return populatedUser;
};
