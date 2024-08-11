import { CollectionModel } from "@/app/models/content";

export const getCollection = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await CollectionModel.findOne({
      slug: slug,
    });
    // .populate("artworks"); // Corrected to match the schema field name
    return content;
  } catch (error) {
    console.log("error :>> ", error);
    // return null;
    return { error: error }; // <-- Return the error message
  }
};
