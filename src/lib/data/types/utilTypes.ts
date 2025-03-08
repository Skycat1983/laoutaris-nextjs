import { Document as MongoDocument, ObjectId } from "mongoose";

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

// Generic transformation helpers
export type WithPopulated<
  T extends { [K in Stage]: any },
  Stage extends keyof T,
  PopulatedKeys extends { [K: string]: { [S in Stage]: any } }
> = Omit<T[Stage], keyof PopulatedKeys> & {
  [K in keyof PopulatedKeys]: PopulatedKeys[K][Stage];
};
