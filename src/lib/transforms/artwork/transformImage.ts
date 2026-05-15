import {
  CloudinaryImageFrontend,
  CloudinaryImageSanitizable,
  CloudinaryImageSanitized,
} from "../../data/types";

export function sanitizeCloudinaryImage(
  image: CloudinaryImageSanitizable
): CloudinaryImageFrontend {
  const sanitized: CloudinaryImageSanitized = {
    secure_url: image.secure_url,
    bytes: image.bytes,
    pixelHeight: image.pixelHeight,
    pixelWidth: image.pixelWidth,
    format: image.format,
    hexColors: image.hexColors,
    predominantColors: image.predominantColors,
  };

  if (typeof image.similarityScore === "number") {
    return {
      ...sanitized,
      similarityScore: image.similarityScore,
    };
  }

  return sanitized;
}

export function transformImage(
  image: CloudinaryImageSanitizable
): CloudinaryImageFrontend {
  return sanitizeCloudinaryImage(image);
}
