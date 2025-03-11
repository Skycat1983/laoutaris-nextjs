//! ARTICLE
// Sensitive data
export type SensitivePublicArticleFields =
  (typeof SENSITIVE_PUBLIC_ARTICLE_FIELDS)[number];
export const SENSITIVE_PUBLIC_ARTICLE_FIELDS = [
  "createdAt",
  "updatedAt",
] as const;
// Additional fields
export const EXTENDED_PUBLIC_ARTICLE_FIELDS = {
  readTime: { type: "number", default: 0 },
} as const;
export type ExtendedPublicArticleFields = typeof EXTENDED_PUBLIC_ARTICLE_FIELDS;

// export const ARTICLE_FIELDS_PUBLIC = {
//   SENSITIVE: SENSITIVE_PUBLIC_ARTICLE_FIELDS,
//   EXTENDED: EXTENDED_PUBLIC_ARTICLE_FIELDS,
// } as const;
// export type ArticleFieldsPublic = typeof ARTICLE_FIELDS_PUBLIC;

//! ARTWORK
// Sensitive data
export type SensitivePublicArtworkFields =
  typeof SENSITIVE_PUBLIC_ARTWORK_FIELDS;
export const SENSITIVE_PUBLIC_ARTWORK_FIELDS = [
  "favourited",
  "watcherlist",
] as const;
// Additional fields
export const EXTENDED_PUBLIC_ARTWORK_FIELDS = {
  favouriteCount: { type: "number", default: 0 },
  watchlistCount: { type: "number", default: 0 },
  isFavourited: { type: "boolean", default: false },
  isWatchlisted: { type: "boolean", default: false },
} as const;
export type ExtendedPublicArtworkFields = typeof EXTENDED_PUBLIC_ARTWORK_FIELDS;

//! BLOG
// Sensitive data
export type SensitivePublicBlogFields = typeof SENSITIVE_PUBLIC_BLOG_FIELDS;
export const SENSITIVE_PUBLIC_BLOG_FIELDS = ["createdAt", "updatedAt"] as const;
// Additional fields
export const EXTENDED_PUBLIC_BLOG_FIELDS = {
  readTime: { type: "number", default: 0 },
  commentCount: { type: "number", default: 0 },
} as const;
export type ExtendedPublicBlogFields = typeof EXTENDED_PUBLIC_BLOG_FIELDS;

//! COLLECTION
// Sensitive data
export type SensitivePublicCollectionFields =
  typeof SENSITIVE_PUBLIC_COLLECTION_FIELDS;
export const SENSITIVE_PUBLIC_COLLECTION_FIELDS = [
  "createdAt",
  "updatedAt",
] as const;
// Additional fields
export const EXTENDED_PUBLIC_COLLECTION_FIELDS = {
  artworkCount: { type: "number", default: 0 },
} as const;
type ExtendedPublicCollectionFields = typeof EXTENDED_PUBLIC_COLLECTION_FIELDS;

//! COMMENTS
// Sensitive data
export type SensitivePublicCommentFields =
  typeof SENSITIVE_PUBLIC_COMMENT_FIELDS;
export const SENSITIVE_PUBLIC_COMMENT_FIELDS = [] as const;
// Additional fields
export const EXTENDED_PUBLIC_COMMENT_FIELDS = {
  isOwner: { type: "boolean", default: false },
} as const;
type ExtendedPublicCommentFields = typeof EXTENDED_PUBLIC_COMMENT_FIELDS;

//! SUBSCRIBER
// Sensitive data
export type SensitivePublicSubscriberFields =
  typeof SENSITIVE_PUBLIC_SUBSCRIBER_FIELDS;
export const SENSITIVE_PUBLIC_SUBSCRIBER_FIELDS = [] as const;

//! USER
// Sensitive data
export type SensitivePublicUserFields = typeof SENSITIVE_PUBLIC_USER_FIELDS;
export const SENSITIVE_PUBLIC_USER_FIELDS = ["password", "email"] as const;
// Additional fields
export const EXTENDED_PUBLIC_USER_FIELDS = {
  isOwner: { type: "boolean", default: false },
} as const;
export type ExtendedPublicUserFields = typeof EXTENDED_PUBLIC_USER_FIELDS;
