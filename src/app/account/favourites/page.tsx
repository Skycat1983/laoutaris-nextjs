import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { fetchUserFields } from "@/lib/server/user/data-fetching/fetchUserFields";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type UserFavouritesResponse = Pick<IFrontendUser, "favourites">;

export default async function Favourites() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  // If the user is not authenticated, redirect to the homepage
  if (!session?.user?.email) {
    redirect("http://localhost:3000");
  }

  const response: ApiResponse<UserFavouritesResponse> =
    await fetchUserFields<UserFavouritesResponse>(session.user.email, [
      "favourites",
    ]);

  // if the response is successful and has favourites..
  if (response.success && response.data.favourites.length > 0) {
    const firstFavouriteId = response.data.favourites[0];
    redirect(`http://localhost:3000/account/favourites/${firstFavouriteId}`);
  } else {
    //if no favourites or fetch failed, redirect to the account page
    redirect("http://localhost:3000/account");
  }
}
