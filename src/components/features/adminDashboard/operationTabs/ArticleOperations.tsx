"use client";

import { useState } from "react";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { FrontendArticleWithArtworkAndAuthor } from "@/lib/data/types/articleTypes";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { clientApi } from "@/lib/api/clientApi";
import { DocumentReader } from "../DocumentReader";
import { UpdateArticleForm } from "../crudForms/update/UpdateArticleForm";
import { DeleteConfirmation } from "../crudForms/delete/DeleteConfirmation";
import { CreateArticleForm } from "../crudForms/create";

type OperationType = "create" | "update" | "delete";

interface ArticleOperationsProps {
  operationType: OperationType;
}

export function ArticleOperations({ operationType }: ArticleOperationsProps) {
  const [artworkInfo, setArtworkInfo] = useState<FrontendArtwork | null>(null);
  const [articleInfo, setArticleInfo] =
    useState<FrontendArticleWithArtworkAndAuthor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openModal } = useGlobalFeatures();

  const handleSuccess = () => {
    setArtworkInfo(null);
    setArticleInfo(null);
    openModal(
      <ModalMessage
        message={`Article ${
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
    if (!articleInfo?._id) return;

    try {
      setIsDeleting(true);
      const response = await clientApi.admin.delete.article(articleInfo._id);
      if (response.success) {
        handleSuccess();
      } else {
        openModal(
          <ModalMessage message="Failed to delete article" type="error" />
        );
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      openModal(
        <ModalMessage message="Failed to delete article" type="error" />
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const operationComponents = {
    create: (
      <>
        {!artworkInfo && (
          <DocumentReader<FrontendArtwork>
            onDocumentFound={setArtworkInfo}
            readDocument={(id) => clientApi.admin.read.artwork(id)}
            documentType="Artwork"
          />
        )}
        {artworkInfo && (
          <CreateArticleForm
            artworkInfo={artworkInfo}
            onSuccess={handleSuccess}
          />
        )}
      </>
    ),
    update: (
      <>
        {!articleInfo && (
          <DocumentReader<FrontendArticleWithArtworkAndAuthor>
            onDocumentFound={setArticleInfo}
            readDocument={(id) => clientApi.admin.read.article(id)}
            documentType="Article"
            buttonVariant="destructive"
          />
        )}
        {articleInfo && (
          <UpdateArticleForm
            articleInfo={articleInfo}
            onSuccess={handleSuccess}
          />
        )}
      </>
    ),
    delete: (
      <>
        {!articleInfo && (
          <DocumentReader<FrontendArticleWithArtworkAndAuthor>
            onDocumentFound={setArticleInfo}
            readDocument={(id) => clientApi.admin.read.article(id)}
            documentType="Article"
            buttonVariant="destructive"
          />
        )}
        {articleInfo && (
          <DeleteConfirmation
            document={articleInfo}
            documentType="Article"
            onDelete={handleDelete}
            isDeleting={isDeleting}
            onCancel={() => setArticleInfo(null)}
          />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
