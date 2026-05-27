import { redirect } from "next/navigation";
import { accountSettingsPath } from "@/lib/routes/accountRoutes";

// TODO: get user favourites default path
export default async function Favourites() {
  const redirectUrl = accountSettingsPath;
  return redirect(redirectUrl);
}
