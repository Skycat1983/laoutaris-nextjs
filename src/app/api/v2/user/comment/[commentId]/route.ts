import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { isValidObjectId } from "mongoose";
import { CommentModel, UserModel, BlogModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import dbConnect from "@/lib/db/mongodb";
import { transformCommentPopulated } from "@/lib/transforms";
import {
  ApiErrorResponse,
  CommentLeanPopulated,
} from "@/lib/data/types";
import { ApiUserCommentUpdateResult } from "@/lib/api/user/comments/fetchers";
import {
  updateCommentRouteBodySchema,
  updateCommentRouteParamsSchema,
  type UpdateCommentRouteBody,
  type UpdateCommentRouteParams,
} from "@/lib/data/schemas/commentSchema";

type CommentUpdateFieldErrors = Partial<
  Record<
    keyof (UpdateCommentRouteBody & UpdateCommentRouteParams),
    string[] | undefined
  >
>;

type CommentValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: CommentUpdateFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: CommentUpdateFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<CommentValidationErrorResponse>(
    {
      success: false,
      error: "Invalid comment input",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
  );

export async function PATCH(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const parsedParams = updateCommentRouteParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    const { fieldErrors, formErrors } = parsedParams.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return validationErrorResponse({}, ["Request body must be valid JSON."]);
  }

  const parsedBody = updateCommentRouteBodySchema.safeParse(body);

  if (!parsedBody.success) {
    const { fieldErrors, formErrors } = parsedBody.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    const { commentId } = parsedParams.data;
    const { text } = parsedBody.data;

    const comment = await CommentModel.findById(commentId).populate("author");
    if (!comment) {
      return errorResponse("Comment not found", 404);
    }

    if (comment.author._id.toString() !== userId) {
      return errorResponse("Not authorized to edit this comment", 403);
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: { text } },
      { new: true, runValidators: true }
    )
      .populate([
        { path: "author", model: "User" },
        { path: "blog", model: "Blog" },
      ])
      .lean<CommentLeanPopulated>();

    if (!updatedComment) {
      return errorResponse("Comment not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: transformCommentPopulated(updatedComment, userId),
    } satisfies ApiUserCommentUpdateResult);
  } catch (error) {
    console.error("Error updating comment:", error);
    return errorResponse("Failed to update comment", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await dbConnect();

    // Check authentication
    const authSession = await getServerSession(authOptions);
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { commentId } = params;

    // Validate ObjectId
    if (!isValidObjectId(commentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid comment ID" },
        { status: 400 }
      );
    }

    // Start transaction
    const mongoSession = await CommentModel.startSession();
    mongoSession.startTransaction();

    try {
      // Find comment and verify ownership
      const comment = await CommentModel.findById(commentId)
        .populate("author")
        .session(mongoSession);

      if (!comment) {
        await mongoSession.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Comment not found" },
          { status: 404 }
        );
      }

      if (comment.author._id.toString() !== authSession.user.id) {
        await mongoSession.abortTransaction();
        return NextResponse.json(
          { success: false, message: "Not authorized to delete this comment" },
          { status: 403 }
        );
      }

      // Get the blog ID before deleting the comment
      const blogId = comment.blog;

      // 1. Delete the comment
      await CommentModel.findByIdAndDelete(commentId).session(mongoSession);

      // 2. Remove comment from user's comments array
      await UserModel.findByIdAndUpdate(
        comment.author._id,
        { $pull: { comments: commentId } },
        { session: mongoSession }
      );

      // 3. Remove comment from blog's comments array
      await BlogModel.findByIdAndUpdate(
        blogId,
        { $pull: { comments: commentId } },
        { session: mongoSession }
      );

      // Commit the transaction
      await mongoSession.commitTransaction();

      return NextResponse.json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      await mongoSession.abortTransaction();
      throw error;
    } finally {
      mongoSession.endSession();
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
