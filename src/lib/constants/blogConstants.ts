const BLOG_TAGS = [
  "project",
  "family",
  "artwork",
  "news",
  "events",
  "exhibitions",
  "artists",
] as const;
type BlogTag = (typeof BLOG_TAGS)[number];

export type { BlogTag };
export { BLOG_TAGS };
