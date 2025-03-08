import { Document as MongoDocument } from "mongoose";

export type LeanDocument<T> = T & { $locals?: never };

// Utility to make a LeanDocument from a DBDocument
export type MongoDocumentLean<T> = Omit<T, keyof MongoDocument> & {
  _id: string;
};

// Utility to make TypeScript output cleaner by removing intersections
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Utility to merge two object types
export type Merge<T1, T2> = Prettify<Omit<T1, keyof T2> & T2>;
