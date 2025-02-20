import { AdminPageContainer } from "@/components/layouts/admin/AdminPageContainer";
import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import React from "react";

const AdminTestPage = ({ feed }: { feed: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-5 flex-1 min-h-screen">
      <AdminSidebar />
      {/* content */}
      <div className="col-span-4 pl-2 flex flex-col bg-red-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-200/20">
          {/* left */}
          <div className="col-span-2 bg-greyish/10 hover:bg-whitish flex flex-col bg-white">
            <div className="flex flex-col p-4">
              <div className="flex flex-row">
                <h1 className="text-4xl font-archivo font-semibold p-8 mt-8">
                  {/* {title} */}
                  TEST
                </h1>
              </div>
              {/* {children} */}
            </div>
          </div>
          {/* right */}
          <div className="bg-blue-100">
            {/* {feedComponent} */}
            {feed}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestPage;
