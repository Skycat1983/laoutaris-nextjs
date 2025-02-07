export interface ColorInfo {
  color: string;
  percentage: number;
}

export interface PredominantColors {
  cloudinary: ColorInfo[];
  google: ColorInfo[];
}

export interface ImageColorData {
  hexColors: ColorInfo[];
  predominantColors: PredominantColors;
}
