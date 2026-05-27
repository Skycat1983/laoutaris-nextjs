import { redirect } from "next/navigation";
import { accountSettingsPath } from "@/lib/routes/accountRoutes";

// TODO: get user watchlist default path
export default async function Watchlist() {
  const redirectUrl = accountSettingsPath;
  return redirect(redirectUrl);
}

// await dbConnect();
// const defaultPath = await getUserWatchlistArtworkDefaultPath();
// const url = defaultPath ? `${defaultPath}` : "/";
// return redirect(url);
