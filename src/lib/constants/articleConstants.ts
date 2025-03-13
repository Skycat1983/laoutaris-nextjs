// Article Fields
const ARTICLE_SECTION_OPTIONS = ["artwork", "biography", "project"] as const;
type ArticleSection = (typeof ARTICLE_SECTION_OPTIONS)[number];

const ARTICLE_OVERLAY_COLOUR_OPTIONS = ["white", "black"] as const;
type ArticleOverlayColour = (typeof ARTICLE_OVERLAY_COLOUR_OPTIONS)[number];

export type { ArticleSection, ArticleOverlayColour };
export { ARTICLE_SECTION_OPTIONS, ARTICLE_OVERLAY_COLOUR_OPTIONS };
