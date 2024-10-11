import { redirect } from "next/navigation";

export default function Account() {
  redirect("http://localhost:3000/account/dashboard");
}
