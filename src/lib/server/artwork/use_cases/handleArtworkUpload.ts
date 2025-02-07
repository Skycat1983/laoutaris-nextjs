import { ArtworkImage } from "@/lib/types/artworkTypes";
import { DBArtwork, BaseArtwork } from "@/lib/server/models/artworkModel";
import { postArtwork } from "../../admin/data-fetching/postArtwork";

interface ArtworkUploadParams {
  cloudinaryInfo: ArtworkImage;
  formData: {
    title: string;
    decade: DBArtwork["decade"];
    artstyle: DBArtwork["artstyle"];
    medium: DBArtwork["medium"];
    surface: DBArtwork["surface"];
    featured: boolean;
  };
}

export async function handleArtworkUpload({
  cloudinaryInfo,
  formData,
}: ArtworkUploadParams) {
  const completeArtworkData: Omit<
    BaseArtwork,
    "collections" | "watcherlist" | "favourited"
  > = {
    title: formData.title,
    decade: formData.decade,
    artstyle: formData.artstyle,
    medium: formData.medium,
    surface: formData.surface,
    featured: formData.featured,
    image: cloudinaryInfo,
  };

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
