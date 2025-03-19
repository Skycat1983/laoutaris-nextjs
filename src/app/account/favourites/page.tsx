import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";
import { serverApi } from "@/lib/api/serverApi";

// TODO: get user favourites default path
export default async function Favourites() {
  await dbConnect();

  try {
    const result = await serverApi.user.navigation.fetchUserNavigation();

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;

    // If user has favourites, redirect to the first one
    if (data.favourites.length > 0 && data.firstFavouriteId) {
      return redirect(`/account/favourites/${data.firstFavouriteId}`);
    }

    // If no favourites, redirect to a "no favourites" view
    return redirect("/account/favourites/empty");
  } catch (error) {
    console.error("Error in favourites page:", error);
    throw error; // Let Next.js error boundary handle it
  }
}
