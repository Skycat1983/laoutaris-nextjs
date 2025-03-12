import {
  EXTENDED_PUBLIC_ARTWORK_FIELDS,
  ExtendedPublicArtworkFields,
  SENSITIVE_PUBLIC_ARTWORK_FIELDS,
  SensitivePublicArtworkFields,
} from "../constants";
import { createTransformer } from "./createTransformer";
import { ArtworkBase, ArtworkDB } from "../data/models";
import { extendArtworkFields } from "./transformHelpers";

export type TransformedArtwork = ReturnType<typeof transformArtwork.toFrontend>;

export const transformArtwork = createTransformer<
  ArtworkDB,
  ArtworkBase,
  ExtendedPublicArtworkFields,
  SensitivePublicArtworkFields
>(EXTENDED_PUBLIC_ARTWORK_FIELDS, SENSITIVE_PUBLIC_ARTWORK_FIELDS, (doc) => ({
  ...extendArtworkFields(doc),
}));

// export const transformArtwork = {
//   toRaw: (
//     doc: PublicArtworkTransformations["Lean"]
//   ): PublicArtworkTransformations["Raw"] => {
//     return transformUtils.toRaw<PublicArtworkTransformations["Raw"]>(doc);
//   },

//   toExtended: (
//     doc: PublicArtworkTransformations["Raw"]
//   ): PublicArtworkTransformations["Extended"] => {
//     return transformUtils.extend(doc, EXTENDED_PUBLIC_ARTWORK_FIELDS);
//   },

//   toSanitized: (
//     doc: PublicArtworkTransformations["Extended"]
//   ): PublicArtworkTransformations["Sanitized"] => {
//     const { image, ...sanitizedFields } = doc;
//     const sanitizedImage = transformImage(image);
//     return transformUtils.merge(sanitizedFields, {
//       image: sanitizedImage,
//     }) satisfies PublicArtworkTransformations["Sanitized"];
//   },

//   toFrontend: (
//     doc: PublicArtworkTransformations["Lean"]
//   ): PublicArtworkTransformations["Frontend"] => {
//     return transformArtwork.toSanitized(
//       transformArtwork.toExtended(transformArtwork.toRaw(doc))
//     ) satisfies PublicArtworkTransformations["Frontend"];
//   },
// };
