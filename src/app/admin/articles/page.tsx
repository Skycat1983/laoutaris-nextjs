import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { ArticleFeed } from "@/components/admin/feeds/ArticleFeed";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";

export default function AdminArticlesPage() {
  console.log("artciles");
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
        createComponent={<div>Create Article</div>}
        readComponent={<div>Read Article</div>}
        updateComponent={<div>Update Article</div>}
        deleteComponent={<div>Delete Article</div>}
      />
    </AdminContentLayout>
  );
}
