import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import dbConnect from "@/lib/db/mongodb";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { RouteResponse } from "@/lib/api/core/createRoute";

export async function GET(req: NextRequest): Promise<RouteResponse> {
  const userId = await getUserIdFromSession();

  console.log("userId", userId);

  const blogId = "67b46c5a31b3f845bc8019d8";
  const blog = await BlogModel.findById(blogId);
  console.log("blog", blog);

  try {
    const rawUserWithoutPopulation = await UserModel.findById(userId)
      .select("comments")
      .lean()
      .exec();

    console.log(
      "Raw user without population:",
      JSON.stringify(rawUserWithoutPopulation, null, 2)
    );

    const rawUserComments = await UserModel.findById(userId)
      .select("comments")
      .populate({
        path: "comments",
        populate: {
          path: "blog",
          model: "Blog",
          select: "slug title imageUrl subtitle",
        },
      })
      .lean()
      .exec();

    if (!rawUserComments) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    console.log(
      "Raw user comments data in route.ts:",
      JSON.stringify(rawUserComments, null, 2)
    );

    const userComments =
      transformMongooseDoc<FrontendUserWithComments>(rawUserComments);

    console.log(
      "Transformed userComments in route.ts:",
      JSON.stringify(userComments, null, 2)
    );

    return NextResponse.json({
      success: true,
      data: userComments,
    } satisfies ApiSuccessResponse<FrontendUserWithComments>);
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
