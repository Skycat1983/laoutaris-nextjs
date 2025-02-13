"use client";

import { useState } from "react";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import UploadButton from "../../common/buttons/UploadButton";
import { CreateArtworkForm } from "./CreateArtworkForm";
import { CloudinaryUploadInfo } from "@/lib/types/cloudinaryTypes";
import { cloudinaryResponseToArtworkImageData } from "@/lib/transforms/cloudinaryResponseToArtworkImageData";
import { ArtworkImage } from "@/lib/types/artworkTypes";

export function CreateArtworkWithUpload() {
  const [uploadInfo, setUploadInfo] = useState<ArtworkImage | null>(null);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    try {
      if (
        !result.info ||
        typeof result.info !== "object" ||
        !result.info.colors
      ) {
        throw new Error("Invalid upload result");
      }

      const transformedInfo = cloudinaryResponseToArtworkImageData(
        result.info as CloudinaryUploadInfo
      );
      setUploadInfo(transformedInfo);
    } catch (error) {
      console.error("Failed to process upload result:", error);
    }
  };

  const handleFormSuccess = () => {
    setUploadInfo(null);
  };

  const label = uploadInfo
    ? "✓ Image uploaded successfully"
    : "Please upload an image to continue";

  return (
    <>
      <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        {!uploadInfo && (
          <div className="flex flex-row w-full justify-center">
            <div className="w-[100px]">
              <UploadButton onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}
        <div className="text-center text-gray-500">{label}</div>
        <CreateArtworkForm
          uploadInfo={uploadInfo}
          onSuccess={handleFormSuccess}
        />
      </div>
    </>
  );
}
