import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import mongoose from "mongoose";
import { isAdmin } from "@/lib/session/isAdmin";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  const { id } = params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog ID is required",
        } satisfies ApiErrorResponse,
        { status: 400 }
      );
    }

    // Find the blog and its comments
    const blog = await BlogModel.findById(id).session(session);
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    // If blog has comments, handle the cleanup
    if (blog.comments.length > 0) {
      // Find all comments for this blog
      const comments = await CommentModel.find({
        _id: { $in: blog.comments },
      }).session(session);

      // Get unique user IDs who made comments
      const userIds = Array.from(
        new Set(comments.map((comment) => comment.author))
      );

      // Remove comment IDs from users' comments arrays
      await UserModel.updateMany(
        { _id: { $in: userIds } },
        { $pull: { comments: { $in: blog.comments } } },
        { session }
      );

      // Delete all comments
      await CommentModel.deleteMany({
        _id: { $in: blog.comments },
      }).session(session);
    }

    // Finally delete the blog
    await BlogModel.findByIdAndDelete(id).session(session);

    // If everything succeeded, commit the transaction
    await session.commitTransaction();

    return NextResponse.json({
      success: true,
      data: null,
      message: "Blog and associated comments deleted successfully",
    } satisfies DeleteDocumentResult);
  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    console.error("Error in blog deletion transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog and associated data",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  } finally {
    // Always end the session
    session.endSession();
  }
}
