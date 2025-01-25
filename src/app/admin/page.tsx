"use server";
import UploadButton from "@/components/ui/common/buttons/UploadButton";
import { CreateArtworkForm } from "@/components/ui/forms/CreateArtworkForm";
import AdminDashboard from "@/components/views/AdminDashboard";
import React from "react";

const page = () => {
  return (
    <div className="h-screen">
      <AdminDashboard />
      {/* <div>
        <UploadButton />
        <CreateArtworkForm />
      </div> */}
    </div>
  );
};

export default page;
