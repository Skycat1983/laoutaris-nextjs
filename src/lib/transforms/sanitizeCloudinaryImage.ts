import { CloudinaryImageDB, CloudinaryImageFrontend } from "../data/types";

export function sanitizeCloudinaryImage(
  image: CloudinaryImageDB
): CloudinaryImageFrontend {
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
