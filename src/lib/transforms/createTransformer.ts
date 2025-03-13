import { LeanDocument, TransformedDocument } from "../data/types";
import { transformUtils } from "./transformUtils";

type ValidFieldType = string | number | boolean | Date;

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
) => {
  const transformer = {
    toRaw: <T extends TBase | TBasePopulated>(
      doc: LeanDocument<T>
    ): TransformedDocument<LeanDocument<T>> => {
      return transformUtils.toRaw(doc);
    },

    toExtended: <T extends TBase | TBasePopulated>(
      doc: TransformedDocument<LeanDocument<T>>,
      userId?: string | null
    ) => {
      return transformUtils.extend(doc, extendedFields, (d) =>
        calculateFields ? calculateFields(d, userId) : {}
      );
    },

    toSanitized: <T extends TBase | TBasePopulated>(
      doc: TransformedDocument<LeanDocument<T>> & TExtended
    ): Omit<TransformedDocument<LeanDocument<T>> & TExtended, TSensitive> => {
      return transformUtils.removeSensitive(doc, sensitiveFields);
    },

    toFrontend: <T extends TBase | TBasePopulated>(
      doc: LeanDocument<T>,
      userId?: string | null
    ) => {
      const raw = transformer.toRaw(doc);
      const extended = transformer.toExtended(raw, userId);
      return transformer.toSanitized(extended);
    },
  };

  return transformer;
};

// export const createTransformer = <
//   TBase,
//   TBasePopulated,
//   TExtended extends Record<string, ValidFieldType>,
//   TSensitive extends string
// >(
//   extendedFields: TExtended,
//   sensitiveFields: readonly TSensitive[],
//   calculateFields?: (doc: any, userId?: string | null) => Partial<TExtended>
// ) => {
//   const transformer = {
//     toRaw: <T extends TBase | TBasePopulated>(
//       doc: LeanDocument<T>
//     ): TransformedDocument<LeanDocument<T>> => {
//       return transformUtils.toRaw(doc);
//     },

//     toExtended: <T extends TBase | TBasePopulated>(
//       doc: TransformedDocument<LeanDocument<T>>,
//       userId?: string | null
//     ) => {
//       return transformUtils.extend(doc, extendedFields, (d) =>
//         calculateFields ? calculateFields(d, userId) : {}
//       );
//     },

//     toSanitized: <T extends TBase | TBasePopulated>(
//       doc: any
//     ): Omit<T, TSensitive> => {
//       return transformUtils.removeSensitive(doc, sensitiveFields);
//     },

//     toFrontend: <T extends TBase | TBasePopulated>(
//       doc: LeanDocument<T>,
//       userId?: string | null
//     ) => {
//       const raw = transformer.toRaw(doc);
//       const extended = transformer.toExtended(raw, userId);
//       return transformer.toSanitized(extended);
//     },
//   };

//   return transformer;
// };
