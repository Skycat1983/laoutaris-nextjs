import { Types } from "mongoose";

export interface TransformOptions {
  stringifyIds?: boolean;
  removeMongooseFields?: boolean;
}

export function transformMongooseDoc<T>(
  doc: any,
  options: TransformOptions = { stringifyIds: true, removeMongooseFields: true }
): T {
  if (!doc) return doc;

  // If the doc itself is a Mongoose ObjectId, immediately convert it.
  if (options.stringifyIds && doc instanceof Types.ObjectId) {
    return doc.toString() as unknown as T;
  }

  // Handle arrays recursively
  if (Array.isArray(doc)) {
    return doc.map((item) =>
      transformMongooseDoc(item, options)
    ) as unknown as T;
  }

  // Handle plain objects
  if (typeof doc === "object") {
    // Return dates as-is
    if (doc instanceof Date) {
      return doc as unknown as T;
    }

    const transformed: any = {};

    for (const [key, value] of Object.entries(doc)) {
      // Skip Mongoose internal fields if specified (e.g. __v)
      if (options.removeMongooseFields && key === "__v") continue;

      // If = Mongoose ObjectId, convert it to a string.
      if (options.stringifyIds && value instanceof Types.ObjectId) {
        transformed[key] = value.toString();
        continue;
      }

      //? ObjectId may appear as an object with a `buffer` property.
      if (
        options.stringifyIds &&
        typeof value === "object" &&
        value !== null &&
        "buffer" in value &&
        Buffer.isBuffer(value.buffer)
      ) {
        transformed[key] = value.buffer.toString("hex");
        continue;
      }

      // Recursively handle nested objects/arrays
      if (typeof value === "object" && value !== null) {
        transformed[key] = transformMongooseDoc(value, options);
        continue;
      }

      transformed[key] = value;
    }

    return transformed as T;
  }

  // For primitives, return the value as-is
  return doc as T;
}
