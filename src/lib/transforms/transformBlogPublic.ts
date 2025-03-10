import {
  AdminBlogTransformations,
  AdminCommentTransformations,
  AdminUserTransformations,
  BlogEntryTransformations,
  CommentTransformations,
  UserTransformations,
} from "../data/types";
import { transformMongooseDoc } from "./transformMongooseDoc";

export function transformBlog(
  document: BlogEntryTransformations["Lean"]
): BlogEntryTransformations["Frontend"] {
  const transformedDoc: BlogEntryTransformations["Raw"] =
    transformMongooseDoc<BlogEntryTransformations["Raw"]>(document);

  return transformedDoc;
}

export function transformBlogPopulated(
  document: BlogEntryTransformations["Lean"] & {
    author: UserTransformations["Lean"];
    comments: CommentTransformations["Lean"][];
  }
): AdminBlogTransformations["Populated"] {
  const { author, comments, ...rest } = document;

  // Transform the base document
  const transformedBlog: AdminBlogTransformations["Raw"] =
    transformMongooseDoc<AdminBlogTransformations["Raw"]>(rest);

  // Transform the author
  const transformedAuthor: AdminUserTransformations["Raw"] =
    transformMongooseDoc<AdminUserTransformations["Raw"]>(author);

  // Transform the comments array
  const transformedComments: AdminCommentTransformations["Raw"][] =
    comments.map((comment) =>
      transformMongooseDoc<AdminCommentTransformations["Raw"]>(comment)
    );

  return {
    ...transformedBlog,
    author: transformedAuthor,
    comments: transformedComments,
  } satisfies AdminBlogTransformations["Populated"];
}
