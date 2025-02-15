import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { CreateBlogForm } from "@/components/modules/forms/admin/CreateBlogForm";
import { DeleteBlogEntry } from "@/components/modules/forms/admin/DeleteBlogEntry";
import { UpdateBlogEntry } from "@/components/modules/forms/admin/UpdateBlogEntry";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { FeedSwitcherTabs } from "@/components/admin/feedSwitcher/FeedSwitcherTabs";

export default function AdminBlogsPage() {
  return (
    <AdminContentLayout
      title="Blogs"
      feedComponent={
        <Suspense fallback={<FeedSkeleton />}>
          <FeedSwitcherTabs />
        </Suspense>
      }
    >
      <AdminCrudTabs
        createComponent={<CreateBlogForm />}
        readComponent={<div>Read Blog</div>}
        updateComponent={<UpdateBlogEntry />}
        deleteComponent={<DeleteBlogEntry />}
      />
    </AdminContentLayout>
  );
}
