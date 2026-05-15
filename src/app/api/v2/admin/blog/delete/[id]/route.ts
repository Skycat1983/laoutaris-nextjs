import { BlogModel, CommentModel, UserModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import mongoose from "mongoose";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { isNextError } from "@/lib/helpers/isNextError";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("blog", "Invalid blog ID");
  }

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;

  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    // Find the blog and its comments
    const blog = await BlogModel.findById(id).session(session);
    if (!blog) {
      await session.abortTransaction();
      return apiErrorResponse({
        message: "Blog not found",
        status: 404,
      });
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

    return apiSuccessResponse(null, {
      message: "Blog and associated comments deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    // If anything fails, abort the transaction
    await session?.abortTransaction();
    console.error("Error in blog deletion transaction:", error);
    return apiErrorResponse({
      message: "Failed to delete blog and associated data",
      status: 500,
    });
  } finally {
    // Always end the session
    session?.endSession();
  }
}
