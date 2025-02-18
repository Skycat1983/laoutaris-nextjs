import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";
import { getUserWatchlistArtworkDefaultPath } from "../../../../unused/old_code/user/use_cases/getUserWatchlistArtworkDefaultPath";

export default async function Watchlist() {
  await dbConnect();
  const defaultPath = await getUserWatchlistArtworkDefaultPath();
  const url = defaultPath ? `${defaultPath}` : "/";
  return redirect(url);
}
