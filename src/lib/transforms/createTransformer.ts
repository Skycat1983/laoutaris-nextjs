import { LeanDocument, Merge, TransformedDocument } from "../data/types";
import { transformUtils } from "./transformUtils";

type ValidFieldType = string | number | boolean | Date;

export type PublicTransformationsGeneric<
  TDocument,
  TExtended extends Record<string, ValidFieldType>,
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

/**
 * Generic transformer factory for document transformations
 *
 * @template TBase - The base document type (e.g., CollectionDB)
 *   Represents the complete document structure from the database
 *
 * @template TBasePopulated - The populated version of the base type
 *   Same as TBase but with populated fields (e.g., CollectionDB with artworks as ArtworkDB[])
 *   Used to handle both populated and unpopulated versions with the same transformer
 *
 * @template TExtended - Additional fields added during transformation
 *   Must be a record of simple types (string, number, boolean, Date)
 *   Example: { readTime: number, artworkCount: number }
 *
 * @template TSensitive - Union of field names to remove
 *   String literal union of sensitive field names
 *   Example: "createdAt" | "updatedAt"
 *
 * Usage:
 * ```typescript
 * const transformer = createTransformer<
 *   CollectionDB,           // Base document type
 *   CollectionPopulated,    // Populated version
 *   ExtendedFields,        // Added fields
 *   SensitiveFields        // Fields to remove
 * >(
 *   defaultExtendedFields,  // Default values for extended fields
 *   sensitiveFieldNames,    // Array of sensitive field names
 *   calculateFields         // Function to compute extended fields
 * );
 * ```
 */
export const createTransformer = <
  TBase,
  TBasePopulated,
  TExtended extends Record<string, ValidFieldType>,
  TSensitive extends string
>(
  extendedFields: TExtended,
  sensitiveFields: readonly TSensitive[],
  calculateFields?: (doc: any, userId?: string | null) => Partial<TExtended>
) => ({
  toRaw: <T extends TBase | TBasePopulated>(
    doc: LeanDocument<T>
  ): TransformedDocument<LeanDocument<T>> => {
    return transformUtils.toRaw(doc);
  },

  toExtended: <T extends TBase | TBasePopulated>(
    doc: TransformedDocument<LeanDocument<T>>,
    userId?: string | null
  ) => {
    return {
      ...doc,
      ...extendedFields,
      ...(calculateFields ? calculateFields(doc, userId) : {}),
    };
  },

  toSanitized: <T extends TBase | TBasePopulated>(doc: any) => {
    return transformUtils.removeSensitive(doc, sensitiveFields);
  },

  toFrontend: <T extends TBase | TBasePopulated>(
    doc: LeanDocument<T>,
    userId?: string | null
  ) => {
    const rawDoc = transformUtils.toRaw(doc);
    const extendedDoc = {
      ...rawDoc,
      ...extendedFields,
      ...(calculateFields ? calculateFields(rawDoc, userId) : {}),
    };
    return transformUtils.removeSensitive(extendedDoc, sensitiveFields);
  },
});
