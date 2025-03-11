//! ARTICLE
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

//! COLLECTION
// Sensitive data
export type SensitivePublicCollectionFields =
  (typeof SENSITIVE_PUBLIC_COLLECTION_FIELDS)[number];
export const SENSITIVE_PUBLIC_COLLECTION_FIELDS = [
  "createdAt",
  "updatedAt",
] as const;
// Additional fields
export const EXTENDED_PUBLIC_COLLECTION_FIELDS: ExtendedCollectionFields = {
  artworkCount: 0,
  firstArtworkId: "",
} as const;
// export type ExtendedPublicCollectionFields =
//   typeof EXTENDED_PUBLIC_COLLECTION_FIELDS;
export type ExtendedCollectionFields = {
  artworkCount: number;
  firstArtworkId: string;
};

//! COMMENTS
// Sensitive data
export type SensitivePublicCommentFields =
  (typeof SENSITIVE_PUBLIC_COMMENT_FIELDS)[number];
export const SENSITIVE_PUBLIC_COMMENT_FIELDS = [] as const;
// Additional fields
export const EXTENDED_PUBLIC_COMMENT_FIELDS: ExtendedCommentFields = {
  isOwner: false,
} as const;
// export type ExtendedPublicCommentFields = typeof EXTENDED_PUBLIC_COMMENT_FIELDS;
export type ExtendedCommentFields = {
  isOwner: boolean;
};

//! SUBSCRIBER
// Sensitive data
export type SensitivePublicSubscriberFields =
  (typeof SENSITIVE_PUBLIC_SUBSCRIBER_FIELDS)[number];
export const SENSITIVE_PUBLIC_SUBSCRIBER_FIELDS = [] as const;

//! USER
// Sensitive data
export type SensitivePublicUserFields =
  (typeof SENSITIVE_PUBLIC_USER_FIELDS)[number];
export const SENSITIVE_PUBLIC_USER_FIELDS = ["password", "email"] as const;
// Additional fields
export const EXTENDED_PUBLIC_USER_FIELDS: ExtendedUserFields = {
  isOwner: false,
} as const;
export type ExtendedUserFields = {
  isOwner: boolean;
};
