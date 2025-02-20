import dbConnect from "@/lib/db/mongodb";
import { redirect } from "next/navigation";

// TODO: get user favourites default path
export default async function Favourites() {
  await dbConnect();
  // const defaultPath = await getUserFavouriteArtworkDefaultPath();
  // const url = defaultPath ? `${defaultPath}` : "/";
  // return redirect(url);
}
