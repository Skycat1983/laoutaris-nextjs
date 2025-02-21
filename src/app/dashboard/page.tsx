import { AdminPageContainer } from "@/components/layouts/admin/AdminPageContainer";
import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardPage() {
  redirect("/dashboard/articles");
}
