import { CollectionDB } from "../models";
import { ArtworkFrontend, ArtworkLean } from "./artworkTypes";
import { LeanDocument, WithPopulatedFields } from "./utilTypes";
import { transformCollection } from "@/lib/transforms/transformCollection";

export type CollectionLean = LeanDocument<CollectionDB>;
export type CollectionFrontend = ReturnType<
  typeof transformCollection.toFrontend
>;

export type CollectionLeanPopulated = WithPopulatedFields<
  CollectionLean,
  {
    artworks: ArtworkLean[];
  }
>;

export type CollectionFrontendPopulated = WithPopulatedFields<
  CollectionFrontend,
  {
    artworks: ArtworkFrontend[];
  }
>;

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}
