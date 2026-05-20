"use client";

import { useState } from "react";
import { DocumentReader } from "../DocumentReader";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { clientApi } from "@/lib/api/clientApi";
import { CreateBlogForm } from "../crudForms/create";
import { UpdateBlogForm } from "../crudForms/update";
import { DeleteConfirmation } from "../crudForms/delete";
import type { AdminDeleteEvidence } from "@/lib/api/admin/delete/evidenceTypes";
import type { AdminBlogPopulated, BlogEntryFrontend } from "@/lib/data/types";

type OperationType = "create" | "update" | "delete";

interface BlogOperationsProps {
  operationType: OperationType;
  initialDocumentId?: string | null;
}

export function BlogOperations({
  operationType,
  initialDocumentId = null,
}: BlogOperationsProps) {
  const [blogInfo, setBlogInfo] = useState<BlogEntryFrontend | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openModal } = useGlobalFeatures();

  const handleSuccess = () => {
    setBlogInfo(null);
    openModal(
      <ModalMessage
        message={`Blog ${
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

  const handleDelete = async (evidence: AdminDeleteEvidence) => {
    if (!blogInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientApi.admin.delete.blog(
        blogInfo._id,
        evidence
      );
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete blog" type="error" />
        );
      }
    } catch {
      openModal(<ModalMessage message="Failed to delete blog" type="error" />);
    } finally {
      setIsDeleting(false);
    }
  };

  const operationComponents = {
    create: <CreateBlogForm onSuccess={handleSuccess} />,
    update: (
      <>
        {!blogInfo && (
          <DocumentReader<BlogEntryFrontend>
            onDocumentFound={setBlogInfo}
            readDocument={(id) => clientAdminApi.read.blog(id)}
            documentType="Blog"
            buttonVariant="destructive"
            initialObjectId={initialDocumentId}
          />
        )}
        {blogInfo && (
          <UpdateBlogForm
            blogInfo={blogInfo}
            onSuccess={handleSuccess}
            // onCancel={() => setBlogInfo(null)}
          />
        )}
      </>
    ),
    delete: (
      <>
        {!blogInfo && (
          <DocumentReader<BlogEntryFrontend>
            onDocumentFound={setBlogInfo}
            readDocument={(id) => clientApi.admin.read.blog(id)}
            documentType="Blog"
            buttonVariant="destructive"
            initialObjectId={initialDocumentId}
          />
        )}
        {blogInfo && (
          <DeleteConfirmation
            document={blogInfo}
            documentType="Blog"
            fetchDeletePreview={clientApi.admin.delete.preview.blog}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onCancel={() => setBlogInfo(null)}
          />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
