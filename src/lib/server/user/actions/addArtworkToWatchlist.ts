"use server";

import dbConnect from "@/utils/mongodb";
import { updateUserWatchlist } from "../data-fetching/updateUserWatchlist";
import { getServerSession } from "next-auth";
import { fetchUserId } from "../data-fetching/fetchUserId";

interface AddToFavouritesResponse {
  message: string;
}

export async function addArtworkToWatchlist(
  prevState: any,
  formData: FormData
): Promise<AddToFavouritesResponse> {
  await dbConnect();
  const session = await getServerSession();
  if (!session || !session.user) {
    return { message: "User not logged in" };
  }

  console.log("session", session);

  const artworkId = formData.get("artworkId") as string;
  console.log("artworkId in add to watchlist", artworkId);

  if (!artworkId) {
    return { message: "No artwork ID provided" };
  }

  const username = session.user.name;

  // const userId = await fetchUserId(username);
  // console.log("userId in addArtworkToWatchlist:>> ", userId);
  // TODO: also add users id to the artwork watchers list
  // ! DATA INTEGRITY
  // const result = await updateUserWatchlist(artworkId);
  // console.log("result in addToWatchlist", result);

  // if (!result || !result.success) {
  //   return { message: result.message || "Failed to add to watchlist" };
  // }

  return { message: "Added to favourites" };
}
