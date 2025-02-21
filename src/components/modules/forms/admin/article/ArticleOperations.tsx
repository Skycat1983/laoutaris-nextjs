"use client";

import { useState } from "react";
import { DocumentReader } from "../document-reader/DocumentReader";
import { CreateArticleForm } from "../CreateArticleForm";
import { UpdateArticleForm } from "../UpdateArticleForm";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { FrontendArticleWithArtworkAndAuthor } from "@/lib/data/types/articleTypes";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { DeleteConfirmation } from "./DeleteConfirmation";

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
      const response = await clientAdminApi.delete.deleteArticle(
        articleInfo._id
      );
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
            readDocument={(id) => clientAdminApi.read.readArtwork(id)}
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
            readDocument={(id) => clientAdminApi.read.readArticle(id)}
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
            readDocument={(id) => clientAdminApi.read.readArticle(id)}
            documentType="Article"
            buttonVariant="destructive"
          />
        )}
        {articleInfo && (
          <DeleteConfirmation article={articleInfo} onDelete={handleDelete} />
        )}
      </>
    ),
  };

  return operationComponents[operationType] ?? null;
}
