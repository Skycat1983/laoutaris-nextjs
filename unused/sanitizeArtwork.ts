import { Merge, ArtworkLean, ArtworkExtended } from "@/lib/data/types";
import { DBImage } from "@/lib/data/models";
import { CloudinaryImageFrontend } from "@/lib/data/types";

export function sanitizeImage(image: DBImage): CloudinaryImageFrontend {
  return {
    secure_url: image.secure_url,
    bytes: image.bytes,
    pixelHeight: image.pixelHeight,
    pixelWidth: image.pixelWidth,
    format: image.format,
    hexColors: image.hexColors,
    predominantColors: image.predominantColors,
  };
}

type PublicArtworkOverride = {
  image: CloudinaryImageFrontend;
  favouriteCount: number;
  watchlistCount: number;
  isFavourited: boolean;
  isWatchlisted: boolean;
};

export type SanitizedArtwork = Merge<ArtworkLean, PublicArtworkOverride>;

export const sanitizeArtwork = (
  artwork: ArtworkExtended,
  userId?: string | null
): SanitizedArtwork => {
  return {
    ...artwork,
    image: sanitizeImage(artwork.image),
    // favouriteCount: artwork.favourited.length,
    // watchlistCount: artwork.watcherlist.length,
    // isFavourited: userId ? artwork.favourited.includes(userId) : false,
    // isWatchlisted: userId ? artwork.watcherlist.includes(userId) : false,
  };
};

// export type PublicArtwork = Omit<
//   ArtworkLean,
//   "watcherlist" | "favourited" | "image"
// > & {
//   image: PublicArtworkImage;
//   favouritedCount: number;
//   watchlistCount: number;
//   isFavourited: boolean;
//   isWatchlisted: boolean;
// };

// export const sanitizeArtwork = (
//   artwork: ArtworkLean,
//   userId?: string | null
// ): PublicArtwork => {
//   const isFavourited = userId ? artwork.favourited.includes(userId) : false;
//   const isWatchlisted = userId ? artwork.watcherlist.includes(userId) : false;

//   const sanitizedImage: PublicArtworkImage = sanitizeImage(artwork.image);

//   // const { public_id, ...sanitizedImage } = artwork.image;

//   return {
//     _id: artwork._id,
//     image: artwork.image satisfies PublicArtworkImage,
//     // image: sanitizedImage,
//     title: artwork.title,
//     decade: artwork.decade,
//     artstyle: artwork.artstyle,
//     medium: artwork.medium,
//     surface: artwork.surface,
//     featured: artwork.featured,
//     createdAt: artwork.createdAt,
//     updatedAt: artwork.updatedAt,
//     collections: artwork.collections,
//     favouritedCount: artwork.favourited.length,
//     watchlistCount: artwork.watcherlist.length,
//     isFavourited,
//     isWatchlisted,
//   } satisfies PublicArtwork;
// };
