import { Document as MongoDocument, ObjectId } from "mongoose";
import { ArtworkDB } from "../models";

// For Mongoose's .lean() operation
export type LeanDocument<T> = Omit<T, "$locals"> & {
  _id: string | ObjectId; // Could be either
};

// for our transformation pipeline
export type TransformedDocument<T> = Omit<T, keyof MongoDocument> & {
  _id: string;
};

// ttility to make TypeScript output cleaner by removing intersections
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Utility to merge two object types
export type Merge<T1, T2> = Prettify<Omit<T1, keyof T2> & T2>;

// For handling single transformations
export type WithPopulated<
  T extends { [K in Stage]: any },
  Stage extends keyof T,
  PopulatedKeys extends { [K: string]: { [S in Stage]: any } }
> = Omit<T[Stage], keyof PopulatedKeys> & {
  [K in keyof PopulatedKeys]: PopulatedKeys[K][Stage];
};

// For handling array transformations
export type WithPopulatedArray<
  T extends { [K in Stage]: any },
  Stage extends keyof T,
  PopulatedKeys extends { [K: string]: Array<{ [S in Stage]: any }> }
> = Omit<T[Stage], keyof PopulatedKeys> & {
  [K in keyof PopulatedKeys]: Array<PopulatedKeys[K][number][Stage]>;
};

//! is this useable?

// Configuration for document transformations
export interface TransformConfig<
  TBase,
  TExtend extends Record<string, any> = {},
  TSanitize extends keyof TBase = never
> {
  // Fields to add in the Extended stage
  extend: TExtend;
  // Fields to remove in the Sanitized stage
  sanitize: TSanitize[];
}

// Updated transformation type using config
export type DocumentTransformations<
  TDB,
  TConfig extends TransformConfig<TDB>
> = {
  DB: TDB;
  Lean: LeanDocument<TDB>;
  Raw: TransformedDocument<TDB>;
  Extended: Merge<TransformedDocument<TDB>, TConfig["extend"]>;
  Sanitized: Omit<
    Merge<TransformedDocument<TDB>, TConfig["extend"]>,
    TConfig["sanitize"][number]
  >;
  Frontend: TConfig["sanitize"];
};

// export const ArtworkConfig = {
//   extend: {
//     favouriteCount: 0,
//     watchlistCount: 0,
//     isFavourited: false,
//     isWatchlisted: false,
//   },
//   sanitize: ["favourited", "watcherlist", "image"] as const,
// } satisfies TransformConfig<ArtworkDB>;

// export type ArtworkTransformations = DocumentTransformations<
//   ArtworkDB,
//   typeof ArtworkConfig
// >;

// export const CollectionConfig = {
//   extend: {
//     firstArtwork: "" as string,
//   },
//   sanitize: ["_id", "createdAt", "updatedAt"] as const,
// } satisfies TransformConfig<CollectionDB>;

// // Type using the config
// export type CollectionTransformations = DocumentTransformations<
//   CollectionDB,
//   typeof CollectionConfig
// >;
