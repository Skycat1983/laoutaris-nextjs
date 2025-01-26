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

export function cloudinaryResponseToArtworkImageData(info: any): ArtworkImage {
  return {
    secure_url: info.secure_url,
    public_id: info.public_id,
    predominantColors:
      info.colors?.map((c: { color: string }) => c.color) || [],
    pixelHeight: info.height,
    pixelWidth: info.width,
    hexColors: info.colors?.map((c: { color: string }) => c.color) || [],
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
