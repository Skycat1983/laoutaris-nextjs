"use client";

import Image from "next/image";
import CommentForm from "@/components/forms/CommentForm";
import { createComment } from "@/lib/api/public/commentApi";
import type { FrontendBlogEntryWithComments } from "@/lib/data/types/blogTypes";
import BlogCommentsList from "../sections/BlogCommentsList";
import HorizontalDivider from "../elements/misc/HorizontalDivider";

const BlogDetail = ({
  title,
  subtitle,
  text,
  imageUrl,
  displayDate,
  slug,
  comments,
}: FrontendBlogEntryWithComments) => {
  console.log("comments", comments);
  const handleCommentSubmit = async (commentText: string) => {
    try {
      const result = await createComment(slug, commentText);
      console.log(result);
      // TODO: Implement real-time updates or refresh comments
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const paragraphs = text.replace(/\r\n/g, "\n").split(/\n\n+/);

  return (
    <div className="w-full md:w-3/4  xl:w-1/2 mx-auto shadow bg-white">
      <div className="relative h-[500px] w-full">
        <Image
          src={imageUrl}
          alt="Blog post cover"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Centered white text */}
        <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-16 ml-12 border-l-4 border-white">
          <h1 className="text-5xl font-bold mb-2">{title}</h1>
          <h2 className="text-2xl mb-4">{subtitle}</h2>
          <p className="text-sm">
            {new Date(displayDate).toLocaleDateString("en-GB")}{" "}
            {/* DD/MM/YYYY */}
          </p>
        </div>
      </div>

      {/* Blog content and comments go below */}
      <div className="p-12">
        {/* <div className="flex flex-row w-full gap-4 justify-end items-center px-4">
          <div className="flex flex-col justify-start items-end ml-4">
            <h1 className="text-2xl font-bold font-cormorant">
              Heron Laoutaris
            </h1>
            <h2 className="text-neutral-500 ">Grandson</h2>
          </div>
          <div className="h-16 w-16">
            <Image
              src="https://res.cloudinary.com/dzncmfirr/image/upload/v1723539243/user-images/heron_drr8t3.png"
              alt="avatar"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        </div> */}
        {/* <div className="mb-4">
          <HorizontalDivider />
        </div> */}
        <article className="prose-xl text-left fade-in">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`m-2 leading-8 py-2 ${index === 0 ? "drop-cap" : ""}`}
            >
              {paragraph.trim()}
            </p>
          ))}
        </article>

        {/* Comment Form & CommentsList here */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-special mb-6 text-center">Comments</h2>
          <CommentForm blogSlug={slug} onCommentSubmit={handleCommentSubmit} />
        </div>
        <div className="mt-12 border-t pt-8">
          <BlogCommentsList comments={comments} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
