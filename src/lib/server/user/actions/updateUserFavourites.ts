"use server";

import { getUserIdFromSession } from "../session/getUserIdFromSession";
import { ArtworkModel, UserModel } from "../../models";
import { delay } from "@/utils/debug";
import { revalidatePath } from "next/cache";
import { FavouritesButtonState } from "@/components/ui/atoms/buttons/FavouritesButton";

export async function updateUserFavourites(
  prevState: FavouritesButtonState,
  formData: FormData
): Promise<FavouritesButtonState> {
  const artworkId = formData.get("artworkId") as string;

  await delay(1000); // Simulate a delay for debugging purposes

  try {
    const userId = await getUserIdFromSession();

    if (userId && artworkId) {
      const user = await UserModel.findOne({ _id: userId });
      const artwork = await ArtworkModel.findOne({ _id: artworkId });
      console.log("user in updateuser favaourites", user);
      console.log("artwork in updateuser favaourites", artwork);

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
        return {
          success: false,
          message: "Failed to update favourites/favourited",
          isFavourited: prevState.isFavourited, // Return the original state if there's an error
        };
      }

      let successMessage = updatedFavouritesStatus
        ? "Added to favourites"
        : "Removed from favourites";

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
    console.error("Error updating favourites:", error);
    return {
      success: false,
      message: "Internal Server Error",
      isFavourited: prevState.isFavourited, // Return the original state if there's an error
    };
  }
}
