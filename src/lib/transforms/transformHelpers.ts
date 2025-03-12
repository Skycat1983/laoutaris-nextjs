import {
  ExtendedPublicArtworkFields,
  ExtendedPublicBlogFields,
  ExtendedPublicCollectionFields,
  ExtendedPublicArticleFields,
} from "../constants";
import {
  ArtworkDB,
  ArticleDB,
  BlogEntryDB,
  CollectionDB,
} from "../data/models";
import { calculateReadTime } from "../utils/calcReadTime";
import { isUserInArray } from "../utils/isUserInArray";

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

export const extendCollectionFields = (
  doc: CollectionDB,
  userId?: string | null
) => {
  return {
    artworkCount: doc.artworks.length,
    firstArtworkId: doc.artworks[0]?.toString(),
  } satisfies Partial<ExtendedPublicCollectionFields>;
};

export const extendBlogFields = (doc: BlogEntryDB, userId?: string | null) => {
  return {
    commentCount: doc.comments.length,
  } satisfies Partial<ExtendedPublicBlogFields>;
};

export const extendArticleFields = (doc: ArticleDB, userId?: string | null) => {
  return {
    readTime: calculateReadTime(doc.text),
  } satisfies Partial<ExtendedPublicArticleFields>;
};
