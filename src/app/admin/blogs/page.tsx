import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CreateBlogForm } from "@/components/modules/forms/admin/CreateBlogForm";
import { DeleteBlogEntry } from "@/components/modules/forms/admin/DeleteBlogEntry";
import { UpdateBlogEntry } from "@/components/modules/forms/admin/UpdateBlogEntry";
import ReadBlogForm from "@/components/modules/forms/ReadBlogForm";
import { FeedSkeleton } from "@/components/compositions/Feed";

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
        readComponent={<ReadBlogForm />}
        updateComponent={<UpdateBlogEntry />}
        deleteComponent={<DeleteBlogEntry />}
      />
    </AdminContentLayout>
  );
}
