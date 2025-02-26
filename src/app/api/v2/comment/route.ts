import { NextRequest, NextResponse } from "next/server";
import { CommentModel, BlogModel, UserModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

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
      } satisfies ApiSuccessResponse<(typeof comment)[0]>);
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
