"use client";

import React from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "../../shadcn/button";
import { handleArtworkUpload } from "@/lib/server/artwork/use_cases/handleArtworkUpload";

interface UploadButtonProps {
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
}

const UploadButton = ({ onUploadSuccess }: UploadButtonProps) => {
  const handleUploadSuccess = async (result: CloudinaryUploadWidgetResults) => {
    console.log("Full upload result:", result);
    try {
      const response = await handleArtworkUpload(result);
      console.log("Artwork created:", response);
      onUploadSuccess(result);
    } catch (error) {
      console.error("Upload handling failed:", error);
    }
  };

  return (
    <>
      <CldUploadWidget
        //
        uploadPreset="laoutaris_art"
        signatureEndpoint="/api/admin/sign-cloudinary-params"
        options={{
          sources: ["local", "google_drive", "dropbox"],
          multiple: false,
          maxFiles: 1,
          maxFileSize: 10000000,
        }}
        onSuccess={handleUploadSuccess}
      >
        {({ open }) => {
          return (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-whitish"
              onClick={() => open()}
            >
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default UploadButton;
