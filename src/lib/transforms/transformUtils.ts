import { TransformedDocument } from "../data/types/utilTypes";
import { transformMongooseDoc } from "./transformMongooseDoc";

// First, let's define a more specific field config type
type FieldConfig<T extends string = string, D = any> = {
  readonly type: T;
  readonly default: D;
};

// Then modify our ExtractFieldType to work with the config
type ExtractFieldType<T extends FieldConfig> = T["type"] extends "number"
  ? number
  : T["type"] extends "string"
  ? string
  : T["type"] extends "boolean"
  ? boolean
  : T["type"] extends "date"
  ? Date
  : never;

// And update ExtractFieldTypes
type ExtractFieldTypes<T extends Record<string, FieldConfig>> = {
  [K in keyof T]: ExtractFieldType<T[K]>;
};

// Add this type helper for the merged result
type MergedDoc<T, C> = T & ExtractFieldTypes<C>;

export const transformUtils = {
  // Convert lean document to raw (handle ObjectIds)
  toRaw: <T>(doc: any): TransformedDocument<T> =>
    transformMongooseDoc<TransformedDocument<T>>(doc),

  // Apply extended fields with their defaults
  applyDefaults: <T extends Record<string, any>, E extends Record<string, any>>(
    doc: T,
    extendedFields: E
  ): T & E => {
    const extended = { ...doc, ...extendedFields };
    return extended;
  },

  // Remove sensitive fields
  removeSensitive: <T extends Record<string, any>>(
    doc: T,
    sensitiveFields: readonly string[]
  ): Omit<T, keyof typeof sensitiveFields> => {
    const sanitized = { ...doc };
    for (const field of sensitiveFields) {
      delete sanitized[field];
    }
    return sanitized as Omit<T, keyof typeof sensitiveFields>;
  },

  // Helper to check if a field exists in a document
  hasField: <T extends Record<string, any>>(
    doc: T,
    field: keyof T
  ): boolean => {
    return field in doc && doc[field] !== undefined && doc[field] !== null;
  },

  // Helper to safely get a field value with a default
  getFieldValue: <T extends Record<string, any>, K extends keyof T>(
    doc: T,
    field: K,
    defaultValue: T[K]
  ): T[K] => {
    return transformUtils.hasField(doc, field) ? doc[field] : defaultValue;
  },

  // Helper to merge documents while preserving types
  merge: <T extends Record<string, any>, U extends Record<string, any>>(
    target: T,
    source: U
  ): T & U => {
    return { ...target, ...source };
  },

  extend: <T extends Record<string, any>, E extends Record<string, any>>(
    doc: T,
    extendedFields: E,
    calculateFields?: (doc: T) => Partial<E>
  ): T & E => {
    const defaults = { ...extendedFields };
    const calculated = calculateFields ? calculateFields(doc) : {};

    return transformUtils.merge(
      doc,
      transformUtils.merge(defaults, calculated)
    );
  },
};

// Export types for external use
export type { ExtractFieldType, ExtractFieldTypes, FieldConfig };
