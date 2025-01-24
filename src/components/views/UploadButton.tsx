"use client";

import React from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "../ui/shadcn/button";

interface CloudinaryColor extends Array<string | number> {
  0: string; // hex color
  1: number; // percentage
}

interface CloudinaryPredominantColors {
  google: Array<{ color: string; percentage: number; _id: string }>;
  cloudinary: Array<{ color: string; percentage: number; _id: string }>;
}

interface ProcessedImageDetails {
  secure_url: string;
  public_id: string;
  bytes: number;
  pixelHeight: number;
  pixelWidth: number;
  format: string;
  hexColors: Array<{ color: string; percentage: number }>;
  predominantColors: CloudinaryPredominantColors;
}

const UploadButton = () => {
  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    console.log("Full upload result:", result);

    if (result.info && typeof result.info === "object") {
      const info = result.info as CloudinaryUploadWidgetInfo;

      const imageDetails: ProcessedImageDetails = {
        secure_url: info.secure_url,
        public_id: info.public_id,
        bytes: info.bytes,
        pixelHeight: info.height,
        pixelWidth: info.width,
        format: info.format,
        hexColors:
          (info.colors as CloudinaryColor[])?.map(([color, percentage]) => ({
            color: color as string,
            percentage: percentage as number,
          })) || [],
        predominantColors:
          (info.predominant as CloudinaryPredominantColors) || {
            google: [],
            cloudinary: [],
          },
      };

      console.log("Structured image details:", imageDetails);
      // Now imageDetails matches your artwork model structure
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
