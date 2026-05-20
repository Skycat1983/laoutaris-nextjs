"use client";

import { useState } from "react";
import { DocumentReader } from "../DocumentReader";
import { UploadButton } from "@/components/elements/buttons/UploadButton";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { cloudinaryResponseToArtworkImageData } from "@/lib/transforms/artwork/transformCloudinary";
import type { CloudinaryImageDB, CloudinaryUploadInfo } from "@/lib/data/types/cloudinaryTypes";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { clientApi } from "@/lib/api/clientApi";
import { CreateArtworkForm } from "../crudForms/create";
import { UpdateArtworkForm } from "../crudForms/update";
import { DeleteConfirmation } from "../crudForms/delete";
import type { AdminDeleteEvidence } from "@/lib/api/admin/delete/evidenceTypes";
import type { ArtworkFrontend } from "@/lib/data/types";

type OperationType = "create" | "update" | "delete";

interface ArtworkOperationsProps {
  operationType: OperationType;
  initialDocumentId?: string | null;
}

export function ArtworkOperations({
  operationType,
  initialDocumentId = null,
}: ArtworkOperationsProps) {
  const [uploadInfo, setUploadInfo] = useState<CloudinaryImageDB | null>(null);
  const [artworkInfo, setArtworkInfo] = useState<ArtworkFrontend | null>(null);
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
    } catch {
      openModal(
        <ModalMessage message="Failed to process upload" type="error" />
      );
    }
  };

  const handleDelete = async (evidence: AdminDeleteEvidence) => {
    if (!artworkInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientApi.admin.delete.artwork(
        artworkInfo._id,
        evidence
      );
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete artwork" type="error" />
        );
      }
    } catch {
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
          <DocumentReader<ArtworkFrontend>
            onDocumentFound={setArtworkInfo}
            readDocument={(id) => clientAdminApi.read.artwork(id)}
            documentType="Artwork"
            buttonVariant="destructive"
            initialObjectId={initialDocumentId}
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
          <DocumentReader<ArtworkFrontend>
            onDocumentFound={setArtworkInfo}
            readDocument={(id) => clientAdminApi.read.artwork(id)}
            documentType="Artwork"
            buttonVariant="destructive"
            initialObjectId={initialDocumentId}
          />
        )}
        {artworkInfo && (
          <DeleteConfirmation
            document={artworkInfo}
            documentType="Artwork"
            fetchDeletePreview={clientApi.admin.delete.preview.artwork}
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
