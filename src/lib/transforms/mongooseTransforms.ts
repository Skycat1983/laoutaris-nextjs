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
    const transformed: any = {};

    for (const [key, value] of Object.entries(doc)) {
      // Skip Mongoose internal fields if specified
      if (options.removeMongooseFields && key === "__v") continue;

      // Transform ObjectIds to strings if specified
      if (options.stringifyIds && value instanceof Types.ObjectId) {
        transformed[key] = value.toString();
        continue;
      }

      // Handle nested objects/arrays
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
