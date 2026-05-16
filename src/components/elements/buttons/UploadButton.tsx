"use client";

import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "../../shadcn/button";

interface UploadButtonProps {
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
}

export const UploadButton = ({ onUploadSuccess }: UploadButtonProps) => {
  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
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
      {(renderProps) => {
        const { open, isLoading } = renderProps || {};

        return (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-whitish"
            disabled={isLoading}
            onClick={() => {
              if (!isLoading && open) {
                open();
              }
            }}
          >
            {isLoading ? "Loading..." : "Upload an Image"}
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};
