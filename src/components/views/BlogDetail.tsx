"use client";

import Image from "next/image";
import CommentForm from "@/components/modules/forms/user/CommentForm";
import { BlogCommentsList } from "@/components/sections";
import HorizontalDivider from "../elements/misc/HorizontalDivider";
import { useState } from "react";
import { clientApi } from "@/lib/api/clientApi";
import type { CreateCommentFormValues } from "@/lib/data/schemas/commentSchema";
import { Skeleton } from "../shadcn/skeleton";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { CommentFrontendPopulated } from "@/lib/data/types/commentTypes";
import {
  BlogEntryFrontendWithAuthor,
  BlogEntryPopulatedCommentsPopulatedFrontend,
} from "@/lib/data/types/blogTypes";

type WithComments = {
  showComments: true;
  blog: BlogEntryPopulatedCommentsPopulatedFrontend;
};

type WithoutComments = {
  showComments: false;
  blog: BlogEntryFrontendWithAuthor;
};

type BlogDetailProps = WithComments | WithoutComments;

const BlogDetail = ({ blog, showComments = false }: BlogDetailProps) => {
  const { title, subtitle, text, imageUrl, displayDate, slug } = blog;
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [populatedComments, setPopulatedComments] = useState<
    CommentFrontendPopulated[]
  >(showComments && "comments" in blog ? blog.comments : []);
  const [hasLoadedComments, setHasLoadedComments] = useState(showComments);
  const { openModal } = useGlobalFeatures();

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const result: Awaited<
        ReturnType<typeof clientApi.public.blog.singlePopulated>
      > = await clientApi.public.blog.singlePopulated(slug);
      if (result.success) {
        console.log("result", result);
        const { comments } = result.data;
        setPopulatedComments(comments);
        setHasLoadedComments(true);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
      openModal(
        <ModalMessage message="Failed to load comments" type="error" />
      );
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (comment: CreateCommentFormValues) => {
    try {
      const result = await clientApi.user.comments.createComment(comment);
      if (result.success) {
        loadComments();
        openModal(
          <ModalMessage message="Comment posted successfully" type="success" />
        );
      } else {
        openModal(
          <ModalMessage message="Failed to post comment" type="error" />
        );
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      openModal(<ModalMessage message="Failed to post comment" type="error" />);
    }
  };

  const handleCommentUpdated = async () => {
    await loadComments();
    openModal(
      <ModalMessage message="Comment updated successfully" type="success" />
    );
  };

  const handleCommentDeleted = async () => {
    await loadComments();
    openModal(
      <ModalMessage message="Comment deleted successfully" type="success" />
    );
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

        {/* Comments Section */}
        <div className="mt-12 border-t pt-8">
          {/* Comment Form should always be visible */}
          <h2 className="text-2xl font-special mb-6 text-center">
            Leave a Comment
          </h2>
          <CommentForm blogSlug={slug} onCommentSubmit={handleCommentSubmit} />
          <div className="my-8">
            <HorizontalDivider />
          </div>

          {/* Toggle comments visibility */}
          {!showComments && !hasLoadedComments ? (
            <button
              onClick={loadComments}
              className="w-full py-2 text-center text-gray-600 hover:text-gray-900"
            >
              Show Comments ({blog.commentCount})
            </button>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-special mb-6 text-center">
                Comments
              </h2>
              {isLoadingComments ? (
                <div className="animate-pulse">Loading comments...</div>
              ) : (
                <BlogCommentsList
                  comments={populatedComments}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogDetailSkeleton = () => {
  return (
    <div className="w-full md:w-3/4  xl:w-1/2 mx-auto shadow bg-white">
      <div className="relative h-[500px] w-full">
        <Skeleton className="w-full h-[500px]" />
      </div>
      <article className="prose-xl text-center p-24 bg-white fade-in mx-auto">
        {[...Array(15)].map((_, index) => (
          <Skeleton key={index} className="m-2 h-4 w-full mx-auto" />
        ))}
      </article>
    </div>
  );
};
export { BlogDetail, BlogDetailSkeleton };

// First, define what props we expect based on whether comments are populated

// interface BlogDetailUnpopulatedProps extends BlogDetailBaseProps {
//   showComments?: false;
// }

// interface BlogDetailPopulatedProps extends BlogDetailBaseProps {
//   showComments: true;
//   comments: CommentFrontend[];
// }

// type BlogDetailProps = BlogDetailUnpopulatedProps | BlogDetailPopulatedProps;
// AUTHOR INFO IF NEEDED
{
  /* <div className="flex flex-row w-full gap-4 justify-end items-center px-4">
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
        </div> */
}
{
  /* <div className="mb-4">
          <HorizontalDivider />
        </div> */
}
