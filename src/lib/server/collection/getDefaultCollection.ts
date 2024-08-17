import { CollectionModel, ICollectionContent } from "@/lib/server/models";

export const getDefaultCollection = async (section: string) => {
  // console.log("getting first section item for", section);
  try {
    const content = (await CollectionModel.findOne({
      section: "artwork",
    })
      .select("slug")
      .lean()) as ICollectionContent;
    // Check if content and slug exist
    if (content && content.slug) {
      // <-- Now you can safely access `content.slug`
      return {
        url: `/${section}/${content.slug}`,
      };
    }

    return null;
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
