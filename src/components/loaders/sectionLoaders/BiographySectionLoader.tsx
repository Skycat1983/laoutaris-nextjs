import { BiographyPrototypeSection } from "@/components/prototypes/home/BiographyPrototypeSection";
import { getArticleList } from "@/lib/data/services/getArticleList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "BiographySectionLoader",
  operation: "public.biography_section.loader",
  surface: "server_loader",
});

const renderBiographyFallback = () => (
  <BiographyPrototypeSection articles={[]} />
);

export async function BiographySectionLoader() {
  try {
    const result = await getArticleList({
      section: "biography",
      fields: "title subtitle imageUrl slug",
      limit: 5,
    });

    if (!result) {
      throw new Error("No articles found");
    }

    if (result.data.length === 0) {
      return renderBiographyFallback();
    }

    return <BiographyPrototypeSection articles={result.data} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.biography_section.failed", { error });
    return renderBiographyFallback();
  }
}

// Config Constants
// const BIOGRAPHY_FETCH_CONFIG = {
//   section: "biography",
//   fields: ["title", "subtitle", "slug", "imageUrl"] as const,
// } as const;

// // Type Definitions
// export type BiographyCardData = Pick<
//   FrontendArticle,
//   "title" | "subtitle" | "imageUrl" | "slug"
// >;
