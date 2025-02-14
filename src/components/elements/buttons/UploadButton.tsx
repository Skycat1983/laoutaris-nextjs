"use client";

import React from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "../../shadcn/button";

interface UploadButtonProps {
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
}

const UploadButton = ({ onUploadSuccess }: UploadButtonProps) => {
  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    console.log("result in UploadButton", result);
    onUploadSuccess(result);
  };

  return (
    <CldUploadWidget
      uploadPreset="laoutaris_art"
      signatureEndpoint="/api/v2/admin/sign-cloudinary-params"
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
