import { FrontendUser, FrontendUserUnpopulated } from "./userTypes";
import { FrontendCollection } from "./collectionTypes";

interface BaseFrontendArtwork {
  _id: string;
  title: string;
  image: ArtworkImage;
  decade: Decade;
  artstyle: ArtStyle;
  medium: Medium;
  surface: Surface;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PopulatedField<T> = string | T | Partial<T>;

export interface FrontendArtwork extends BaseFrontendArtwork {
  watcherlist: PopulatedField<FrontendUser>[];
  favourited: PopulatedField<FrontendUser>[];
}

export interface FrontendArtworkUnpopulated extends BaseFrontendArtwork {
  collections: string[];
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithCollections extends FrontendArtwork {
  collections: FrontendCollection[];
  watcherlist: string[];
  favourited: string[];
}

export interface FrontendArtworkWithWatcherlist extends FrontendArtwork {
  collections: string[];
  watcherlist: FrontendUserUnpopulated[];
  favourited: string[];
}

export interface FrontendArtworkWithFavourited extends FrontendArtwork {
  collections: string[];
  watcherlist: string[];
  favourited: FrontendUserUnpopulated[];
}

export interface FrontendArtworkFull extends FrontendArtwork {
  collections: FrontendCollection[];
  watcherlist: FrontendUserUnpopulated[];
  favourited: FrontendUserUnpopulated[];
}

export interface PublicFrontendArtwork extends BaseFrontendArtwork {
  favouriteCount: number;
  watchCount: number;
}

export type Decade =
  | "1950s"
  | "1960s"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

export type ArtStyle = "abstract" | "semi-abstract" | "figurative";

export type Medium =
  | "oil"
  | "acrylic"
  | "paint"
  | "watercolour"
  | "pastel"
  | "pencil"
  | "charcoal"
  | "ink"
  | "sand";

export type Surface = "paper" | "canvas" | "wood" | "film";

export interface ArtworkImage {
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: ColorInfo[];
  predominantColors: PredominantColors;
}

export interface CloudinaryColor {
  color: string;
  percentage: number;
  // _id: string;
}

export interface GoogleColor {
  color: string;
  percentage: number;
  // _id: string;
}

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

export type FilterMode = "ALL" | "ANY";

export type FilterKey = "decade" | "artstyle" | "medium" | "surface";

export type SortOption =
  | "colorProximity"
  | "mostRecent"
  | "mostPopular"
  | "mostFeatured";

export interface ArtworkSortConfig {
  by: SortOption;
  color?: string; // Only used when by === 'colorProximity'
}

export interface ArtworkFilterParams {
  decade?: Decade[];
  artstyle?: ArtStyle[];
  medium?: Medium[];
  surface?: Surface[];
  limit?: number;
  page?: number;
  filterMode: FilterMode;
}

export interface ArtworkQueryParams extends ArtworkFilterParams {
  sortBy?: SortOption;
  sortColor?: string;
}
