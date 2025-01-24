"use server";
import UploadButton from "@/components/views/UploadButton";
import React from "react";

const page = () => {
  // console.log("running admin");

  // console.log("API Key in Admin:", process.env.CLOUDINARY_API_KEY);
  // console.log("API Secret in Admin:", process.env.CLOUDINARY_API_SECRET);
  // console.log(
  //   "Cloud Name in Admin  :",
  //   process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  // );

  return (
    <div className="h-screen">
      {/* <ImageUploader onUploadSuccess={uploadImage} /> */}
      <UploadButton />
    </div>
  );
};

export default page;
