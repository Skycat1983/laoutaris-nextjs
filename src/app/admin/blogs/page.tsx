import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import { AdminCrudTabs } from "@/components/ui/tabs/AdminCrudTabs";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CreateBlogForm } from "@/components/ui/forms/admin/CreateBlogForm";
import { DeleteBlogEntry } from "@/components/ui/forms/admin/DeleteBlogEntry";
import { UpdateBlogEntry } from "@/components/ui/forms/admin/UpdateBlogEntry";
import ReadBlogForm from "@/components/ui/forms/ReadBlogForm";
import { FeedSkeleton } from "@/components/common/Feed";

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
