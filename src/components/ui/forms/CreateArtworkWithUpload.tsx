"use client";

import { useState } from "react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import UploadButton from "../common/buttons/UploadButton";
import { CreateArtworkForm } from "./CreateArtworkForm";
import { CloudinaryUploadInfo } from "@/lib/types/cloudinaryTypes";
import { cloudinaryResponseToArtworkImageData } from "@/lib/server/artwork/resolvers/cloudinaryResponseToArtworkImageData";
import { ArtworkImage } from "@/lib/types/artworkTypes";

export function CreateArtworkWithUpload() {
  const [uploadInfo, setUploadInfo] = useState<ArtworkImage | null>(null);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    try {
      if (!result.info || typeof result.info !== "object") {
        throw new Error("Invalid upload result");
      }

      const transformedInfo = cloudinaryResponseToArtworkImageData(result.info);
      setUploadInfo(transformedInfo);
    } catch (error) {
      console.error("Failed to process upload result:", error);
    }
  };

  const handleFormSuccess = () => {
    setUploadInfo(null);
  };

  return (
    <div className="flex flex-col w-full bg-blue-100">
      {!uploadInfo ? (
        <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <UploadButton onUploadSuccess={handleUploadSuccess} />
          <div className="text-center text-gray-500">
            Please upload an image to continue
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-sm text-gray-500">
            ✓ Image uploaded successfully
          </div>
          <CreateArtworkForm
            uploadInfo={uploadInfo}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}
    </div>
  );
}
