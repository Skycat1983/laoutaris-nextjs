import { FrontendCommentWithBlogNav } from "@/lib/data/types/commentTypes";
import React from "react";
import { CommentCard } from "../modules/cards/CommentCard";
import Link from "next/link";

type Props = {
  comments: FrontendCommentWithBlogNav[];
};

const UserCommentsView = ({ comments }: Props) => {
  const blogLink = (comment: FrontendCommentWithBlogNav) =>
    `/blog/${comment.blog.slug}`;
  console.log("comments", comments);
  return (
    <>
      <div className="space-y-6 mt-8">
        {comments.map((comment, index) => (
          <Link key={index} href={blogLink(comment)}>
            <CommentCard key={index} comment={comment} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default UserCommentsView;
