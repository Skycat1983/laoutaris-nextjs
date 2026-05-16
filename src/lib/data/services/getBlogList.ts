import "server-only";

import type { FilterQuery } from "mongoose";
import { BlogModel, type BlogEntryDB } from "@/lib/data/models/blogModel";
import type { ListResult } from "@/lib/data/types";
import type {
  BlogEntryFrontend,
  BlogEntryLean,
} from "@/lib/data/types/blogTypes";
import dbConnect from "@/lib/db/mongodb";
import { transformBlog } from "@/lib/transforms/blog/transformBlog";

export const BLOG_LIST_SORT_OPTIONS = [
  "latest",
  "oldest",
  "popular",
  "featured",
] as const;

export type BlogListSortBy = (typeof BLOG_LIST_SORT_OPTIONS)[number];

export interface GetBlogListParams {
  sortby?: BlogListSortBy;
  page?: number;
  limit?: number;
}

export type BlogListServiceResult = ListResult<BlogEntryFrontend>;

export const isBlogListSortBy = (sortby: string): sortby is BlogListSortBy =>
  BLOG_LIST_SORT_OPTIONS.includes(sortby as BlogListSortBy);

const buildBlogListQuery = (sortby: BlogListSortBy) => {
  const filterQuery: FilterQuery<BlogEntryDB> = {};
  const sortQuery: Record<string, 1 | -1> = {};

  switch (sortby) {
    case "latest":
      sortQuery.displayDate = -1;
      break;
    case "oldest":
      sortQuery.displayDate = 1;
      break;
    case "popular":
      sortQuery.comments = -1;
      break;
    case "featured":
      filterQuery.featured = true;
      sortQuery.displayDate = -1;
      break;
  }

  return { filterQuery, sortQuery };
};

export const getBlogList = async ({
  sortby = "latest",
  page = 1,
  limit = 10,
}: GetBlogListParams = {}): Promise<BlogListServiceResult> => {
  await dbConnect();

  const { filterQuery, sortQuery } = buildBlogListQuery(sortby);
  const [rawBlogs, total] = await Promise.all([
    BlogModel.find(filterQuery)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<BlogEntryLean[]>(),
    BlogModel.countDocuments(filterQuery),
  ]);

  const blogs = rawBlogs.map((blog) => transformBlog.toFrontend(blog));

  return {
    success: true,
    data: blogs,
    metadata: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
