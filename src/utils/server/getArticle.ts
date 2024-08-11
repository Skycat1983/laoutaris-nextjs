import { ArticleModel } from "@/app/models/content";

export const getArticle = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await ArticleModel.findOne({ slug: slug });
    return content;
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
