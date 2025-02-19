"use client";

import { createBlogWithCommentAuthorFetch } from "./blogFetchers";

const fetchBlogWithCommentAuthor = createBlogWithCommentAuthorFetch(
  // Uses relative URL for client-side
  (slug) => `/api/v2/blog/${slug}/comments/author`,
  // Simple headers for client
  () => ({ "Content-Type": "application/json" })
);

export const client = {
  fetchBlogWithCommentAuthor,
};
