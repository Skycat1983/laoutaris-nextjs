import React from "react";
import { UserCommentsView } from "@/components/views/UserCommentsView";
import { getOwnUserComments } from "@/lib/data/services/getOwnUserComments";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export const UserCommentsLoader = async () => {
  const userId = await getUserIdFromSession();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let result: Awaited<ReturnType<typeof getOwnUserComments>>;

  try {
    result = await getOwnUserComments(userId);
  } catch {
    throw new Error("Failed to fetch user comments");
  }

  if (!result) {
    throw new Error("User not found");
  }

  return (
    <>
      <UserCommentsView comments={result.comments} />
    </>
  );
};
