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
  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    onUploadSuccess(result);
  };

  return (
    <CldUploadWidget
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
      {({ open }) => (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-whitish"
          onClick={() => open()}
        >
          Upload an Image
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadButton;
