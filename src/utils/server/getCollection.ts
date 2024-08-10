import { CollectionContentModel } from "@/app/models/stable/collectionModel";

export const getCollection = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await CollectionContentModel.findOne({
      slug: slug,
    }).populate("artworks");
    return content;
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
