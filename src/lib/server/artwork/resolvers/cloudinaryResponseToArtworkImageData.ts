import { v4 as uuidv4 } from "uuid"; // You'll need to install this package
import type {
  ArtworkImage,
  HexColor,
  CloudinaryColor,
  GoogleColor,
} from "@/lib/types/artworkTypes";
import type { CloudinaryUploadWidgetInfo } from "next-cloudinary";

interface RawPredominantColor {
  0: string; // color
  1: number; // percentage
}

export function cloudinaryResponseToArtworkImageData(
  info: CloudinaryUploadWidgetInfo
): ArtworkImage {
  // Cast predominant to the raw format we know it has
  const predominant = info.predominant as {
    google: RawPredominantColor[];
    cloudinary: RawPredominantColor[];
  };

  return {
    secure_url: info.secure_url,
    public_id: info.public_id,
    bytes: info.bytes,
    pixelHeight: info.height,
    pixelWidth: info.width,
    format: info.format,
    hexColors:
      (info.colors as [string, number][])?.map(
        ([color, percentage]): HexColor => ({
          color,
          percentage,
          //   _id: uuidv4(),
        })
      ) || [],
    predominantColors: {
      cloudinary: (predominant?.cloudinary || []).map(
        (color): CloudinaryColor => ({
          color: color[0],
          percentage: color[1],
          //   _id: uuidv4(),
        })
      ),
      google: (predominant?.google || []).map(
        (color): GoogleColor => ({
          color: color[0],
          percentage: color[1],
          //   _id: uuidv4(),
        })
      ),
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
