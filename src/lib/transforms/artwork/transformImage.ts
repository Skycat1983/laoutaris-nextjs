import {
  CloudinaryImageDB,
  CloudinaryImageFrontend,
  CloudinaryImageSanitized,
} from "../../data/types";

export function sanitizeCloudinaryImage(
  image: CloudinaryImageDB
): CloudinaryImageSanitized {
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

export function transformImage(
  image: CloudinaryImageDB
): CloudinaryImageFrontend {
  return sanitizeCloudinaryImage(image);
}
