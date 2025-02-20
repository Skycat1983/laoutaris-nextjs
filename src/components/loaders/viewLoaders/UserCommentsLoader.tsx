import { fetchUserComments } from "../../../../phase_out/userApi";
import React from "react";
import { FrontendCommentWithBlogNav } from "@/lib/data/types/commentTypes";
import UserCommentsView from "@/components/views/UserCommentsView";
import { FrontendUserWithComments } from "@/lib/data/types/userTypes";

const UserCommentsLoader = async () => {
  const result: ApiResponse<FrontendUserWithComments> =
    await fetchUserComments();
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

export default UserCommentsLoader;
