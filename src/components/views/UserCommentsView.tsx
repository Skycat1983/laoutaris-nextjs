import { FrontendCommentWithBlogNav } from "@/lib/data/types/commentTypes";
import React from "react";
import { CommentCard } from "../modules/cards/CommentCard";

type Props = {
  comments: FrontendCommentWithBlogNav[];
};

const UserCommentsView = ({ comments }: Props) => {
  console.log("comments", comments);
  return (
    <>
      <div className="space-y-6 mt-8">
        {comments.map((comment, index) => (
          <CommentCard key={index} comment={comment} />
        ))}
      </div>
    </>
  );
};

export default UserCommentsView;
