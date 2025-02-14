import { CloudinaryUploadWidgetInfo } from "next-cloudinary";

type CloudinaryColorTuple = [string, number]; // [color, percentage]
type CloudinaryColorObject = {
  color: string;
  percentage: number;
};

export interface CloudinaryColorInfo {
  colors: Array<CloudinaryColorTuple | CloudinaryColorObject>;
}

export interface CloudinaryUploadInfo {
  secure_url: string;
  public_id: string;
  bytes: number;
  height: number;
  width: number;
  format: string;
  resource_type: string;
  colors: CloudinaryColorTuple[];
  predominant: {
    cloudinary: CloudinaryColorTuple[];
    google: CloudinaryColorTuple[];
  };
}
