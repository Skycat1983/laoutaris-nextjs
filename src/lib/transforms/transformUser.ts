import { UserDB } from "../data/models";
import { UserTransformations } from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";

export function transformUser(
  document: UserTransformations["Lean"],
  userId?: string | null
): UserTransformations["Frontend"] {
  // 1. To Lean
  const transformedDoc =
    transformMongooseDoc<UserTransformations["Raw"]>(document);

  // 2. Add extensions
  const extendedDoc: UserTransformations["Extended"] = {
    ...transformedDoc,
    isOnline: false,
  };
  // 3. Remove sensitive fields
  const { password, email, ...sanitizedFields } = extendedDoc;
  const sanitizedDoc =
    sanitizedFields satisfies UserTransformations["Sanitized"];

  return sanitizedDoc; // Frontend is same as sanitized for users
}
