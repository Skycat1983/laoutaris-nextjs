import {
  ArticleContentModel,
  IArticleContent,
} from "@/app/models/stable/articleModel";

export const getDefaultBiography = async (section: string) => {
  console.log("getting first section item for", section);
  try {
    const content = (await ArticleContentModel.findOne({ section: "biography" })
      .select("slug")
      .lean()) as IArticleContent;
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
