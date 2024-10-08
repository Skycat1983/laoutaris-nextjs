import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { fetchUserFields } from "@/lib/server/user/data-fetching/fetchUserFields";
import dbConnect from "@/utils/mongodb";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Watchlist() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("http://localhost:3000");
  }

  const response = await fetchUserFields<Partial<IFrontendUser>>(
    session.user.email,
    ["watchlist"]
  );
  const watchlist: string[] | null = response.success
    ? response.data.watchlist || []
    : null;

  if (!watchlist || watchlist.length === 0) {
    //if no favourites, redirect to the account page
    redirect("http://localhost:3000/account");
  } else {
    // If favourites, redirect to the first favourite item's page
    const firstWatchlistId = watchlist[0];
    redirect(`http://localhost:3000/account/watchlist/${firstWatchlistId}`);
  }
}
