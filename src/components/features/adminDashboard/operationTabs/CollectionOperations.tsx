"use client";

import { useState } from "react";
import { DocumentReader } from "../DocumentReader";
import type { FrontendCollectionWithArtworks } from "@/lib/data/types/collectionTypes";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { clientApi } from "@/lib/api/clientApi";
import { CreateCollectionForm } from "../crudForms/create";
import { UpdateCollectionForm } from "../crudForms/update/UpdateCollectionForm";
import { DeleteConfirmation } from "../crudForms/delete/DeleteConfirmation";

type OperationType = "create" | "update" | "delete";

interface CollectionOperationsProps {
  operationType: OperationType;
}

export function CollectionOperations({
  operationType,
}: CollectionOperationsProps) {
  const [collectionInfo, setCollectionInfo] =
    useState<FrontendCollectionWithArtworks | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openModal } = useGlobalFeatures();

  const handleSuccess = () => {
    setCollectionInfo(null);
    openModal(
      <ModalMessage
        message={`Collection ${
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

  const handleDelete = async () => {
    if (!collectionInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientApi.admin.delete.collection(
        collectionInfo._id
      );
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete collection" type="error" />
        );
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      openModal(
        <ModalMessage message="Failed to delete collection" type="error" />
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const operationComponents = {
    create: (
      <div className="flex flex-col items-around justify-start gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <CreateCollectionForm onSuccess={handleSuccess} />
      </div>
    ),
    update: (
      <>
        {!collectionInfo && (
          <DocumentReader<FrontendCollectionWithArtworks>
            onDocumentFound={setCollectionInfo}
            readDocument={(id) => clientAdminApi.read.collection(id)}
            documentType="Collection"
            buttonVariant="destructive"
          />
        )}
        {collectionInfo && (
          <UpdateCollectionForm
            collectionInfo={collectionInfo}
            onSuccess={handleSuccess}
          />
        )}
      </>
    ),
    delete: (
      <>
        {!collectionInfo && (
          <DocumentReader<FrontendCollectionWithArtworks>
            onDocumentFound={setCollectionInfo}
            readDocument={(id) => clientApi.admin.read.collection(id)}
            documentType="Collection"
            buttonVariant="destructive"
          />
        )}
        {collectionInfo && (
          <DeleteConfirmation
            document={collectionInfo}
            documentType="Collection"
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onCancel={() => setCollectionInfo(null)}
          />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
