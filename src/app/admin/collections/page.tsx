import { AdminCrudTabs } from "@/components/ui/tabs/AdminCrudTabs";
import { CollectionFeed } from "@/components/admin/feeds/CollectionFeed";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import React, { Suspense } from "react";
import { CreateCollectionForm } from "@/components/ui/forms/admin/CreateCollectionForm";
import { UpdateCollection } from "@/components/ui/forms/admin/UpdateCollection";
import { FeedSkeleton } from "@/components/compositions/Feed";

export default function AdminCollectionsPage() {
  return (
    <AdminContentLayout
      title="Collections"
      feedComponent={
        <Suspense fallback={<FeedSkeleton />}>
          <CollectionFeed />
        </Suspense>
      }
    >
      <AdminCrudTabs
        createComponent={<CreateCollectionForm />}
        readComponent={<CollectionFeed />}
        updateComponent={<UpdateCollection />}
        deleteComponent={<></>}
      />
    </AdminContentLayout>
  );
}
