"use client";

import { useState } from "react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import UploadButton from "../common/buttons/UploadButton";
import { CreateArtworkForm } from "./CreateArtworkForm";
import { CloudinaryUploadInfo } from "@/lib/types/cloudinaryTypes";

function transformUploadResult(
  result: CloudinaryUploadWidgetResults
): CloudinaryUploadInfo {
  if (!result.info || typeof result.info !== "object") {
    throw new Error("Invalid upload result");
  }

  const info = result.info as any;

  return {
    secure_url: info.secure_url,
    public_id: info.public_id,
    bytes: info.bytes,
    height: info.height,
    width: info.width,
    format: info.format,
    resource_type: info.resource_type,
    colors: info.colors,
  };
}

export function CreateArtworkWithUpload() {
  const [uploadInfo, setUploadInfo] = useState<CloudinaryUploadInfo | null>(
    null
  );

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    try {
      const transformedInfo = transformUploadResult(result);
      setUploadInfo(transformedInfo);
    } catch (error) {
      console.error("Failed to process upload result:", error);
      // Handle error - maybe show a toast notification
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <UploadButton onUploadSuccess={handleUploadSuccess} />
        {uploadInfo && (
          <>
            <div className="text-sm text-gray-500">
              ✓ Image uploaded successfully
            </div>
          </>
        )}
      </div>

      {uploadInfo ? (
        <CreateArtworkForm uploadInfo={uploadInfo} />
      ) : (
        <div className="text-center text-gray-500">
          Please upload an image to continue
        </div>
      )}
    </div>
  );
}
