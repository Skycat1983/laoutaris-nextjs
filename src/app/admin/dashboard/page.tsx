import { redirect } from "next/navigation";
import { adminDashboardDefaultPath } from "@/lib/routes/adminDashboardRoutes";

export default async function DashboardPage() {
  redirect(adminDashboardDefaultPath);
}
