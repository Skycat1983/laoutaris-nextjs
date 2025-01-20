import { getCollectionSubNavData } from "./getCollectionSubnavData";

export const getCollectionSlugDefaultExtensionPath = async (
  slug: string
): Promise<string> => {
  const subNavData = await getCollectionSubNavData();

  if (!subNavData || subNavData.length === 0) {
    throw new Error("No collection data is available at the moment.");
  }

  const collection = subNavData.find((collection) => collection.slug === slug);

  console.log("collection in getCollectionSlugDefaultPath", collection);

  if (!collection) {
    throw new Error("No collection data is available at the moment.");
  }

  return collection.link_to;
};
