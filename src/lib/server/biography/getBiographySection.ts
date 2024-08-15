import { ArticleModel } from "@/lib/server/models";

export const getBiographySection = async (section: string) => {
  console.log("getting section content for", section);
  try {
    const content = await ArticleModel.find({ section: section });
    return content;
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
