"use server";

import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import { AdminCrudTabs } from "@/components/ui/tabs/AdminCrudTabs";
import { UpdateArticle } from "@/components/ui/forms/admin/UpdateArticle";
import { CreateArticle } from "@/components/ui/forms/admin/CreateArticle";
import { ArticleFeed } from "@/components/admin/feeds/ArticleFeed";
import { DeleteArticle } from "@/components/ui/forms/admin/DeleteArticle";
import { FeedSkeleton } from "@/components/common/Feed";

export default async function AdminArticlesPage() {
  return (
    <AdminContentLayout
      title="Articles"
      feedComponent={
        <Suspense fallback={<FeedSkeleton />}>
          <ArticleFeed />
        </Suspense>
      }
    >
      <AdminCrudTabs
        createComponent={<CreateArticle />}
        readComponent={<div>Read Article</div>}
        updateComponent={<UpdateArticle />}
        deleteComponent={<DeleteArticle />}
      />
    </AdminContentLayout>
  );
}
