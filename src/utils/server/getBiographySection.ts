import { ArticleModel } from "@/app/models/content";

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
