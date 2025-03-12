import {
  SensitivePublicArtworkFields,
  ExtendedPublicArtworkFields,
} from "@/lib/constants/publicDocumentConstants";
import { ArtworkDB } from "../models/artworkModel";
import {
  LeanDocument,
  Merge,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";
import {
  ArtStyle,
  FilterMode,
  Medium,
  SortOption,
  Surface,
} from "@/lib/constants/artworkConstants";
import { Decade } from "@/lib/constants/artworkConstants";
import { CollectionLean } from "./collectionTypes";
import { transformArtwork } from "@/lib/transforms/transformArtwork";

export type ArtworkLean = LeanDocument<ArtworkDB>;
export type ArtworkFrontend = ReturnType<typeof transformArtwork.toFrontend>;

export type ArtworkLeanPopulated = WithPopulatedFields<
  ArtworkLean,
  {
    collections: CollectionLean[];
  }
>;
// export interface ArtworkFields {
//   favouriteCount: number;
//   watchlistCount: number;
//   isFavourited?: boolean;
//   isWatchlisted?: boolean;
// }
// //! doc-specific transformation definitions
// export type PublicArtworkTransformations = {
//   DB: ArtworkDB;
//   Lean: LeanDocument<PublicArtworkTransformations["DB"]>;
//   Raw: TransformedDocument<PublicArtworkTransformations["Lean"]>;
//   Extended: Merge<
//     PublicArtworkTransformations["Raw"],
//     ExtendedPublicArtworkFields
//   >;
//   Sanitized: Omit<
//     PublicArtworkTransformations["Extended"],
//     SensitivePublicArtworkFields[number]
//   > & {
//     // image: CloudinaryImageSanitized;
//   };
//   Frontend: PublicArtworkTransformations["Sanitized"];
// };

// //! Frontend-specific types (safe)
// export type PublicArtwork = PublicArtworkTransformations["Frontend"];

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
