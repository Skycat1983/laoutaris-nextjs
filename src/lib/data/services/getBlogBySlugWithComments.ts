import "server-only";

import { BlogModel } from "@/lib/data/models/blogModel";
import type { BlogEntryPopulatedCommentsPopulatedFrontend, BlogEntryPopulatedCommentsPopulatedLean } from "@/lib/data/types/blogTypes";
import dbConnect from "@/lib/db/mongodb";
import { transformBlogPopulatedWithCommentsPopulated } from "@/lib/transforms/blog/transformBlog";

export const getBlogBySlugWithComments = async (
  slug: string
): Promise<BlogEntryPopulatedCommentsPopulatedFrontend | null> => {
  await dbConnect();

  const rawBlog = await BlogModel.findOne({ slug })
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .lean<BlogEntryPopulatedCommentsPopulatedLean>();

  if (!rawBlog) {
    return null;
  }

  return transformBlogPopulatedWithCommentsPopulated(rawBlog);
};
