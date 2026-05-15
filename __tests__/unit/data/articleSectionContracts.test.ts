import { ARTICLE_SECTION_OPTIONS } from "@/lib/constants/articleConstants";
import { ARTICLE_FILTER_OPTIONS } from "@/components/features/adminDashboard/inputs/ArticleFilterDropdowns";
import {
  createArticleSchema,
  updateArticleRouteBodySchema,
} from "@/lib/data/schemas/articleSchema";

const artworkId = "507f1f77bcf86cd799439013";

const validCreatePayload = {
  title: "Studio Notes",
  subtitle: "On colour and form",
  summary: "A focused article summary.",
  text: "This article text is long enough to satisfy the route validation boundary.",
  imageUrl: "https://example.com/article.jpg",
  section: "artwork",
  overlayColour: "white",
  artwork: artworkId,
};

describe("article section contracts", () => {
  it("rejects collections in create article schema input", () => {
    const result = createArticleSchema.safeParse({
      ...validCreatePayload,
      section: "collections",
    });

    expect(result.success).toBe(false);
  });

  it("rejects collections in update article route schema input", () => {
    const result = updateArticleRouteBodySchema.safeParse({
      section: "collections",
    });

    expect(result.success).toBe(false);
  });

  it("derives admin article filter section options from shared article constants", () => {
    expect(ARTICLE_FILTER_OPTIONS.section).toEqual(ARTICLE_SECTION_OPTIONS);
    expect(ARTICLE_FILTER_OPTIONS.section).not.toContain("collections");
  });
});
