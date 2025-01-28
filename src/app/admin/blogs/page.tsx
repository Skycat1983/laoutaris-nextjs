import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
// import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CreateBlogForm } from "@/components/ui/forms/CreateBlogForm";

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
        updateComponent={<div>Update Blog</div>}
        deleteComponent={<div>Delete Blog</div>}
      />
    </AdminContentLayout>
  );
}
