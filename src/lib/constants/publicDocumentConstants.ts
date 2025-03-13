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

// Sensitive data
export type SensitivePublicArticleFields =
  (typeof SENSITIVE_PUBLIC_ARTICLE_FIELDS)[number];
export const SENSITIVE_PUBLIC_ARTICLE_FIELDS = [
  "createdAt",
  "updatedAt",
] as const;

export type ExtendedPublicArticleFields = {
  readTime: number;
};

export const EXTENDED_PUBLIC_ARTICLE_FIELDS: ExtendedPublicArticleFields = {
  readTime: 0,
} as const;

export const ARTICLE_FIELD_EXTENDER = extendArticleFields as (
  doc: ArticleDB,
  userId?: string | null
) => ExtendedPublicArticleFields;

//! ARTWORK
// Sensitive data
export type SensitivePublicArtworkFields =
  (typeof SENSITIVE_PUBLIC_ARTWORK_FIELDS)[number];
export const SENSITIVE_PUBLIC_ARTWORK_FIELDS = [
  "favourited",
  "watcherlist",
] as const;
// Additional fields
export const EXTENDED_PUBLIC_ARTWORK_FIELDS: ExtendedPublicArtworkFields = {
  favouriteCount: 0,
  watchlistCount: 0,
  isFavourited: false,
  isWatchlisted: false,
} as const;
export type ExtendedPublicArtworkFields = {
  favouriteCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};
export const ARTWORK_FIELD_EXTENDER = extendArtworkFields as (
  artwork: ArtworkDB,
  userId?: string | null
) => ExtendedPublicArtworkFields;
// export type ExtendedPublicArtworkFields = typeof EXTENDED_PUBLIC_ARTWORK_FIELDS;

//! BLOG
// Sensitive data
export type SensitivePublicBlogFields =
  (typeof SENSITIVE_PUBLIC_BLOG_FIELDS)[number];
export const SENSITIVE_PUBLIC_BLOG_FIELDS = ["createdAt", "updatedAt"] as const;
// Additional fields
export const EXTENDED_PUBLIC_BLOG_FIELDS: ExtendedPublicBlogFields = {
  readTime: 0,
  commentCount: 0,
} as const;
// export type ExtendedPublicBlogFields = typeof EXTENDED_PUBLIC_BLOG_FIELDS;
export type ExtendedPublicBlogFields = {
  readTime: number;
  commentCount: number;
};
export const BLOG_FIELD_EXTENDER = extendBlogFields as (
  doc: BlogEntryDB,
  userId?: string | null
) => ExtendedPublicBlogFields;

//! COLLECTION
// Sensitive data
export type SensitivePublicCollectionFields =
  (typeof SENSITIVE_PUBLIC_COLLECTION_FIELDS)[number];
export const SENSITIVE_PUBLIC_COLLECTION_FIELDS = [
  "createdAt",
  "updatedAt",
] as const;
// Additional fields
export const EXTENDED_PUBLIC_COLLECTION_FIELDS: ExtendedPublicCollectionFields =
  {
    artworkCount: 0,
    firstArtworkId: "",
  } as const;
// export type ExtendedPublicCollectionFields =
//   typeof EXTENDED_PUBLIC_COLLECTION_FIELDS;
export type ExtendedPublicCollectionFields = {
  artworkCount: number;
  firstArtworkId: string;
};
export const COLLECTION_FIELD_EXTENDER = extendCollectionFields as (
  doc: CollectionDB,
  userId?: string | null
) => ExtendedPublicCollectionFields;

//! COMMENTS
// Sensitive data
export type SensitivePublicCommentFields =
  (typeof SENSITIVE_PUBLIC_COMMENT_FIELDS)[number];
export const SENSITIVE_PUBLIC_COMMENT_FIELDS = [] as const;
// Additional fields
export const EXTENDED_PUBLIC_COMMENT_FIELDS: ExtendedPublicCommentFields = {
  isOwner: false,
} as const;
// export type ExtendedPublicCommentFields = typeof EXTENDED_PUBLIC_COMMENT_FIELDS;
export type ExtendedPublicCommentFields = {
  isOwner: boolean;
};
export const COMMENT_FIELD_EXTENDER = extendCommentFields as (
  doc: CommentDB,
  userId?: string | null
) => ExtendedPublicCommentFields;

//! SUBSCRIBER
// Sensitive data
export type SensitivePublicSubscriberFields =
  (typeof SENSITIVE_PUBLIC_SUBSCRIBER_FIELDS)[number];
export const SENSITIVE_PUBLIC_SUBSCRIBER_FIELDS = [] as const;

type AvailableKeys<T> = keyof T;

//! USER
// Sensitive data
export type SensitivePublicUserFields =
  (typeof SENSITIVE_PUBLIC_USER_FIELDS)[number];
type PublicUserFields = AvailableKeys<UserLean>;
// export type SensitivePublicUserFields = Partial<keyof UserLean>;
export const SENSITIVE_PUBLIC_USER_FIELDS: PublicUserFields = [
  "password",
  "email",
] as const;
// Additional fields
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
