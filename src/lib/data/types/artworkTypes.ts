import {
  SensitivePublicArtworkFields,
  ExtendedPublicArtworkFields,
} from "@/lib/constants/publicDocumentConstants";
import { ArtworkDB } from "../models/artworkModel";
import {
  LeanDocument,
  Merge,
  Prettify,
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
import { CollectionFrontend, CollectionLean } from "./collectionTypes";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";

export type ArtworkLean = LeanDocument<ArtworkDB>;
export type ArtworkFrontend = ReturnType<typeof transformArtwork.toFrontend>;

export type ArtworkLeanPopulated = WithPopulatedFields<
  ArtworkLean,
  {
    collections: CollectionLean[];
  }
>;

export type ArtworkFrontendPopulated = Prettify<
  WithPopulatedFields<
    ArtworkFrontend,
    {
      collections: CollectionFrontend[];
    }
  >
>;

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
