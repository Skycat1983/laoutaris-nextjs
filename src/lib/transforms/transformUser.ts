import { UserDB } from "../data/models";
import { UserTransformations } from "../data/types/transformationTypes";
import { transformMongooseDoc } from "./mongooseTransforms";

export function transformUser(
  document: UserDB
): UserTransformations["Frontend"] {
  // 1. To Lean
  const leanDoc = transformMongooseDoc<UserTransformations["Lean"]>(document);

  // 2. Add extensions
  const extendedDoc: UserTransformations["Extended"] = {
    ...leanDoc,
    isOnline: false,
  };
  // 3. Remove sensitive fields
  const { password, email, ...sanitizedFields } = extendedDoc;
  const sanitizedDoc =
    sanitizedFields satisfies UserTransformations["Sanitized"];

  return sanitizedDoc; // Frontend is same as sanitized for users
}
