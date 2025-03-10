import { ArtworkDB } from "../models/artworkModel";
import { CloudinaryImageSanitized } from "./cloudinaryTypes";
import { LeanDocument, Merge, TransformedDocument } from "./utilTypes";

export interface ArtworkFields {
  favouriteCount: number;
  watchlistCount: number;
  isFavourited?: boolean;
  isWatchlisted?: boolean;
}

// From Mongoose Document to Lean
export type ArtworkLean = LeanDocument<ArtworkDB>;
export type ArtworkRaw = TransformedDocument<ArtworkLean>; // Should stay as ArtworkDB, not ArtworkLean
export type ArtworkExtended = Merge<ArtworkRaw, ArtworkFields>;
export type ArtworkSanitized = Omit<
  ArtworkExtended,
  "favourited" | "watcherlist" | "image"
> & {
  image: CloudinaryImageSanitized;
};

const ARTWORK_CONFIG = {
  SENSITIVE_FIELDS: ["favourited", "watcherlist"],
};

export type SensitiveFields = (typeof ARTWORK_CONFIG)["SENSITIVE_FIELDS"];
//! doc-specific transformation definitions
export type PublicArtworkTransformations = {
  DB: ArtworkDB;
  Lean: LeanDocument<PublicArtworkTransformations["DB"]>;
  Raw: TransformedDocument<PublicArtworkTransformations["Lean"]>;
  Extended: Merge<PublicArtworkTransformations["Raw"], ArtworkFields>;
  Sanitized: Omit<
    PublicArtworkTransformations["Extended"],
    "favourited" | "watcherlist" | "image"
  > & {
    image: CloudinaryImageSanitized;
  };
  Frontend: PublicArtworkTransformations["Sanitized"];
};

// export type ArtworkTransformations = {
//   DB: ArtworkDB;
//   Lean: ArtworkLean;
//   Raw: ArtworkRaw;
//   Extended: ArtworkExtended;
//   Sanitized: ArtworkSanitized;
//   Frontend: ArtworkTransformations["Sanitized"];
// };

//! Frontend-specific types (safe)
export type PublicArtwork = PublicArtworkTransformations["Frontend"];

//! Artwork fields
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

export interface ColorInfo {
  color: string;
  percentage: number;
}

export interface PredominantColors {
  cloudinary: ColorInfo[];
  google: ColorInfo[];
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

// export interface CloudinaryColor {
//   color: string;
//   percentage: number;
//   // _id: string;
// }

// export interface GoogleColor {
//   color: string;
//   percentage: number;
//   // _id: string;
// }

// export type PublicArtworkImage = Omit<ArtworkImage, "public_id">;

// export type ArtworkPublic = Omit<
//   ArtworkLean,
//   "collections" | "watcherlist" | "favourited" | "image"
// > & {
//   image: CloudinaryImageFrontend;
// };

// type PopulatedField<T> = string | T | Partial<T>;

// export interface FrontendArtwork extends BaseFrontendArtwork {
//   // image: PublicArtworkImage;
//   watcherlist: PopulatedField<FrontendUser>[];
//   favourited: PopulatedField<FrontendUser>[];
// }

// export interface FrontendArtworkUnpopulated extends BaseFrontendArtwork {
//   // image: PublicArtworkImage;
//   collections: string[];
//   watcherlist: string[];
//   favourited: string[];
// }

// export interface FrontendArtworkWithCollections extends FrontendArtwork {
//   // image: PublicArtworkImage;
//   collections: FrontendCollection[];
//   watcherlist: string[];
//   favourited: string[];
// }

// export interface FrontendArtworkWithWatcherlist extends FrontendArtwork {
//   // image: PublicArtworkImage;
//   collections: string[];
//   watcherlist: FrontendUserUnpopulated[];
//   favourited: string[];
// }

// export interface FrontendArtworkWithFavourited extends FrontendArtwork {
//   // image: PublicArtworkImage;
//   collections: string[];
//   watcherlist: string[];
//   favourited: FrontendUserUnpopulated[];
// }

// export interface FrontendArtworkFull extends FrontendArtwork {
//   // image: PublicArtworkImage;
//   collections: FrontendCollection[];
//   watcherlist: FrontendUserUnpopulated[];
//   favourited: FrontendUserUnpopulated[];
// }

// export interface PublicFrontendArtwork extends BaseFrontendArtwork {
//   // image: PublicArtworkImage;
//   isWatchlisted: boolean;
//   isFavourited: boolean;
//   watchCount: number;
//   favouriteCount: number;
// }
