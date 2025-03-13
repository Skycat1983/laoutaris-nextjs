//! ARTICLE

import {
  ArticleDB,
  ArtworkDB,
  BlogEntryDB,
  CollectionDB,
  CommentDB,
  UserDB,
} from "../data/models";
import { UserLean } from "../data/types";
import {
  extendArtworkFields,
  extendBlogFields,
  extendCollectionFields,
  extendArticleFields,
  extendCommentFields,
  extendUserFields,
} from "../transforms/transformHelpers";

//! ARTICLE
// all possible article document fields
export type ArticleFields = keyof ArticleDB;

// fields to actually sanitize
export const SENSITIVE_PUBLIC_ARTICLE_FIELDS: readonly ArticleFields[] = [
  "createdAt",
  "updatedAt",
] as const;

// indexable type of sensitive fields
export type SensitivePublicArticleFields =
  (typeof SENSITIVE_PUBLIC_ARTICLE_FIELDS)[number];

// fields to extend
export const EXTENDED_PUBLIC_ARTICLE_FIELDS: ExtendedPublicArticleFields = {
  readTime: 0,
} as const;

// type of extended fields
export type ExtendedPublicArticleFields = {
  readTime: number;
};

// function to extend fields
export const ARTICLE_FIELD_EXTENDER = extendArticleFields as (
  doc: ArticleDB,
  userId?: string | null
) => ExtendedPublicArticleFields;

//! ARTWORK
// all possible artwork document fields
export type ArtworkFields = keyof ArtworkDB;

// fields to actually sanitize
export const SENSITIVE_PUBLIC_ARTWORK_FIELDS: readonly ArtworkFields[] = [
  "favourited",
  "watcherlist",
] as const;

// indexable type of sensitive fields
export type SensitivePublicArtworkFields =
  (typeof SENSITIVE_PUBLIC_ARTWORK_FIELDS)[number];

// fields to extend
export const EXTENDED_PUBLIC_ARTWORK_FIELDS: ExtendedPublicArtworkFields = {
  favouriteCount: 0,
  watchlistCount: 0,
  isFavourited: false,
  isWatchlisted: false,
} as const;

// type of extended fields
export type ExtendedPublicArtworkFields = {
  favouriteCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};

// function to extend fields
export const ARTWORK_FIELD_EXTENDER = extendArtworkFields as (
  artwork: ArtworkDB,
  userId?: string | null
) => ExtendedPublicArtworkFields;

//! BLOG
// all possible blog document fields
export type BlogFields = keyof BlogEntryDB;

// fields to actually sanitize
export const SENSITIVE_PUBLIC_BLOG_FIELDS: readonly BlogFields[] = [
  "createdAt",
  "updatedAt",
] as const;

// indexable type of sensitive fields
export type SensitivePublicBlogFields =
  (typeof SENSITIVE_PUBLIC_BLOG_FIELDS)[number];

// fields to extend
export const EXTENDED_PUBLIC_BLOG_FIELDS: ExtendedPublicBlogFields = {
  readTime: 0,
  commentCount: 0,
} as const;

// type of extended fields
export type ExtendedPublicBlogFields = {
  readTime: number;
  commentCount: number;
};

// function to extend fields
export const BLOG_FIELD_EXTENDER = extendBlogFields as (
  doc: BlogEntryDB,
  userId?: string | null
) => ExtendedPublicBlogFields;

//! COLLECTION
// all possible collection document fields
export type CollectionFields = keyof CollectionDB;

// fields to actually sanitize
export const SENSITIVE_PUBLIC_COLLECTION_FIELDS: readonly CollectionFields[] = [
  "createdAt",
  "updatedAt",
] as const;

// indexable type of sensitive fields
export type SensitivePublicCollectionFields =
  (typeof SENSITIVE_PUBLIC_COLLECTION_FIELDS)[number];

// fields to extend
export const EXTENDED_PUBLIC_COLLECTION_FIELDS: ExtendedPublicCollectionFields =
  {
    artworkCount: 0,
    firstArtworkId: "",
  } as const;

// type of extended fields
export type ExtendedPublicCollectionFields = {
  artworkCount: number;
  firstArtworkId: string;
};

// function to extend fields
export const COLLECTION_FIELD_EXTENDER = extendCollectionFields as (
  doc: CollectionDB,
  userId?: string | null
) => ExtendedPublicCollectionFields;

//! COMMENTS
// all possible comment document fields
export type CommentFields = keyof CommentDB;

// fields to actually sanitize
export const SENSITIVE_PUBLIC_COMMENT_FIELDS: readonly CommentFields[] =
  [] as const;

// indexable type of sensitive fields
export type SensitivePublicCommentFields =
  (typeof SENSITIVE_PUBLIC_COMMENT_FIELDS)[number];

// fields to extend
export const EXTENDED_PUBLIC_COMMENT_FIELDS: ExtendedPublicCommentFields = {
  isOwner: false,
} as const;

// type of extended fields
export type ExtendedPublicCommentFields = {
  isOwner: boolean;
};

// function to extend fields
export const COMMENT_FIELD_EXTENDER = extendCommentFields as (
  doc: CommentDB,
  userId?: string | null
) => ExtendedPublicCommentFields;

//! USER
// all possible user document fields
export type UserFields = keyof UserDB;

// fields to actually sanitize
export const SENSITIVE_PUBLIC_USER_FIELDS: readonly UserFields[] = [
  "password",
  "email",
] as const;

// indexable type of sensitive fields
export type SensitivePublicUserFields =
  (typeof SENSITIVE_PUBLIC_USER_FIELDS)[number];

// fields to extend
export const EXTENDED_PUBLIC_USER_FIELDS: ExtendedPublicUserFields = {
  isOwner: false,
} as const;

// type of extended fields
export type ExtendedPublicUserFields = {
  isOwner: boolean;
};

// function to extend fields
export const USER_FIELD_EXTENDER = extendUserFields as (
  doc: UserDB,
  userId?: string | null
) => ExtendedPublicUserFields;
