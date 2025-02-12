import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { BlogFeed } from "@/components/admin/feeds/BlogFeed";
import { CollectionFeed } from "@/components/admin/feeds/CollectionFeed";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import React from "react";

export default function AdminCollectionsPage() {
  return (
    <AdminContentLayout title="Collections" feedComponent={<CollectionFeed />}>
      <AdminCrudTabs
        createComponent={<></>}
        readComponent={<></>}
        updateComponent={<></>}
        deleteComponent={<></>}
      />
    </AdminContentLayout>
  );
}
