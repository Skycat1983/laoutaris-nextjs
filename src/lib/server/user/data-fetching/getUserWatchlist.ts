import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { IUser, UserModel } from "../../models";

export async function getUserWatchlist() {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;

  // if (!username) {
  //   return NextResponse.json({ message: "User not found" });
  // }

  //? returns the user and the watchlist
  const user = (await UserModel.findOne({ username })
    .select("watchlist")
    .lean()) as IUser | null;

  const watchlist = user?.watchlist;

  console.log("watchlistobject :>> ", watchlist);
  if (!watchlist) {
    return { message: "Watchlist not found" };
  }
  return watchlist;
  // return NextResponse.json({ watchlist });
}
