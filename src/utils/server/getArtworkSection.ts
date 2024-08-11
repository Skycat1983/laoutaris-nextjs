import { CollectionModel } from "@/app/models/content";

export const getArtworkSection = async (section: string) => {
  console.log("getting section content for", section);
  try {
    // Use find to get all matching documents
    const content = await CollectionModel.find({ section: section });
    // console.log("CONTENT in get artwork section", content);
    return content; // This should return an array of documents
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
