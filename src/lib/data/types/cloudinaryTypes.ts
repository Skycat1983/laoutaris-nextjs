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

export interface CloudinaryImageDB {
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: ColourInfo[];
  predominantColors: PredominantColors;
}

export type CloudinaryImageSanitized = Omit<CloudinaryImageDB, "public_id">;

export interface PredominantColors {
  cloudinary: ColourInfo[];
  google: ColourInfo[];
}

export interface ColourInfo {
  color: string;
  percentage: number;
}

export type CloudinaryImageFrontend = CloudinaryImageSanitized;
