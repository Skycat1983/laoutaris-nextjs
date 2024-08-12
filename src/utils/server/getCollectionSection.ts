import { CollectionModel } from "@/app/models/content";

export const getCollectionSection = async (section: string) => {
  console.log("getting section content for", section);
  try {
    const content = await CollectionModel.find({ section: section });
    return content;
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
