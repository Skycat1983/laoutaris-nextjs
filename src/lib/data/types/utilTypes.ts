import { Document as MongoDocument, ObjectId } from "mongoose";
import { ArtworkDB } from "../models";

type MongooseInternals = "$locals" | "$assertPopulated" | "$getAllSubdocs";

export type StrictLeanDocument<T> = {
  [K in keyof Omit<T, MongooseInternals>]: K extends "_id"
    ? string | ObjectId
    : T[K];
} & {
  _id: string | ObjectId;
};

type StrictObject<T> = {
  [P in keyof T]: T[P];
} & {};

// For Mongoose's .lean() operation
export type LeanDocument<T> = Omit<T, "$locals"> & {
  _id: string | ObjectId; // Could be either
  // _id: ObjectId;
  __v?: number;
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

export type WithPopulatedFields<
  TBase,
  TPopulated extends Record<string, any>
> = StrictObject<Omit<TBase, keyof TPopulated> & TPopulated>;
// Helper to create populated types
// export type WithPopulatedFields<
//   TBase,
//   TPopulated extends Record<string, any>
// > = Omit<TBase, keyof TPopulated> & TPopulated;

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

export type PublicTransformationsGeneric<
  TDocument,
  TExtended extends Record<string, any>,
  TSensitive extends string
> = {
  DB: TDocument;
  Lean: LeanDocument<
    PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["DB"]
  >;
  Raw: TransformedDocument<
    PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Lean"]
  >;
  Extended: Merge<
    PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Raw"],
    TExtended
  >;
  Sanitized: Omit<
    PublicTransformationsGeneric<TDocument, TExtended, TSensitive>["Extended"],
    TSensitive
  >;
  Frontend: PublicTransformationsGeneric<
    TDocument,
    TExtended,
    TSensitive
  >["Sanitized"];
};

type FieldConfig<T extends string = string, D = any> = {
  readonly type: T;
  readonly default: D;
};

// Helper to extract the actual type from a field config
export type ExtractFieldType<T extends { type: string; default: any }> =
  T["type"] extends "number"
    ? number
    : T["type"] extends "string"
    ? string
    : T["type"] extends "boolean"
    ? boolean
    : never;

// Helper to convert config record to actual types
export type ExtractFieldTypes<
  T extends Record<string, { type: string; default: any }>
> = {
  [K in keyof T]: ExtractFieldType<T[K]>;
};

// export type{
//   FieldConfig,
//   ExtractFieldType,
//   ExtractFieldTypes,
// }
