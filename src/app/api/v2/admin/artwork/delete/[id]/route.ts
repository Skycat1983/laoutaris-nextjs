import { NextResponse } from "next/server";
import {
  ArtworkModel,
  ArticleModel,
  CollectionModel,
} from "@/lib/server/models";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = params;

    //  check if artwork is used in any articles
    const articleUsingArtwork = await ArticleModel.findOne({ artwork: id });
    if (articleUsingArtwork) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete artwork: It is currently used in an article",
          articleId: articleUsingArtwork._id,
        },
        { status: 409 } // conflict status code
      );
    }
    console.log("reminder to update user favourites!!!! ");

    // if no articles are using it, proceed with deletion and updating collections
    const [deletedArtwork, updatedCollections] = await Promise.all([
      // Delete the artwork
      ArtworkModel.findByIdAndDelete(id).session(session),

      // Remove artwork from collections' artworks arrays
      CollectionModel.updateMany(
        { artworks: id },
        { $pull: { artworks: id } }
      ).session(session),

      // Could add more array-based references here (e.g., user favorites)
      // UserModel.updateMany(
      //   { favorites: id },
      //   { $pull: { favorites: id } }
      // ).session(session),
    ]);

    if (!deletedArtwork) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "Artwork not found" },
        { status: 404 }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({
      success: true,
      message: "Artwork deleted and removed from collections successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in cascade delete:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete artwork" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
