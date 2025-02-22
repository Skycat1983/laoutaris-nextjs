"use client";

import { useState } from "react";
import { DocumentReader } from "../document-reader/DocumentReader";
import { CreateBlogForm } from "../CreateBlogForm";
import { UpdateBlogForm } from "../UpdateBlogForm";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { DeleteConfirmation } from "../DeleteConfirmation";

type OperationType = "create" | "update" | "delete";

interface BlogOperationsProps {
  operationType: OperationType;
}

export function BlogOperations({ operationType }: BlogOperationsProps) {
  const [blogInfo, setBlogInfo] = useState<FrontendBlogEntry | null>(null);
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

  const handleDelete = async () => {
    if (!blogInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientAdminApi.delete.deleteBlog(blogInfo._id);
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete blog" type="error" />
        );
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
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
          <DocumentReader<FrontendBlogEntry>
            onDocumentFound={setBlogInfo}
            readDocument={(id) => clientAdminApi.read.readBlog(id)}
            documentType="Blog"
            buttonVariant="destructive"
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
          <DocumentReader<FrontendBlogEntry>
            onDocumentFound={setBlogInfo}
            readDocument={(id) => clientAdminApi.read.readBlog(id)}
            documentType="Blog"
            buttonVariant="destructive"
          />
        )}
        {blogInfo && (
          <DeleteConfirmation
            document={blogInfo}
            documentType="Blog"
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
