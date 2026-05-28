import { CollectionPrototypeSection } from "@/components/prototypes/home/CollectionPrototypeSection";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "CollectionsSectionLoader",
  operation: "public.collections_section.loader",
  surface: "server_loader",
});

const renderCollectionsFallback = () => (
  <CollectionPrototypeSection collections={[]} useAlternateBackground={false} />
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
      return renderCollectionsFallback();
    }

    return (
      <CollectionPrototypeSection
        collections={result.data}
        useAlternateBackground={false}
      />
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.collections_section.failed", { error });
    return renderCollectionsFallback();
  }
}
