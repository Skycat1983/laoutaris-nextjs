import {
  ExtendedPublicArtworkFields,
  ExtendedPublicBlogFields,
  ExtendedPublicCollectionFields,
  ExtendedPublicArticleFields,
  ExtendedPublicCommentFields,
  ExtendedPublicUserFields,
} from "../constants";
import {
  ArtworkDB,
  ArticleDB,
  BlogEntryDB,
  CollectionDB,
  CommentDB,
  UserDB,
} from "../data/models";
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
