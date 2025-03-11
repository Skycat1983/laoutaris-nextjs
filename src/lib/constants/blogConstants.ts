export const BLOG_TAGS = [
  "project",
  "family",
  "artwork",
  "news",
  "events",
  "exhibitions",
  "artists",
] as const;
export type BlogTag = (typeof BLOG_TAGS)[number];
