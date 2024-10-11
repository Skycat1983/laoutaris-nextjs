import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { fetchUserFields } from "@/lib/server/user/data-fetching/fetchUser";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type UserWatchlistFields = Pick<IFrontendUser, "watchlist">;

export default async function Watchlist() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("http://localhost:3000");
  }

  const email = session.user.email;

  const response = await fetchUserFields<UserWatchlistFields>(email, [
    "watchlist",
  ]);
  const watchlist: string[] | null = response.success
    ? response.data.watchlist || []
    : null;

  if (!watchlist || watchlist.length === 0) {
    redirect("http://localhost:3000/account");
  } else {
    const firstWatchlistId = watchlist[0];
    redirect(`http://localhost:3000/account/watchlist/${firstWatchlistId}`);
  }
}
