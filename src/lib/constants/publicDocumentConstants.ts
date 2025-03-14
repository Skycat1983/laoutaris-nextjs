//! ARTICLE

import {
  ArticleDB,
  ArtworkDB,
  BlogEntryDB,
  CollectionDB,
  CommentDB,
  UserDB,
} from "../data/models";
import {
  extendArtworkFields,
  extendBlogFields,
  extendCollectionFields,
  extendArticleFields,
  extendCommentFields,
  extendUserFields,
} from "../transforms/transformHelpers";

//! ARTICLE
// Fields to remove: timestamps
export type ArticleFields = keyof Pick<ArticleDB, "createdAt" | "updatedAt">;

export const SENSITIVE_PUBLIC_ARTICLE_FIELDS: readonly ArticleFields[] = [
  "createdAt",
  "updatedAt",
] as const;

export type SensitivePublicArticleFields =
  (typeof SENSITIVE_PUBLIC_ARTICLE_FIELDS)[number];

export const EXTENDED_PUBLIC_ARTICLE_FIELDS: ExtendedPublicArticleFields = {
  readTime: 0,
} as const;

export type ExtendedPublicArticleFields = {
  readTime: number;
};

export const ARTICLE_FIELD_EXTENDER = extendArticleFields as (
  doc: ArticleDB,
  userId?: string | null
) => ExtendedPublicArticleFields;

//! ARTWORK
// Fields to remove: user interaction arrays
export type ArtworkFields = keyof Pick<ArtworkDB, "favourited" | "watcherlist">;

export const SENSITIVE_PUBLIC_ARTWORK_FIELDS: readonly ArtworkFields[] = [
  "favourited",
  "watcherlist",
] as const;

export type SensitivePublicArtworkFields =
  (typeof SENSITIVE_PUBLIC_ARTWORK_FIELDS)[number];

export const EXTENDED_PUBLIC_ARTWORK_FIELDS: ExtendedPublicArtworkFields = {
  favouriteCount: 0,
  watchlistCount: 0,
  collectionCount: 0,
  isFavourited: false,
  isWatchlisted: false,
} as const;

export type ExtendedPublicArtworkFields = {
  favouriteCount: number;
  watchlistCount: number;
  collectionCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};

export const ARTWORK_FIELD_EXTENDER = extendArtworkFields as (
  artwork: ArtworkDB,
  userId?: string | null
) => ExtendedPublicArtworkFields;

//! BLOG
// Fields to remove: timestamps
export type BlogFields = keyof Pick<BlogEntryDB, "createdAt" | "updatedAt">;

export const SENSITIVE_PUBLIC_BLOG_FIELDS: readonly BlogFields[] = [
  "createdAt",
  "updatedAt",
] as const;

export type SensitivePublicBlogFields =
  (typeof SENSITIVE_PUBLIC_BLOG_FIELDS)[number];

export const EXTENDED_PUBLIC_BLOG_FIELDS: ExtendedPublicBlogFields = {
  readTime: 0,
  commentCount: 0,
} as const;

export type ExtendedPublicBlogFields = {
  readTime: number;
  commentCount: number;
};

export const BLOG_FIELD_EXTENDER = extendBlogFields as (
  doc: BlogEntryDB,
  userId?: string | null
) => ExtendedPublicBlogFields;

//! COLLECTION
// Fields to remove: timestamps
export type CollectionFields = keyof Pick<
  CollectionDB,
  "createdAt" | "updatedAt"
>;

export const SENSITIVE_PUBLIC_COLLECTION_FIELDS: readonly CollectionFields[] = [
  "createdAt",
  "updatedAt",
] as const;

export type SensitivePublicCollectionFields =
  (typeof SENSITIVE_PUBLIC_COLLECTION_FIELDS)[number];

export const EXTENDED_PUBLIC_COLLECTION_FIELDS: ExtendedPublicCollectionFields =
  {
    artworkCount: 0,
    firstArtworkId: "",
  } as const;

export type ExtendedPublicCollectionFields = {
  artworkCount: number;
  firstArtworkId: string;
};

export const COLLECTION_FIELD_EXTENDER = extendCollectionFields as (
  doc: CollectionDB,
  userId?: string | null
) => ExtendedPublicCollectionFields;

//! COMMENTS
// Fields to remove: none currently
export type CommentFields = keyof Pick<CommentDB, never>;

export const SENSITIVE_PUBLIC_COMMENT_FIELDS: readonly CommentFields[] =
  [] as const;

export type SensitivePublicCommentFields =
  (typeof SENSITIVE_PUBLIC_COMMENT_FIELDS)[number];

export const EXTENDED_PUBLIC_COMMENT_FIELDS: ExtendedPublicCommentFields = {
  isOwner: false,
} as const;

export type ExtendedPublicCommentFields = {
  isOwner: boolean;
};

export const COMMENT_FIELD_EXTENDER = extendCommentFields as (
  doc: CommentDB,
  userId?: string | null
) => ExtendedPublicCommentFields;

//! USER
// Fields to remove: auth credentials
export type UserFields = keyof Pick<UserDB, "password" | "email">;

export const SENSITIVE_PUBLIC_USER_FIELDS: readonly UserFields[] = [
  "password",
  "email",
] as const;

export type SensitivePublicUserFields =
  (typeof SENSITIVE_PUBLIC_USER_FIELDS)[number];

export const EXTENDED_PUBLIC_USER_FIELDS: ExtendedPublicUserFields = {
  isOwner: false,
} as const;

export type ExtendedPublicUserFields = {
  isOwner: boolean;
};

export const USER_FIELD_EXTENDER = extendUserFields as (
  doc: UserDB,
  userId?: string | null
) => ExtendedPublicUserFields;
