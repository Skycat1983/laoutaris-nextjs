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
    return adminDeleteInvalidIdResponse("comment", "Invalid comment ID");
  }

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;

  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    // Find the comment first to get user and blog IDs
    const comment = await CommentModel.findById(id).session(session);
    if (!comment) {
      await session.abortTransaction();
      return apiErrorResponse({
        message: "Comment not found",
        status: 404,
      });
    }

    // Remove comment ID from user's comments array
    await UserModel.findByIdAndUpdate(
      comment.author,
      { $pull: { comments: comment._id } },
      { session }
    );

    // Remove comment ID from blog's comments array
    await BlogModel.findByIdAndUpdate(
      comment.blog,
      { $pull: { comments: comment._id } },
      { session }
    );

    // Finally delete the comment
    await CommentModel.findByIdAndDelete(id).session(session);

    // If everything succeeded, commit the transaction
    await session.commitTransaction();

    return apiSuccessResponse(null, {
      message: "Comment deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    // If anything fails, abort the transaction
    await session?.abortTransaction();
    console.error("Error in comment deletion transaction:", error);
    return apiErrorResponse({
      message: "Failed to delete comment",
      status: 500,
    });
  } finally {
    // Always end the session
    session?.endSession();
  }
}
