import { SENSITIVE_PUBLIC_USER_FIELDS } from "../constants";
import { EXTENDED_PUBLIC_USER_FIELDS } from "../constants";
import { PublicUserTransformations } from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";
import { transformUtils } from "./transformUtils";

export const transformUser = {
  toRaw: (
    doc: PublicUserTransformations["Lean"]
  ): PublicUserTransformations["Raw"] => {
    return transformMongooseDoc<PublicUserTransformations["Raw"]>(doc);
  },

  toExtended: (
    doc: PublicUserTransformations["Raw"]
  ): PublicUserTransformations["Extended"] => {
    return transformUtils.extend(doc, EXTENDED_PUBLIC_USER_FIELDS);
  },

  toSanitized: (
    doc: PublicUserTransformations["Extended"]
  ): PublicUserTransformations["Sanitized"] => {
    return transformUtils.removeSensitive(doc, SENSITIVE_PUBLIC_USER_FIELDS);
  },

  toFrontend: (
    doc: PublicUserTransformations["Lean"]
  ): PublicUserTransformations["Frontend"] => {
    return transformUser.toSanitized(
      transformUser.toExtended(transformUser.toRaw(doc))
    );
  },
};

// export function transformUser(
//   document: UserTransformations["Lean"],
//   userId?: string | null
// ): UserTransformations["Frontend"] {
//   // 1. To Lean
//   const transformedDoc: UserTransformations["Raw"] =
//     transformMongooseDoc<UserTransformations["Raw"]>(document);

//   // 2. Add extensions
//   const extendedDoc: UserTransformations["Extended"] = {
//     ...transformedDoc,
//     isOnline: false,
//   };
//   // 3. Remove sensitive fields
//   const { password, email, ...sanitizedFields } = extendedDoc;
//   const sanitizedDoc =
//     sanitizedFields satisfies UserTransformations["Sanitized"];

//   return sanitizedDoc; // Frontend is same as sanitized for users
// }
