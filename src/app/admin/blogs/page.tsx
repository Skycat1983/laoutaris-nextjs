import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CreateBlogForm } from "@/components/ui/forms/CreateBlogForm";
import { DeleteBlogEntry } from "@/components/admin/crud/DeleteBlogEntry";
import { UpdateBlogEntry } from "@/components/admin/crud/UpdateBlogEntry";

export default function AdminBlogsPage() {
  return (
    <AdminContentLayout
      title="Blogs"
      feedComponent={
        <Suspense fallback={<FeedSkeleton />}>
          <BlogFeed />
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
