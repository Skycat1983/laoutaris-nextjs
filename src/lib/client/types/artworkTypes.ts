export interface IFrontendArtwork {
  image: Image;
  _id: string;
  title: string;
  decade: number;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: string[];
  __v: number;
}

export interface Image {
  predominantColors: PredominantColors;
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: HexColor[];
}

export interface PredominantColors {
  cloudinary: CloudinaryColor[];
  google: GoogleColor[];
}

export interface CloudinaryColor {
  color: string;
  percentage: number;
  _id: string;
}

export interface GoogleColor {
  color: string;
  percentage: number;
  _id: string;
}

export interface HexColor {
  color: string;
  percentage: number;
  _id: string;
}
