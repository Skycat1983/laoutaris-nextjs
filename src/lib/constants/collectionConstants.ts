const COLLECTION_SECTIONS = [
  "artwork",
  "biography",
  "project",
  "collections",
] as const;
type CollectionSection = (typeof COLLECTION_SECTIONS)[number];

const COLLECTION_TYPES = ["public", "private"] as const;
type CollectionType = (typeof COLLECTION_TYPES)[number];

export type { CollectionSection, CollectionType };
export { COLLECTION_SECTIONS, COLLECTION_TYPES };
