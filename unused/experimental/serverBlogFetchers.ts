import { headers } from "next/headers";
import { createBlogWithCommentAuthorFetch } from "./blogFetchers";

export const fetchBlogWithCommentAuthor = createBlogWithCommentAuthorFetch(
  // URL generator for server
  (slug) => `${process.env.BASEURL}/api/v2/blog/${slug}/comments/author`,
  // Headers for server
  () => headers()
);

export const server = {
  fetchBlogWithCommentAuthor,
};
