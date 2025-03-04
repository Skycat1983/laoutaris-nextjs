import {
  ArtworkModel,
  BlogModel,
  CommentModel,
  UserModel,
} from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import type { DeleteResponse } from "@/lib/api/admin/delete/fetchers";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json<DeleteResponse>(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Find the user first
    const user = await UserModel.findById(id).session(session);
    if (!user) {
      return NextResponse.json<DeleteResponse>(
        {
          success: false,
          error: "User not found",
        },
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

    return NextResponse.json<DeleteResponse>({
      success: true,
      data: null,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    console.error("Error in user deletion transaction:", error);
    return NextResponse.json<DeleteResponse>(
      {
        success: false,
        error: "Failed to delete user and associated data",
      },
      { status: 500 }
    );
  } finally {
    // Always end the session
    session.endSession();
  }
}
