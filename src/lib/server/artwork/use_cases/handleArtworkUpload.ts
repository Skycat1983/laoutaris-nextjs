import {
  ArtworkImage,
  FrontendArtworkUnpopulated,
} from "@/lib/types/artworkTypes";
import { postArtwork } from "../../admin/data-fetching/postArtwork";
import { CloudinaryUploadInfo } from "@/lib/types/cloudinaryTypes";

interface ArtworkUploadParams {
  cloudinaryInfo: ArtworkImage;
  formData: {
    title: string;
    decade: string;
    artstyle: string;
    medium: string;
    surface: string;
    featured: boolean;
  };
}

export async function handleArtworkUpload({
  cloudinaryInfo,
  formData,
}: ArtworkUploadParams) {
  const artworkData = {
    title: formData.title,
    decade: formData.decade,
    artstyle: formData.artstyle,
    medium: formData.medium,
    surface: formData.surface,
    featured: formData.featured,
  };

  // Combine image details with artwork data
  const completeArtworkData: Omit<FrontendArtworkUnpopulated, "_id"> = {
    ...artworkData,
    image: cloudinaryInfo,
    watcherlist: [],
    favourited: [],
  };

  // Send to API via data fetching function
  return await postArtwork({ artworkData: completeArtworkData });
}

// cloudinaryResponseToArtworkImageData;
// Dummy data for testing
// const dummyArtworkData: Omit<
//   FrontendArtworkUnpopulated,
//   "_id" | "image" | "watcherlist" | "favourited"
// > = {
//   title: "Test Artwork",
//   decade: "2020s", // String value from enum
//   artstyle: "abstract",
//   medium: "oil",
//   surface: "canvas",
//   featured: false,
// };
