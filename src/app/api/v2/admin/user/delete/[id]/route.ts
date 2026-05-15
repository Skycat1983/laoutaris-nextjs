import {
  ArtworkModel,
  BlogModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import mongoose from "mongoose";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";

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
    return adminDeleteInvalidIdResponse("user", "Invalid user ID");
  }

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;

  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    // Find the user first
    const user = await UserModel.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      data: null,
      message: "User and associated data deleted successfully",
    } satisfies DeleteDocumentResult);
  } catch (error) {
    // If anything fails, abort the transaction
    await session?.abortTransaction();
    console.error("Error in user deletion transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user and associated data",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  } finally {
    // Always end the session
    session?.endSession();
  }
}
