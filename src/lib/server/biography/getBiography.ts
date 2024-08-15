import { ArticleModel } from "@/lib/server/models";
import { IFrontendArticle } from "@/lib/client/types/articleTypes";

export const getBiography = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await ArticleModel.findOne({ slug: slug })
      .populate("author")
      .lean();

    const data = JSON.parse(JSON.stringify(content));
    if (data) {
      return data as IFrontendArticle;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
