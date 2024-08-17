"use server";

import dbConnect from "@/utils/mongodb";
import { updateUserWatchlist } from "../data-fetching/updateUserWatchlist";
import { getServerSession } from "next-auth";

interface AddToFavouritesResponse {
  message: string;
}

export async function addToWatchlist(
  prevState: any,
  formData: FormData
): Promise<AddToFavouritesResponse> {
  await dbConnect();
  const session = await getServerSession();
  if (!session) {
    return { message: "User not logged in" };
  }

  console.log("session", session);

  const artworkId = formData.get("artworkId") as string;
  console.log("artworkId in add to faves", artworkId);

  if (!artworkId) {
    return { message: "No artwork ID provided" };
  }
  // TODO: also add users id to the artwork watchers list
  // ! DATA INTEGRITY
  const result = await updateUserWatchlist(artworkId);
  console.log("result in addToWatchlist", result);

  if (!result || !result.success) {
    return { message: result.message || "Failed to add to watchlist" };
  }

  return { message: "Added to favourites" };
}
