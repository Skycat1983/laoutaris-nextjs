import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";
import { getUserFavouriteArtworkDefaultPath } from "../../../../unused/old_code/user/use_cases/getUserFavouriteArtworkDefaultPath";

export default async function Favourites() {
  await dbConnect();
  const defaultPath = await getUserFavouriteArtworkDefaultPath();
  const url = defaultPath ? `${defaultPath}` : "/";
  return redirect(url);
}
