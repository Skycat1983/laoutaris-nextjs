"use server";

import { getUserIdFromSession } from "../session/getUserIdFromSession";
import { ArtworkModel, UserModel } from "../data/models";
import dbConnect from "@/lib/db/mongodb";
import { revalidatePath } from "next/cache";
import { createServerLogger } from "@/lib/observability/logger";
import { accountWatchlistPath } from "@/lib/routes/accountRoutes";
import { artworkDetailPath } from "@/lib/routes/publicAppRoutes";
import type { WatchlistButtonState } from "@/components/elements/buttons/WatchlistButton";

const logger = createServerLogger({
  operation: "saved_item.watchlist.update",
  surface: "server_action",
});

const getErrorForLog = (error: unknown) => {
  const logError = new Error("Saved item watchlist action failed");
  logError.name = error instanceof Error ? error.name : "UnknownError";

  return logError;
};

export async function updateUserWatchlist(
  prevState: WatchlistButtonState,
  formData: FormData
): Promise<WatchlistButtonState> {
  const artworkId = formData.get("artworkId");

  if (typeof artworkId !== "string" || !artworkId) {
    return {
      success: false,
      message: "User not logged in",
      isWatchlisted: prevState.isWatchlisted,
    };
  }

  try {
    const userId = await getUserIdFromSession();

    if (userId) {
      await dbConnect();

      const user = await UserModel.findOne({ _id: userId });
      const artwork = await ArtworkModel.findOne({ _id: artworkId });

      const isInWatchlist = user?.watchlist.includes(artworkId);
      const isInWatcherlist = artwork?.watcherlist.includes(userId);

      if (isInWatchlist !== isInWatcherlist) {
        let discrepancyMessage = "Data integrity error: ";
        if (isInWatchlist && !isInWatcherlist) {
          discrepancyMessage +=
            "artwork is in user's watchlist but user is not in artwork's watcherlist.";
        } else if (!isInWatchlist && isInWatcherlist) {
          discrepancyMessage +=
            "user is in artwork's watcherlist but artwork is not in user's watchlist.";
        }

        return {
          success: false,
          message: discrepancyMessage,
          isWatchlisted: prevState.isWatchlisted, // Return the original state if there's an error
        };
      }

      let updateUser;
      let updatedWatchlistStatus = false;
      if (isInWatchlist) {
        updateUser = { $pull: { watchlist: artworkId } };
        updatedWatchlistStatus = false;
      } else {
        updateUser = { $addToSet: { watchlist: artworkId } };
        updatedWatchlistStatus = true;
      }

      let updateArtwork;
      if (isInWatcherlist) {
        updateArtwork = { $pull: { watcherlist: userId } };
      } else {
        updateArtwork = { $addToSet: { watcherlist: userId } };
      }

      const [updatedUser, updatedArtwork] = await Promise.all([
        UserModel.findByIdAndUpdate(userId, updateUser, { new: true }),
        ArtworkModel.findByIdAndUpdate(artworkId, updateArtwork, { new: true }),
      ]);

      if (!updatedUser || !updatedArtwork) {
        logger.error("action.saved_item.watchlist.update_incomplete", {
          action: "updateUserWatchlist",
          savedItemType: "watchlist",
          statusCategory: "mutation_incomplete",
          userUpdated: Boolean(updatedUser),
          artworkUpdated: Boolean(updatedArtwork),
        });

        return {
          success: false,
          message: "Failed to update watchlist/watcherlist",
          isWatchlisted: prevState.isWatchlisted, // Return the original state if there's an error
        };
      }

      let successMessage = updatedWatchlistStatus
        ? "Added to watchlist"
        : "Removed from watchlist";

      revalidatePath(accountWatchlistPath());
      revalidatePath(accountWatchlistPath(artworkId));
      revalidatePath(artworkDetailPath(artworkId));

      return {
        success: true,
        message: successMessage,
        isWatchlisted: updatedWatchlistStatus,
      };
    } else {
      return {
        success: false,
        message: "User not logged in",
        isWatchlisted: prevState.isWatchlisted, // Return the original state if there's an error
      };
    }
  } catch (error) {
    logger.error("action.saved_item.watchlist.failed", {
      action: "updateUserWatchlist",
      savedItemType: "watchlist",
      statusCategory: "unexpected_error",
      error: getErrorForLog(error),
    });

    return {
      success: false,
      message: "Internal Server Error",
      isWatchlisted: prevState.isWatchlisted, // Return the original state if there's an error
    };
  }
}
