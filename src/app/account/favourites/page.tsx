import { redirect } from "next/navigation";

// TODO: get user favourites default path
export default async function Favourites() {
  const redirectUrl = "/account/settings";
  return redirect(redirectUrl);
}
