import { redirect } from "next/navigation";
import { accountSettingsPath } from "@/lib/routes/accountRoutes";

export default function Settings() {
  redirect(accountSettingsPath);
}
