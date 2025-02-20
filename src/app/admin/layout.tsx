import { FeedSwitcherTabs } from "@/components/admin/feedSwitcher/FeedSwitcherTabs";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { AdminPageContainer } from "@/components/layouts/admin/AdminPageContainer";
import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import { Suspense } from "react";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="grid grid-cols-5 flex-1 min-h-screen">
//       <AdminSidebar />
//       <AdminPageContainer>{children}</AdminPageContainer>
//       <Suspense fallback={<FeedSkeleton />}>
//         <FeedSwitcherTabs />
//       </Suspense>
//     </div>
//   );
// }

export default function AdminLayout({
  children,
  feed,
  params,
}: {
  children: React.ReactNode;
  feed: React.ReactNode;
  params: {
    title: string;
  };
}) {
  const { title } = params;
  console.log("title", title);
  return (
    <div className="grid grid-cols-5 flex-1 min-h-screen">
      <AdminSidebar />
      <AdminPageContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-200/20">
          <div className="col-span-2 bg-greyish/10 hover:bg-whitish flex flex-col">
            <div className="flex flex-col p-4">
              <div className="flex flex-row">
                <h1 className="text-4xl font-archivo font-semibold p-8 mt-8">
                  {title}
                </h1>
              </div>
              {children}
            </div>
          </div>
          <div className="">
            {/* {feedComponent} */}
            {feed}
          </div>
        </div>
      </AdminPageContainer>
    </div>
  );
}
