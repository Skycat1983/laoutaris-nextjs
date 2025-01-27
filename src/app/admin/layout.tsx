import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { AdminPageContainer } from "@/components/layouts/AdminPageContainer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-5 bg-purple-100 flex-1 min-h-screen">
      <AdminSidebar />
      <AdminPageContainer>{children}</AdminPageContainer>
    </div>
  );
}
