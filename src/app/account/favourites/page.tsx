import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import config from "@/lib/config";
import { IFrontendUserBase } from "@/lib/client/types/userTypes";
import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type UserFavouritesResponse = Pick<IFrontendUserBase, "favourites">;

export default async function Favourites() {
  await dbConnect();
  const { BASEURL } = config;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(BASEURL);
  }

  const email = session.user.email;

  const response = await fetchUser<UserFavouritesResponse>("email", email, [
    "favourites",
  ]);

  if (!response.success) {
    console.error(
      "Failed to fetch user data in account/favourites:",
      response.message
    );
    redirect(BASEURL);
  }

  // if the response is successful and has favourites..
  if (response.data.favourites.length > 0) {
    const firstFavouriteId = response.data.favourites[0];
    const url = buildUrl(["account", "favourites", firstFavouriteId]);
    redirect(url);
  } else {
    const url = buildUrl(["account"]);
    redirect(url);
  }
}
