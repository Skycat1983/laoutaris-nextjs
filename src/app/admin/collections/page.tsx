import { AdminCrudTabs } from "@/components/ui/tabs/AdminCrudTabs";
import { CollectionFeed } from "@/components/admin/feeds/CollectionFeed";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import React from "react";
import { CreateCollectionForm } from "@/components/ui/forms/CreateCollectionForm";
import { UpdateCollection } from "@/components/admin/crud/collection/UpdateCollection";

export default function AdminCollectionsPage() {
  return (
    <AdminContentLayout title="Collections" feedComponent={<CollectionFeed />}>
      <AdminCrudTabs
        createComponent={<CreateCollectionForm />}
        readComponent={<CollectionFeed />}
        updateComponent={<UpdateCollection />}
        deleteComponent={<></>}
      />
    </AdminContentLayout>
  );
}
