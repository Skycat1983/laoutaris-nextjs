import { redirect } from "next/navigation";

export default function Settings() {
  redirect("http://localhost:3000/account/settings");
}
