"use client";

import { useState } from "react";
import { DocumentReader } from "./DocumentReader";
import type { FrontendUser } from "@/lib/data/types/userTypes";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { DeleteConfirmation } from "../../modules/forms/admin/DeleteConfirmation";
import { clientApi } from "@/lib/api/clientApi";

type OperationType = "read" | "delete";

interface UserOperationsProps {
  operationType: OperationType;
}

export function UserOperations({ operationType }: UserOperationsProps) {
  const [userInfo, setUserInfo] = useState<FrontendUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openModal } = useGlobalFeatures();

  const handleSuccess = () => {
    setUserInfo(null);
    openModal(
      <ModalMessage
        message={`User ${
          operationType === "delete" ? "deleted" : "updated"
        } successfully`}
        type="success"
      />
    );
  };

  const handleDelete = async () => {
    if (!userInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientApi.admin.delete.user(userInfo._id);
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete user" type="error" />
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      openModal(<ModalMessage message="Failed to delete user" type="error" />);
    } finally {
      setIsDeleting(false);
    }
  };

  const operationComponents = {
    read: <div>Read User Component</div>,
    delete: (
      <>
        {!userInfo && (
          <DocumentReader<FrontendUser>
            onDocumentFound={setUserInfo}
            readDocument={(id) => clientApi.admin.read.user(id)}
            documentType="User"
            buttonVariant="destructive"
          />
        )}
        {userInfo && (
          <DeleteConfirmation
            document={{
              _id: userInfo._id,
              title: userInfo.username,
              subtitle: userInfo.email,
            }}
            documentType="User"
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onCancel={() => setUserInfo(null)}
          />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
