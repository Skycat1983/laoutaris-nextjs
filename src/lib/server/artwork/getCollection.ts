import { CollectionModel } from "@/lib/server/models";
import { IFrontendCollection } from "@/lib/client/types/collectionTypes";

export const getCollection = async (slug: string) => {
  console.log("getting article for", slug);
  try {
    const content = await CollectionModel.findOne({
      slug: slug,
    })
      .populate("artworks")
      .lean();
    console.log("content in getCollection", content);

    const data = JSON.parse(JSON.stringify(content));

    if (data) {
      return data as IFrontendCollection;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error :>> ", error);
    return null;
  }
};
