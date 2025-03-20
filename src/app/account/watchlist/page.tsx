import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";

// TODO: get user watchlist default path
export default async function Watchlist() {
  const redirectUrl = "/account/settings";
  return redirect(redirectUrl);
}

// await dbConnect();
// const defaultPath = await getUserWatchlistArtworkDefaultPath();
// const url = defaultPath ? `${defaultPath}` : "/";
// return redirect(url);
