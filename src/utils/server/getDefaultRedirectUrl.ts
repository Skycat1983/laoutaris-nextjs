import { ContentModel, IContent } from "@/app/model/content";

export const getDefaultRedirect = async (section: string) => {
  console.log("getting first section item for", section);
  try {
    // Find the first matching document and project only the fields we need
    const content: IContent | null = await ContentModel.findOne({ section })
      .select("slug")
      .lean();

    // Check if content and slug exist
    if (content && content.slug) {
      return {
        url: `/${section}/${content.slug}`,
      };
    }

    return null; // Return null if no matching content or slug is found
  } catch (error) {
    console.log("error :>> ", error);
    return null; // Return null in case of an error
  }
};
