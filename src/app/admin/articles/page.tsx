"use server";

import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { UpdateArticle } from "@/components/modules/forms/admin/UpdateArticle";
import { CreateArticle } from "@/components/modules/forms/admin/CreateArticle";
import { DeleteArticle } from "@/components/modules/forms/admin/DeleteArticle";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { FeedSwitcherTabs } from "@/components/admin/feedSwitcher/FeedSwitcherTabs";

export default async function AdminArticlesPage() {
  return (
    <AdminCrudTabs
      createComponent={<CreateArticle />}
      readComponent={<div>Read Article</div>}
      updateComponent={<UpdateArticle />}
      deleteComponent={<DeleteArticle />}
    />
  );
}
