"use client";

import { useState } from "react";
import { DocumentReader } from "../DocumentReader";
import type { FrontendComment } from "@/lib/data/types/commentTypes";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { clientApi } from "@/lib/api/clientApi";
import { DeleteConfirmation } from "../crudForms/delete/DeleteConfirmation";

type OperationType = "read" | "delete";

interface CommentOperationsProps {
  operationType: OperationType;
}

export function CommentOperations({ operationType }: CommentOperationsProps) {
  const [commentInfo, setCommentInfo] = useState<FrontendComment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openModal } = useGlobalFeatures();

  const handleSuccess = () => {
    setCommentInfo(null);
    openModal(
      <ModalMessage
        message={`Comment ${
          operationType === "delete" ? "deleted" : "updated"
        } successfully`}
        type="success"
      />
    );
  };

  const handleDelete = async () => {
    if (!commentInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientApi.admin.delete.comment(commentInfo._id);
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete comment" type="error" />
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      openModal(
        <ModalMessage message="Failed to delete comment" type="error" />
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const operationComponents = {
    read: <div>Read Comment Component</div>,
    delete: (
      <>
        {!commentInfo && (
          <DocumentReader<FrontendComment>
            onDocumentFound={setCommentInfo}
            readDocument={(id) => clientApi.admin.read.comment(id)}
            documentType="Comment"
            buttonVariant="destructive"
          />
        )}
        {commentInfo && (
          <DeleteConfirmation
            document={{
              _id: commentInfo._id,
              title: commentInfo.text,
              subtitle: `By: ${commentInfo.author}`,
            }}
            documentType="Comment"
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onCancel={() => setCommentInfo(null)}
          />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
