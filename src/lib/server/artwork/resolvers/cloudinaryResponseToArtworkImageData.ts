import { v4 as uuidv4 } from "uuid"; // You'll need to install this package
import type { ArtworkImage } from "@/lib/types/artworkTypes";
import { CloudinaryUploadInfo } from "@/lib/types/cloudinaryTypes";

export function cloudinaryResponseToArtworkImageData(
  info: CloudinaryUploadInfo
): ArtworkImage {
  const hexColors = info.colors.map(([color, percentage]) => ({
    color,
    percentage,
  }));

  const cloudinaryColors = info.predominant.cloudinary.map(
    ([color, percentage]) => ({
      color,
      percentage,
    })
  );

  const googleColors = info.predominant.google.map(([color, percentage]) => ({
    color,
    percentage,
  }));

  return {
    secure_url: info.secure_url,
    public_id: info.public_id,
    pixelHeight: info.height,
    pixelWidth: info.width,
    format: info.format,
    bytes: info.bytes,
    hexColors: hexColors,
    predominantColors: {
      cloudinary: cloudinaryColors,
      google: googleColors,
    },
  };
}

// export function cloudinaryResponseToArtworkImageData(
//   info: CloudinaryUploadWidgetInfo
// ): ProcessedImageDetails {
//   return {
//     secure_url: info.secure_url,
//     public_id: info.public_id,
//     bytes: info.bytes,
//     pixelHeight: info.height,
//     pixelWidth: info.width,
//     format: info.format,
//     hexColors:
//       (info.colors as CloudinaryColor[])?.map(([color, percentage]) => ({
//         color: color as string,
//         percentage: percentage as number,
//       })) || [],
//     predominantColors: (info.predominant as CloudinaryPredominantColors) || {
//       google: [],
//       cloudinary: [],
//     },
//   };
// }
