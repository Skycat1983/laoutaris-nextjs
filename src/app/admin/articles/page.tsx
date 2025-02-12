"use server";

import React from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { UpdateArticle } from "@/components/admin/crud/article/UpdateArticle";
import { CreateArticle } from "@/components/admin/crud/article/CreateArticle";
import { ArticleFeed } from "@/components/admin/feeds/ArticleFeed";
import { DeleteArticle } from "@/components/admin/crud/article/DeleteArticle";

export default async function AdminArticlesPage() {
  return (
    <AdminContentLayout title="Articles" feedComponent={<ArticleFeed />}>
      <AdminCrudTabs
        createComponent={<CreateArticle />}
        readComponent={<div>Read Article</div>}
        updateComponent={<UpdateArticle />}
        deleteComponent={<DeleteArticle />}
      />
    </AdminContentLayout>
  );
}
