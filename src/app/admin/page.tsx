import { ImageUploader } from "@/components/ui/inputs/ImageUploader";
import React from "react";

const page = () => {
  async function uploadImage(url: string) {
    "use server";
    // await updateUser({ avatar: url });
    // revalidatePath("/");
  }

  console.log("running admin");

  return (
    <div className="h-screen">
      <ImageUploader onUploadSuccess={uploadImage} />
    </div>
  );
};

export default page;
