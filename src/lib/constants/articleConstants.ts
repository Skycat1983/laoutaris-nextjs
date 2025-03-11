export const ARTICLE_SECTION_OPTIONS = [
  "artwork",
  "biography",
  "project",
] as const;
export type ArticleSection = (typeof ARTICLE_SECTION_OPTIONS)[number];

export const ARTICLE_OVERLAY_COLOUR_OPTIONS = ["white", "black"] as const;
export type ArticleOverlayColour =
  (typeof ARTICLE_OVERLAY_COLOUR_OPTIONS)[number];
