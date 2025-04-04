import { v4 as uuidv4 } from "uuid"; // You'll need to install this package
import {
  CloudinaryImageDB,
  CloudinaryUploadInfo,
} from "@/lib/data/types/cloudinaryTypes";

export function cloudinaryResponseToArtworkImageData(
  info: CloudinaryUploadInfo
): CloudinaryImageDB {
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
