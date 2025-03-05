import { ArtworkImage, PublicArtworkImage } from "../data/types";

export function sanitizeImage(image: ArtworkImage): PublicArtworkImage {
  const { public_id, ...sanitizedImage } = image;
  return sanitizedImage;
}
