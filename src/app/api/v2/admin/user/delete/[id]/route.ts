import {
  ArtworkModel,
  BlogModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
import { NextRequest } from "next/server";
import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import mongoose from "mongoose";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
  validateAdminDeleteEvidenceRequest,
} from "@/lib/api/admin/delete/routeValidation";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("user", "Invalid user ID");
  }

  const evidenceValidationResponse = await validateAdminDeleteEvidenceRequest(
    request,
    "user"
  );
  if (evidenceValidationResponse) {
    return evidenceValidationResponse;
  }

  if (id === admin.userId) {
    return apiErrorResponse({
      message: "Cannot delete the current admin account",
      status: 403,
    });
  }

  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/user/delete/[id]"
  );
  const logger = createApiLogger(requestContext);

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;

  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    // Find the user first
    const user = await UserModel.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    if (user.role === "admin") {
      const adminCount = await UserModel.countDocuments({
        role: "admin",
      }).session(session);

      if (adminCount <= 1) {
        await session.abortTransaction();
        return apiErrorResponse({
          message: "Cannot delete the last remaining admin account",
          status: 409,
        });
      }
    }

    // 1. Handle user's comments
    if (user.comments.length > 0) {
      // Get all comments by this user
      const comments = await CommentModel.find({
        _id: { $in: user.comments },
      }).session(session);

      // Get unique blog IDs that have comments from this user
      const blogIds = Array.from(
        new Set(comments.map((comment) => comment.blog))
      );

      // Remove comment IDs from all affected blogs
      await BlogModel.updateMany(
        { _id: { $in: blogIds } },
        { $pull: { comments: { $in: user.comments } } },
        { session }
      );

      // Delete all comments by this user
      await CommentModel.deleteMany({
        _id: { $in: user.comments },
      }).session(session);
    }

    // 2. Handle user's watchlist
    if (user.watchlist.length > 0) {
      await ArtworkModel.updateMany(
        { _id: { $in: user.watchlist } },
        { $pull: { watcherlist: user._id } },
        { session }
      );
    }

    // 3. Handle user's favourites
    if (user.favourites.length > 0) {
      await ArtworkModel.updateMany(
        { _id: { $in: user.favourites } },
        { $pull: { favourited: user._id } },
        { session }
      );
    }

    // 4. Finally delete the user
    await UserModel.findByIdAndDelete(id).session(session);

    // If everything succeeded, commit the transaction
    await session.commitTransaction();

    return apiSuccessResponse(null, {
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    // If anything fails, abort the transaction
    await session?.abortTransaction();
    logger.error("api.admin.user_delete.failed", {
      operation: "admin.user.delete",
      error,
      errorLabel: "admin_user_delete_failed",
    });
    return apiErrorResponse({
      message: "Failed to delete user and associated data",
      status: 500,
      requestId: requestContext.requestId,
    });
  } finally {
    // Always end the session
    session?.endSession();
  }
}
