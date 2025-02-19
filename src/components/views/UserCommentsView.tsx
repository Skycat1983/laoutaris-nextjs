"use client";

import { FrontendCommentWithBlogNav } from "@/lib/data/types/commentTypes";
import React from "react";
import { CommentCard } from "../modules/cards/CommentCard";
import Link from "next/link";
import { formatDateImproved } from "@/lib/utils/formatDate";
import Image from "next/image";

type Props = {
  comments: FrontendCommentWithBlogNav[];
};

// v2 or v4

const UserCommentsView = ({ comments }: Props) => {
  const blogLink = (comment: FrontendCommentWithBlogNav) =>
    `/blog/${comment.blog.slug}`;
  console.log("comments", comments);

  // Group comments by blog slug
  const commentsByBlog = comments.reduce((acc, comment) => {
    const blogSlug = comment.blog.slug;
    if (!acc[blogSlug]) {
      acc[blogSlug] = [];
    }
    acc[blogSlug].push(comment);
    return acc;
  }, {} as Record<string, FrontendCommentWithBlogNav[]>);

  // Helper function to check if the current comment is the first comment for the blog
  const isFirstCommentForBlog = (
    blogSlug: string,
    commentIndex: number
  ): boolean => {
    return commentIndex === 0;
  };

  const withPlaceholderUsername = (comment: FrontendCommentWithBlogNav) => {
    return {
      ...comment,
      author: {
        username: "Anonymous",
      },
    };
  };
  return (
    <>
      <div className="space-y-8 mt-8 border border-gray-600 rounded-lg p-4 container mx-auto max-w-3xl p-16 bg-gray-200">
        {/* Loopingeach blog's comments */}
        {Object.entries(commentsByBlog).map(([blogSlug, blogComments]) => (
          <div key={blogSlug} className="space-y-4">
            <div className="relative h-[200px] w-full">
              <Link href={blogLink(blogComments[0])}>
                <Image
                  src={blogComments[0].blog.imageUrl}
                  alt="Blog post cover"
                  layout="fill"
                  objectFit="cover"
                  className="z-0"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {/* Centered white text */}
                <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-16">
                  {/*  the blog title if the first comment */}
                  {isFirstCommentForBlog(blogSlug, 0) && (
                    <>
                      <h2 className="text-3xl font-bold text-whitish mb-4 max-w-2xl mx-auto border-b pb-4">
                        {blogComments[0].blog.title}
                      </h2>
                      <p className="text-sm mx-auto">
                        {blogComments[0].blog.subtitle}
                      </p>
                    </>
                  )}
                </div>
              </Link>
            </div>

            {/* comments for the current blog */}
            {blogComments.map((comment, index) => (
              // <Link key={comment._id} href={blogLink(comment)}>
              <CommentCard
                key={comment._id}
                comment={withPlaceholderUsername(comment)}
              />
              // </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default UserCommentsView;
