import React from "react";
import { FrontendCommentWithBlogNav } from "@/lib/data/types/commentTypes";
import { UserCommentsView } from "@/components/views/UserCommentsView";
import { FrontendUserWithComments } from "@/lib/data/types/userTypes";
import { serverApi } from "@/lib/api/serverApi";

export const UserCommentsLoader = async () => {
  const result: ApiResponse<FrontendUserWithComments> =
    await serverApi.public.user.fetchUserComments();
  if (!result.success) {
    throw new Error(result.error);
  }

  const comments = result.data.comments as FrontendCommentWithBlogNav[];

  return (
    <>
      <UserCommentsView comments={comments} />
    </>
  );
};
