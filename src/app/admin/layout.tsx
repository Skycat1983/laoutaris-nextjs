import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import { AdminPageContainer } from "@/components/layouts/admin/AdminPageContainer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-5 flex-1 min-h-screen">
      <AdminSidebar />
      <AdminPageContainer>{children}</AdminPageContainer>
    </div>
  );
}
