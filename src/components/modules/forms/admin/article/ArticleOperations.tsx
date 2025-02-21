"use client";

import { useState } from "react";
import { DocumentReader } from "../document-reader/DocumentReader";
import { CreateArticleForm } from "../CreateArticleForm";
import { UpdateArticleForm } from "../UpdateArticleForm";
import type { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { FrontendArticleWithArtworkAndAuthor } from "@/lib/data/types/articleTypes";
import { clientAdminApi } from "@/lib/api/admin/clientAdminApi";

type OperationType = "create" | "update" | "delete";

interface ArticleOperationsProps {
  operationType: OperationType;
}

export function ArticleOperations({ operationType }: ArticleOperationsProps) {
  const [artworkInfo, setArtworkInfo] = useState<FrontendArtwork | null>(null);
  const [articleInfo, setArticleInfo] =
    useState<FrontendArticleWithArtworkAndAuthor | null>(null);

  const handleSuccess = () => {
    setArtworkInfo(null);
    setArticleInfo(null);
  };

  if (operationType === "create") {
    return (
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
    );
  }

  if (operationType === "update") {
    return (
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
    );
  }

  // Handle delete operation similarly...
  return null;
}
