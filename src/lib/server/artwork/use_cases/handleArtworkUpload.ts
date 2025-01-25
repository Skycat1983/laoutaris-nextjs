import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { cloudinaryResponseToArtworkImageData } from "../resolvers/cloudinaryResponseToArtworkImageData";
import { FrontendArtworkUnpopulated } from "@/lib/types/artworkTypes";
import { postArtwork } from "../../admin/data-fetching/postArtwork";

export async function handleArtworkUpload(
  result: CloudinaryUploadWidgetResults
) {
  if (!result.info || typeof result.info !== "object") {
    throw new Error("Invalid upload result");
  }

  // Transform Cloudinary response
  const imageDetails = cloudinaryResponseToArtworkImageData(result.info);

  // Dummy data for testing
  const dummyArtworkData: Omit<
    FrontendArtworkUnpopulated,
    "_id" | "image" | "watcherlist" | "favourited"
  > = {
    title: "Test Artwork",
    decade: "2020s", // String value from enum
    artstyle: "abstract",
    medium: "oil",
    surface: "canvas",
    featured: false,
  };

  // Combine image details with artwork data
  const completeArtworkData: Omit<FrontendArtworkUnpopulated, "_id"> = {
    ...dummyArtworkData,
    image: imageDetails,
    watcherlist: [], // These will be handled by MongoDB defaults
    favourited: [], // These will be handled by MongoDB defaults
  };

  // Send to API via data fetching function
  return await postArtwork({ artworkData: completeArtworkData });
}

// cloudinaryResponseToArtworkImageData;
