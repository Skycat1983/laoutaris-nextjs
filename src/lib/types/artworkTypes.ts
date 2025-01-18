import { FrontendUserFull } from "./userTypes";

export interface FrontendArtworkFull {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: number;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: FrontendUserFull[];
  favourited: FrontendUserFull[];
}

export interface FrontendArtworkUnpopulated {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: number;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithWatcherlist {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: number;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: FrontendUserFull[];
  favourited: string[];
}

export interface FrontendArtworkWithFavourited {
  _id: string;
  image: ArtworkImage;
  title: string;
  decade: number;
  artstyle: string;
  medium: string;
  surface: string;
  featured: boolean;
  watcherlist: string[];
  favourited: FrontendUserFull[];
}

export interface ArtworkImage {
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

// //! OLD TYPES BELOW:
// //* TRYING WITH FULL USER TYPE

// export interface IFrontendArtwork {
//   image: ArtworkImage;
//   _id: string;
//   title: string;
//   decade: number;
//   artstyle: string;
//   medium: string;
//   surface: string;
//   featured: boolean;
//   watcherlist: string[];
//   favourited: string[];
// }
