export const COLLECTION_SECTIONS = [
  "artwork",
  "biography",
  "project",
  "collections",
] as const;
export type CollectionSection = (typeof COLLECTION_SECTIONS)[number];

export const COLLECTION_TYPES = ["public", "private"] as const;
export type CollectionType = (typeof COLLECTION_TYPES)[number];
