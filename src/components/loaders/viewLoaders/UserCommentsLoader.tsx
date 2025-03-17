"use server";

import React from "react";
import { UserCommentsView } from "@/components/views/UserCommentsView";
import { serverApi } from "@/lib/api/serverApi";
import { ApiErrorResponse, CommentFrontendPopulated } from "@/lib/data/types";
import { ApiUserCommentsGetResult } from "@/lib/api/user/comments/fetchers";

type LoadUserComments = ApiUserCommentsGetResult | ApiErrorResponse;

export const UserCommentsLoader = async () => {
  const result: LoadUserComments =
    await serverApi.user.comments.getUserComments();
  if (!result.success) {
    throw new Error(result.error);
  }

  const comments = result.data as CommentFrontendPopulated[];

  return (
    <>
      <UserCommentsView comments={comments} />
    </>
  );
};
