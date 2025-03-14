import {
  ExtendedPublicArtworkFields,
  ExtendedPublicBlogFields,
  ExtendedPublicCollectionFields,
  ExtendedPublicArticleFields,
  ExtendedPublicCommentFields,
  ExtendedPublicUserFields,
  ExtendedOwnUserFields,
} from "../constants";
import {
  ExtendedBiographyNavFields,
  ExtendedCollectionNavFields,
  ExtendedOwnUserNavFields,
} from "../constants/navConstants";
import {
  ArtworkDB,
  ArticleDB,
  BlogEntryDB,
  CollectionDB,
  CommentDB,
  UserDB,
} from "../data/models";
import {
  ArticleSelectFields,
  CollectionSelectFields,
  OwnUserSelectFields,
} from "../data/types";
import { calculateReadTime } from "../utils/calcReadTime";
import { isUserInArray } from "../utils/isUserInArray";

export const extendArticleFields = (doc: ArticleDB, userId?: string | null) => {
  return {
    readTime: calculateReadTime(doc.text),
  } satisfies Partial<ExtendedPublicArticleFields>;
};

export const extendArtworkFields = (
  artwork: ArtworkDB,
  userId?: string | null
) => {
  return {
    favouriteCount: artwork.favourited.length,
    watchlistCount: artwork.watcherlist.length,
    collectionCount: artwork.collections.length,
    isFavourited: isUserInArray(artwork.favourited, userId),
    isWatchlisted: isUserInArray(artwork.watcherlist, userId),
  } satisfies Partial<ExtendedPublicArtworkFields>;
};

export const extendBlogFields = (doc: BlogEntryDB, userId?: string | null) => {
  return {
    commentCount: doc.comments.length,
  } satisfies Partial<ExtendedPublicBlogFields>;
};

export const extendCollectionFields = (
  doc: CollectionDB,
  userId?: string | null
) => {
  return {
    artworkCount: doc.artworks.length,
    firstArtworkId: doc.artworks[0]?.toString(),
  } satisfies Partial<ExtendedPublicCollectionFields>;
};

export const extendCommentFields = (doc: CommentDB, userId?: string | null) => {
  return {
    isOwner: doc.author.toString() === userId,
  } satisfies Partial<ExtendedPublicCommentFields>;
};

export const extendUserFields = (doc: UserDB, userId?: string | null) => {
  return {
    isOwner: doc.toString() === userId,
  } satisfies Partial<ExtendedPublicUserFields>;
};

export const extendOwnUserFields = (doc: UserDB, userId?: string | null) => {
  return {
    favouritedCount: doc.favourites.length,
    watchlistCount: doc.watchlist.length,
    commentCount: doc.comments.length,
  } satisfies Partial<ExtendedOwnUserFields>;
};

export const extendOwnUserNavFields = (
  doc: OwnUserSelectFields
): Partial<ExtendedOwnUserNavFields> => ({
  firstFavouriteId: doc.favourites[0]?.toString() || null,
  firstWatchlistId: doc.watchlist[0]?.toString() || null,
  firstCommentId: doc.comments[0]?.toString() || null,
  hasFavourites: doc.favourites.length > 0,
  hasWatchlist: doc.watchlist.length > 0,
  hasComments: doc.comments.length > 0,
});

export const extendCollectionNavFields = (
  doc: CollectionSelectFields
): Partial<ExtendedCollectionNavFields> => ({
  firstArtworkId: doc.artworks[0]?.toString() || null,
  hasArtwork: doc.artworks.length > 0,
});

export const extendBiographyNavFields = (
  doc: ArticleSelectFields
): Partial<ExtendedBiographyNavFields> => {
  return {};
};
