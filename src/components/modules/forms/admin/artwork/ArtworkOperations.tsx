"use client";

import { useState } from "react";
import { DocumentReader } from "../document-reader/DocumentReader";
import { CreateArtworkForm } from "../CreateArtworkForm";
import { UpdateArtworkForm } from "../UpdateArtworkForm";
import { UploadButton } from "@/components/elements/buttons";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { ArtworkImage } from "@/lib/data/types/artworkTypes";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { cloudinaryResponseToArtworkImageData } from "@/lib/transforms/cloudinaryResponseToArtworkImageData";
import type { CloudinaryUploadInfo } from "@/lib/data/types/cloudinaryTypes";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";

type OperationType = "create" | "update" | "delete";

interface ArtworkOperationsProps {
  operationType: OperationType;
}

export function ArtworkOperations({ operationType }: ArtworkOperationsProps) {
  const [uploadInfo, setUploadInfo] = useState<ArtworkImage | null>(null);
  const [artworkInfo, setArtworkInfo] = useState<FrontendArtwork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openModal } = useGlobalFeatures();

  const handleSuccess = () => {
    setUploadInfo(null);
    setArtworkInfo(null);
    openModal(
      <ModalMessage
        message={`Artwork ${
          operationType === "create"
            ? "created"
            : operationType === "update"
            ? "updated"
            : "deleted"
        } successfully`}
        type="success"
      />
    );
  };

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
      openModal(
        <ModalMessage message="Failed to process upload" type="error" />
      );
    }
  };

  const handleDelete = async () => {
    if (!artworkInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientAdminApi.delete.deleteArtwork(
        artworkInfo._id
      );
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete artwork" type="error" />
        );
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
      openModal(
        <ModalMessage message="Failed to delete artwork" type="error" />
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const operationComponents = {
    create: (
      <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        {!uploadInfo && (
          <div className="flex flex-row w-full justify-center">
            <div className="w-[100px]">
              <UploadButton onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}
        <div className="text-center text-gray-500">
          {uploadInfo
            ? "✓ Image uploaded successfully"
            : "Please upload an image to continue"}
        </div>
        <CreateArtworkForm uploadInfo={uploadInfo} onSuccess={handleSuccess} />
      </div>
    ),
    update: (
      <>
        {!artworkInfo && (
          <DocumentReader<FrontendArtwork>
            onDocumentFound={setArtworkInfo}
            readDocument={(id) => clientAdminApi.read.readArtwork(id)}
            documentType="Artwork"
            buttonVariant="destructive"
          />
        )}
        {artworkInfo && (
          <UpdateArtworkForm
            artworkInfo={artworkInfo}
            onSuccess={handleSuccess}
          />
        )}
      </>
    ),
    delete: (
      <>
        {!artworkInfo && (
          <DocumentReader<FrontendArtwork>
            onDocumentFound={setArtworkInfo}
            readDocument={(id) => clientAdminApi.read.readArtwork(id)}
            documentType="Artwork"
            buttonVariant="destructive"
          />
        )}
        {artworkInfo && (
          <DeleteConfirmation
            document={artworkInfo}
            documentType="Artwork"
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onCancel={() => setArtworkInfo(null)}
          />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
