import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import config from "@/lib/config";
import { IFrontendUser, IFrontendUserBase } from "@/lib/client/types/userTypes";
import { fetchUser } from "@/lib/server/user/data-fetching/fetchUser";
import { buildUrl } from "@/utils/buildUrl";
import { redirect } from "next/navigation";

type UserWatchlistFields = Pick<IFrontendUserBase, "watchlist">;

export default async function Watchlist() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const { BASEURL } = config;

  if (!session?.user?.email) {
    redirect(BASEURL);
  }

  const email = session.user.email;

  const response = await fetchUser<UserWatchlistFields>("email", email, [
    "watchlist",
  ]);

  if (!response.success) {
    console.error(
      "Failed to fetch user data in account/watchlist:",
      response.message
    );
    redirect(BASEURL);
  }

  const watchlist = response.data.watchlist;

  if (!watchlist || watchlist.length === 0) {
    const url = buildUrl(["account"]);
    redirect(url);
  } else {
    const firstWatchlistId = watchlist[0];
    const url = buildUrl(["account", "watchlist", firstWatchlistId]);
    redirect(url);
  }
}
