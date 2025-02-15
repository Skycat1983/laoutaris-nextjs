import { Types } from "mongoose";

type TransformOptions = {
  stringifyIds?: boolean;
  removeMongooseFields?: boolean;
};

export function transformMongooseDoc<T>(
  doc: any,
  options: TransformOptions = { stringifyIds: true, removeMongooseFields: true }
): T {
  if (!doc) return doc;

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => transformMongooseDoc<T>(item, options)) as T;
  }

  // Handle objects
  if (typeof doc === "object") {
    // if Date, return directly (or convert as needed)
    if (doc instanceof Date) {
      return doc as unknown as T;
    }

    const transformed: any = {};

    for (const [key, value] of Object.entries(doc)) {
      // skip Mongoose internal fields if specified
      if (options.removeMongooseFields && key === "__v") continue;

      // transform ObjectIds to strings if specified
      if (options.stringifyIds && value instanceof Types.ObjectId) {
        transformed[key] = value.toString();
        continue;
      }

      //hhandle nested objects/arrays (but dates are handled above)
      if (typeof value === "object" && value !== null) {
        transformed[key] = transformMongooseDoc(value, options);
        continue;
      }

      transformed[key] = value;
    }

    return transformed as T;
  }

  return doc as T;
}

export function transformNestedMongooseDoc<T>(
  doc: any,
  options: TransformOptions = { stringifyIds: true, removeMongooseFields: true }
): T {
  if (doc === null || doc === undefined) return doc;

  // If it's a Date, return it directly (or convert as needed)
  if (doc instanceof Date) return doc as unknown as T;

  // If it's an ObjectId and we want to stringify it, do so now.
  if (options.stringifyIds && doc instanceof Types.ObjectId) {
    return doc.toString() as unknown as T;
  }

  // If it's an array, transform each item recursively.
  if (Array.isArray(doc)) {
    return doc.map((item) =>
      transformMongooseDoc(item, options)
    ) as unknown as T;
  }

  // If it's a plain object, iterate its keys.
  if (typeof doc === "object") {
    const transformed: any = {};
    for (const key in doc) {
      // Skip internal Mongoose field if specified.
      if (options.removeMongooseFields && key === "__v") continue;
      transformed[key] = transformMongooseDoc(doc[key], options);
    }
    return transformed as T;
  }

  // Otherwise, return the value as-is (covers primitives).
  return doc as T;
}
