import { IFrontendArtwork } from "@/lib/client/types/artworkTypes";
import { CollectionModel } from "@/lib/server/models";

interface IFrontendCollection {
  title: string;
  subtitle: string;
  summary: string;
  text: string;
  author: string;
  imageUrl: string;
  slug: string;
  section: "artwork" | "biography" | "project";
  artworks: IFrontendArtwork[];
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  const slug = request.url.split("/").pop();
  try {
    const content = await CollectionModel.findOne({
      slug: slug,
    })
      .populate("artworks")
      .lean();
    // console.log("content in getCollection", content);

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
}
