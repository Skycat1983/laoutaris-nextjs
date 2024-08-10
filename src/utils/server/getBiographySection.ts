import { ArticleModel } from "@/app/models/experimental/article";
import { ArticleContentModel } from "@/app/models/stable/articleModel";

export const getBiographySection = async (section: string) => {
  console.log("getting section content for", section);
  try {
    const content = await ArticleContentModel.find({ section: section });
    return content;
  } catch (error) {
    console.log("error :>> ", error);

    return null;
  }
};
