import { CollectionSection } from "@/components/sections/CollectionSection";
import { HomeSectionFallback } from "@/components/sections/HomeSectionFallback";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "CollectionsSectionLoader",
  operation: "public.collections_section.loader",
  surface: "server_loader",
});

const collectionsFallbackConfig = {
  heading: "Collections:",
  subheading: "Curated by the family",
  buttonLabel: "See more",
  buttonLink: "/collections",
} as const;

const renderCollectionsUnavailableFallback = () => (
  <HomeSectionFallback
    {...collectionsFallbackConfig}
    title="Collections are temporarily unavailable"
    message="This section could not be loaded right now. You can still visit the collections archive directly."
    testId="collections-section-unavailable"
  />
);

const renderCollectionsEmptyFallback = () => (
  <HomeSectionFallback
    {...collectionsFallbackConfig}
    title="No collections are available yet"
    message="Curated collections will appear here once they are published."
    testId="collections-section-empty"
  />
);

// Loader Function
export async function CollectionsSectionLoader() {
  try {
    const result = await getCollectionList({
      section: "collections",
      limit: 9,
    });

    if (!result) {
      throw new Error("No collections found");
    }

    if (result.data.length === 0) {
      return renderCollectionsEmptyFallback();
    }

    return <CollectionSection collections={result.data} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.collections_section.failed", { error });
    return renderCollectionsUnavailableFallback();
  }
}
