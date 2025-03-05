import { NextResponse } from "next/server";
import { ArtworkModel, ArticleModel, CollectionModel } from "@/lib/data/models";
import mongoose from "mongoose";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<ApiResponse<DeleteDocumentResult>> {
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
  const session = await mongoose.startSession();
  session.startTransaction();
  const { id } = params;

  try {
    //  check if artwork is used in any articles
    const articleUsingArtwork = await ArticleModel.findOne({ artwork: id });
    if (articleUsingArtwork) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete artwork: It is currently used in a article with id ${articleUsingArtwork._id}`,
          error: "Cannot delete artwork: It is currently used in a article",
        } satisfies ApiErrorResponse,
        { status: 409 }
      );
    }

    // if no articles are using it, proceed with deletion and updating collections
    const [deletedArtwork, updatedCollections] = await Promise.all([
      // Delete the artwork
      ArtworkModel.findByIdAndDelete(id).session(session),

      // Remove artwork from collections' artworks arrays
      CollectionModel.updateMany(
        { artworks: id },
        { $pull: { artworks: id } }
      ).session(session),
    ]);

    if (!deletedArtwork) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          message: "Artwork not found",
          error: "Artwork not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({
      success: true,
      message: "Artwork deleted and removed from collections successfully",
      data: null,
    } satisfies DeleteDocumentResult);
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in cascade delete:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete artwork",
        error: "Failed to delete artwork",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
