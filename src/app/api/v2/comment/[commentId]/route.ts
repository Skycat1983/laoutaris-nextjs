import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { isValidObjectId } from "mongoose";
import { CommentModel, UserModel, BlogModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import dbConnect from "@/lib/db/mongodb";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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

    // Get update data from request body
    const { text } = await request.json();
    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment text is required" },
        { status: 400 }
      );
    }

    // Find comment and verify ownership
    const comment = await CommentModel.findById(commentId).populate("author");
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.author._id.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized to edit this comment" },
        { status: 403 }
      );
    }

    // Update the comment
    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { $set: { text } },
      { new: true } // Return the updated document
    ).populate("author");

    return NextResponse.json({
      success: true,
      data: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update comment" },
      { status: 500 }
    );
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
