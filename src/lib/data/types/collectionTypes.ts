import { CollectionDB } from "../models";
import { ArtworkFrontend, ArtworkLean } from "./artworkTypes";
import {
  LeanDocument,
  Prettify,
  StrictLeanDocument,
  TransformedDocument,
  WithPopulatedFields,
} from "./utilTypes";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";

export type CollectionLean = LeanDocument<CollectionDB>;
export type CollectionTransformed = TransformedDocument<CollectionDB>;
// export type CollectionLean = StrictLeanDocument<CollectionDB>;
export type CollectionRaw = Prettify<
  ReturnType<typeof transformCollection.toRaw>
>;
export type CollectionExtended = Prettify<
  ReturnType<typeof transformCollection.toExtended>
>;
export type CollectionSanitized = Prettify<
  ReturnType<typeof transformCollection.toSanitized>
>;
export type CollectionFrontend = Prettify<
  ReturnType<typeof transformCollection.toFrontend>
>;

export type CollectionLeanPopulated = Prettify<
  WithPopulatedFields<
    CollectionLean,
    {
      artworks: ArtworkLean[];
    }
  >
>;

export type CollectionFrontendPopulated = Prettify<
  WithPopulatedFields<
    CollectionFrontend,
    {
      artworks: ArtworkFrontend[];
    }
  >
>;

export interface CollectionFilterParams {
  key: "section" | null;
  value: string | null;
}
