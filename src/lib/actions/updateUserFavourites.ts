"use server";

import { getUserIdFromSession } from "../session/getUserIdFromSession";
import { ArtworkModel, UserModel } from "../data/models";
import dbConnect from "@/lib/db/mongodb";
import { revalidatePath } from "next/cache";
import { createServerLogger } from "@/lib/observability/logger";
import { accountFavouritesPath } from "@/lib/routes/accountRoutes";
import { artworkDetailPath } from "@/lib/routes/publicAppRoutes";
import type { FavouritesButtonState } from "@/components/elements/buttons/FavouritesButton";

const logger = createServerLogger({
  operation: "saved_item.favourites.update",
  surface: "server_action",
});

const getErrorForLog = (error: unknown) => {
  const logError = new Error("Saved item favourites action failed");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

export async function updateUserFavourites(
  prevState: FavouritesButtonState,
  formData: FormData
): Promise<FavouritesButtonState> {
  const artworkId = formData.get("artworkId");

  if (typeof artworkId !== "string" || !artworkId) {
    return {
      success: false,
      message: "User not logged in",
      isFavourited: prevState.isFavourited,
    };
  }

  try {
    const userId = await getUserIdFromSession();

    if (userId) {
      await dbConnect();

      const user = await UserModel.findOne({ _id: userId });
      const artwork = await ArtworkModel.findOne({ _id: artworkId });

      const isInFavourites = user?.favourites.includes(artworkId);
      const isInFavouritedBy = artwork?.favourited.includes(userId);

      if (isInFavourites !== isInFavouritedBy) {
        let discrepancyMessage = "Data integrity error: ";
        if (isInFavourites && !isInFavouritedBy) {
          discrepancyMessage +=
            "artwork is in user's favourites but user is not in artwork's favouritedBy list.";
        } else if (!isInFavourites && isInFavouritedBy) {
          discrepancyMessage +=
            "user is in artwork's favouritedBy list but artwork is not in user's favourites.";
        }

        return {
          success: false,
          message: discrepancyMessage,
          isFavourited: prevState.isFavourited,
        };
      }

      let updateUser;
      let updatedFavouritesStatus = false;
      if (isInFavourites) {
        updateUser = { $pull: { favourites: artworkId } };
        updatedFavouritesStatus = false;
      } else {
        updateUser = { $addToSet: { favourites: artworkId } };
        updatedFavouritesStatus = true;
      }

      let updateArtwork;
      if (isInFavouritedBy) {
        updateArtwork = { $pull: { favourited: userId } };
      } else {
        updateArtwork = { $addToSet: { favourited: userId } };
      }

      const [updatedUser, updatedArtwork] = await Promise.all([
        UserModel.findByIdAndUpdate(userId, updateUser, { new: true }),
        ArtworkModel.findByIdAndUpdate(artworkId, updateArtwork, { new: true }),
      ]);

      if (!updatedUser || !updatedArtwork) {
        logger.error("action.saved_item.favourites.update_incomplete", {
          action: "updateUserFavourites",
          savedItemType: "favourites",
          statusCategory: "mutation_incomplete",
          userUpdated: Boolean(updatedUser),
          artworkUpdated: Boolean(updatedArtwork),
        });

        return {
          success: false,
          message: "Failed to update favourites/favourited",
          isFavourited: prevState.isFavourited, // Return the original state if there's an error
        };
      }

      let successMessage = updatedFavouritesStatus
        ? "Added to favourites"
        : "Removed from favourites";

      revalidatePath(accountFavouritesPath());
      revalidatePath(accountFavouritesPath(artworkId));
      revalidatePath(artworkDetailPath(artworkId));

      return {
        success: true,
        message: successMessage,
        isFavourited: updatedFavouritesStatus,
      };
    } else {
      return {
        success: false,
        message: "User not logged in",
        isFavourited: prevState.isFavourited, // Return the original state if there's an error
      };
    }
  } catch (error) {
    logger.error("action.saved_item.favourites.failed", {
      action: "updateUserFavourites",
      savedItemType: "favourites",
      statusCategory: "unexpected_error",
      error: getErrorForLog(error),
    });

    return {
      success: false,
      message: "Internal Server Error",
      isFavourited: prevState.isFavourited, // Return the original state if there's an error
    };
  }
}
