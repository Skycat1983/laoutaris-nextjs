import dbConnect from "@/utils/mongodb";
import { redirect } from "next/navigation";
import { getUserFavouriteArtworkDefaultPath } from "@/lib/server/user/use_cases/getUserFavouriteArtworkDefaultPath";

export default async function Favourites() {
  await dbConnect();
  const defaultPath = await getUserFavouriteArtworkDefaultPath();
  const url = defaultPath ? `${defaultPath}` : "/";
  return redirect(url);
}
