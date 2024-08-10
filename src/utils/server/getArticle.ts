import { ArticleContentModel } from "@/app/models/stable/articleModel";

export const getArticle = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await ArticleContentModel.findOne({ slug: slug });
    return content;
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
