import React from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { ArticleFeed } from "@/components/admin/feeds/ArticleFeed";
// import other forms...

export default function ArticlesPage() {
  return (
    <AdminContentLayout title="Articles" feedComponent={<ArticleFeed />}>
      <AdminCrudTabs
        createComponent={<div>Create Article</div>}
        readComponent={<div>Read Article</div>}
        updateComponent={<div>Update Article</div>}
        deleteComponent={<div>Delete Article</div>}
      />
    </AdminContentLayout>
  );
}
