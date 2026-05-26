import { BiographySection } from "@/components/sections/BiographySection";
import { HomeSectionFallback } from "@/components/sections/HomeSectionFallback";
import { getArticleList } from "@/lib/data/services/getArticleList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "BiographySectionLoader",
  operation: "public.biography_section.loader",
  surface: "server_loader",
});

const biographyFallbackConfig = {
  heading: "Biography:",
  subheading: "Read my grandfather's story",
  buttonLabel: "Read more",
  buttonLink: "/biography",
} as const;

const renderBiographyUnavailableFallback = () => (
  <HomeSectionFallback
    {...biographyFallbackConfig}
    title="Biography is temporarily unavailable"
    message="This section could not be loaded right now. The full biography archive remains available from the biography page."
    testId="biography-section-unavailable"
  />
);

const renderBiographyEmptyFallback = () => (
  <HomeSectionFallback
    {...biographyFallbackConfig}
    title="No biography entries are available yet"
    message="Biography articles will appear here once they are published."
    testId="biography-section-empty"
  />
);

export async function BiographySectionLoader() {
  try {
    const result = await getArticleList({
      section: "biography",
    });

    if (!result) {
      throw new Error("No articles found");
    }

    if (result.data.length === 0) {
      return renderBiographyEmptyFallback();
    }

    return <BiographySection articles={result.data} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.biography_section.failed", { error });
    return renderBiographyUnavailableFallback();
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
