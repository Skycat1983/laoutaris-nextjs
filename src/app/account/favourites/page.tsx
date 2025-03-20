import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";
import { serverApi } from "@/lib/api/serverApi";
import { isNextError } from "@/lib/helpers/isNextError";
import { ArtworkFrontend, ApiErrorResponse } from "@/lib/data/types";
import { ApiSuccessResponse } from "@/lib/data/types";
import { ApiFavoritesListResult } from "@/lib/api/user/favorites/fetchers";

type FavouritesResponse = ApiFavoritesListResult | ApiErrorResponse;
// TODO: get user favourites default path
export default async function Favourites() {
  await dbConnect();

  try {
    // const result = await serverApi.user.navigation.fetchUserNavigation();
    const result = await serverApi.user.favourites.getList();

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result as ApiFavoritesListResult;

    // If user has favourites, redirect to the first one
    if (data.length > 0 && data[0]._id) {
      return redirect(`/account/favourites/${data[0]._id}`);
    }

    return redirect("/account/settings");
  } catch (error) {
    if (isNextError(error)) {
      console.error("Error in favourites page:", error);
      throw error; // Let Next.js error boundary handle it
    }
    console.error("Error in favourites page:", error);
    throw error;
  }
}
