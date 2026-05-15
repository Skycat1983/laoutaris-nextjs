import { ArtworkModel, ArticleModel, CollectionModel } from "@/lib/data/models";
import mongoose from "mongoose";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { isNextError } from "@/lib/helpers/isNextError";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("artwork", "Invalid artwork ID");
  }

  let session: Awaited<ReturnType<typeof mongoose.startSession>> | undefined;

  try {
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    //  check if artwork is used in any articles
    const articleUsingArtwork = await ArticleModel.findOne({ artwork: id });
    if (articleUsingArtwork) {
      await session.abortTransaction();
      return apiErrorResponse({
        message: `Cannot delete artwork: It is currently used in a article with id ${articleUsingArtwork._id}`,
        error: "Cannot delete artwork: It is currently used in a article",
        status: 409,
      });
    }

    // if no articles are using it, proceed with deletion and updating collections
    const [deletedArtwork] = await Promise.all([
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
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });
    }

    await session.commitTransaction();
    return apiSuccessResponse(null, {
      message: "Artwork deleted and removed from collections successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      await session?.abortTransaction();
      throw error;
    }

    await session?.abortTransaction();
    console.error("Error in cascade delete:", error);
    return apiErrorResponse({
      message: "Failed to delete artwork",
      status: 500,
    });
  } finally {
    session?.endSession();
  }
}
