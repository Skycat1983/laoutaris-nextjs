import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import {
  ApiErrorResponse,
  CommentLeanPopulated,
  RouteResponse,
  CommentFrontendPopulated,
} from "@/lib/data/types";
import {
  ApiUserCommentsGetResult,
  ApiUserCommentCreateResult,
} from "@/lib/api/user/comments/fetchers";
import dbConnect from "@/lib/db/mongodb";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { transformCommentPopulated } from "@/lib/transforms";

interface UserWithComentsLean {
  _id: string;
  comments: CommentLeanPopulated[];
}

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiUserCommentsGetResult>> {
  const userId = await getUserIdFromSession();

  try {
    const rawUserComments = await UserModel.findById(userId)
      .select("comments")
      .populate({
        path: "comments",
        populate: [
          {
            path: "blog",
            model: "Blog",
          },
          {
            path: "author",
            model: "User",
          },
        ],
      })
      .lean<UserWithComentsLean>();

    if (!rawUserComments) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const { comments, ...user } = rawUserComments as UserWithComentsLean;

    const frontendComments: CommentFrontendPopulated[] = comments.map(
      (comment) => {
        return transformCommentPopulated(comment);
      }
    );

    return NextResponse.json({
      success: true,
      data: frontendComments,
      metadata: {
        total: comments.length,
        page: 1,
        limit: comments.length,
        totalPages: 1,
      },
    } satisfies ApiUserCommentsGetResult);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user comments",
    } satisfies ApiErrorResponse);
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  console.log("in comment route");
  const userId = await getUserIdFromSession();
  console.log("userId", userId);

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: "Authentication required",
      statusCode: 401,
    } satisfies ApiErrorResponse);
  }

  try {
    const comment = await req.json();
    const { blogSlug, text } = comment;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const blog = await BlogModel.findOne({ slug: blogSlug });

      if (!blog) {
        await session.abortTransaction();
        return NextResponse.json({
          success: false,
          error: "Blog not found",
          statusCode: 404,
        } satisfies ApiErrorResponse);
      }

      // Create the comment
      const comment = await CommentModel.create(
        [
          {
            text,
            author: userId,
            blog: blog._id,
            displayDate: new Date(),
          },
        ],
        { session }
      );

      // Update blog with new comment
      await BlogModel.findByIdAndUpdate(
        blog._id,
        { $push: { comments: comment[0]._id } },
        { session }
      );

      // Update user's comments array
      await UserModel.findByIdAndUpdate(
        userId,
        { $push: { comments: comment[0]._id } },
        { session }
      );

      await session.commitTransaction();

      return NextResponse.json({
        success: true,
        data: comment[0],
      } satisfies ApiUserCommentCreateResult);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to create comment",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
}
