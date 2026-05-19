import "server-only";

import { BlogModel } from "@/lib/data/models/blogModel";
import type { BlogEntryFrontendWithAuthor, BlogEntryLeanWithAuthor } from "@/lib/data/types/blogTypes";
import dbConnect from "@/lib/db/mongodb";
import { transformBlogWithAuthor } from "@/lib/transforms/blog/transformBlog";

export const getBlogBySlugWithAuthor = async (
  slug: string
): Promise<BlogEntryFrontendWithAuthor | null> => {
  await dbConnect();

  const rawBlog = await BlogModel.findOne({ slug })
    .populate("comments")
    .populate("author")
    .lean<BlogEntryLeanWithAuthor>();

  if (!rawBlog) {
    return null;
  }

  return transformBlogWithAuthor(rawBlog);
};
