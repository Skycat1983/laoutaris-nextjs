import { fetchUserComments } from "@/lib/api/public/userApi";
import React from "react";

const UserCommentsLoader = async () => {
  const result = await fetchUserComments();
  if (!result.success) {
    throw new Error(result.error);
  }
  console.log("result", result.data.comments);
  return <div>UserCommentsLoader</div>;
};

export default UserCommentsLoader;
