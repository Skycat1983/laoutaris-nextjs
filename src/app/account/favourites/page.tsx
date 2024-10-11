import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import config from "@/lib/config";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type UserFavouritesResponse = Pick<IFrontendUser, "favourites">;

export default async function Favourites() {
  await dbConnect();
  const { BASEURL } = config;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(BASEURL);
  }

  const response: ApiResponse<UserFavouritesResponse> =
    await fetchUser<UserFavouritesResponse>(session.user.email, ["favourites"]);

  // if the response is successful and has favourites..
  if (response.success && response.data.favourites.length > 0) {
    const firstFavouriteId = response.data.favourites[0];
    const url = buildUrl(["account", "favourites", firstFavouriteId]);
    redirect(url);
  } else {
    const url = buildUrl(["account"]);
    redirect(url);
  }
}
