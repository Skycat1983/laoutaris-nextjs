import { fetchUserComments } from "@/lib/api/public/userApi";
import React from "react";
import { FrontendCommentWithBlogNav } from "@/lib/data/types/commentTypes";
import UserCommentsView from "@/components/views/UserCommentsView";

const UserCommentsLoader = async () => {
  const result = await fetchUserComments();
  if (!result.success) {
    throw new Error(result.error);
  }

  const blogLink = (comment: FrontendCommentWithBlogNav) =>
    `/blog/${comment.blog.slug}`;

  return (
    <>
      <UserCommentsView comments={result.data.comments} />
    </>
  );
};

export default UserCommentsLoader;
