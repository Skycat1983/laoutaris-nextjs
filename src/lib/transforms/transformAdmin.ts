import {
  AdminBlogTransformationsPopulated,
  AdminCollectionTransformationsPopulated,
  AdminUserTransformations,
} from "../data/types";
import { AdminArtworkTransformations } from "../data/types";
import { AdminArticleTransformationsPopulated } from "../data/types";
import { AdminBlogTransformations } from "../data/types";
import { AdminCollectionTransformations } from "../data/types";
import { transformMongooseDoc } from "./utils/transformMongooseDoc";

export function transformAdminArticlePopulated(
  document: AdminArticleTransformationsPopulated["Lean"]
): AdminArticleTransformationsPopulated["Frontend"] {
  const transformed =
    transformMongooseDoc<AdminArticleTransformationsPopulated["Raw"]>(document);

  return transformed;
}

export function transformAdminArtwork(
  document: AdminArtworkTransformations["Lean"]
): AdminArtworkTransformations["Frontend"] {
  const transformedDoc: AdminArtworkTransformations["Raw"] =
    transformMongooseDoc<AdminArtworkTransformations["Raw"]>(document);

  return transformedDoc;
}

export function transformAdminUser(
  document: AdminUserTransformations["Lean"]
): AdminUserTransformations["Frontend"] {
  const transformedDoc: AdminUserTransformations["Raw"] =
    transformMongooseDoc<AdminUserTransformations["Raw"]>(document);

  return transformedDoc;
}

export function transformAdminBlog(
  document: AdminBlogTransformations["Lean"]
): AdminBlogTransformations["Frontend"] {
  const transformedDoc: AdminBlogTransformations["Raw"] =
    transformMongooseDoc<AdminBlogTransformations["Raw"]>(document);

  return transformedDoc;
}

export function transformAdminBlogPopulated(
  document: AdminBlogTransformationsPopulated["Lean"]
): AdminBlogTransformationsPopulated["Frontend"] {
  const transformedDoc: AdminBlogTransformationsPopulated["Raw"] =
    transformMongooseDoc<AdminBlogTransformationsPopulated["Raw"]>(document);

  return transformedDoc;
}

export function transformAdminCollection(
  document: AdminCollectionTransformations["Lean"]
): AdminCollectionTransformations["Frontend"] {
  const transformedDoc: AdminCollectionTransformations["Raw"] =
    transformMongooseDoc<AdminCollectionTransformations["Raw"]>(document);

  return transformedDoc;
}

export function transformAdminCollectionPopulated(
  document: AdminCollectionTransformationsPopulated["Lean"]
): AdminCollectionTransformationsPopulated["Frontend"] {
  const transformedDoc: AdminCollectionTransformationsPopulated["Raw"] =
    transformMongooseDoc<AdminCollectionTransformationsPopulated["Raw"]>(
      document
    );

  return transformedDoc;
}
