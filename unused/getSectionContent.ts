import { ContentModel } from "./experimental/baseContent";

export const getSectionContent = async (section: string) => {
  console.log("getting section content for", section);
  try {
    const content = await ContentModel.find({ section: section });
    return content;
  } catch (error) {
    console.log("error :>> ", error);
  }
};
