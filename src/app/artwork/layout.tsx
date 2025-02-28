import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import React from "react";

const ArtworkListLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      {/* <div className="grid grid-cols-5 flex-1 min-h-screen">
        <AdminSidebar />
        <div className="col-span-4 pl-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="col-span-2 bg-greyish/10 hover:bg-whitish"></div>
          </div>
          {children}
        </div>
      </div> */}
    </>
  );
};

export default ArtworkListLayout;
