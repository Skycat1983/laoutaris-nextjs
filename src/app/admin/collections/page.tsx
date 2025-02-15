import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import React, { Suspense } from "react";
import { CreateCollectionForm } from "@/components/modules/forms/admin/CreateCollectionForm";
import { UpdateCollection } from "@/components/modules/forms/admin/UpdateCollection";
import { FeedSkeleton } from "@/components/compositions/Feed";
import { FeedSwitcherTabs } from "@/components/admin/feedSwitcher/FeedSwitcherTabs";
export default function AdminCollectionsPage() {
  return (
    <AdminContentLayout
      title="Collections"
      feedComponent={
        <Suspense fallback={<FeedSkeleton />}>
          <FeedSwitcherTabs />
        </Suspense>
      }
    >
      <AdminCrudTabs
        createComponent={<CreateCollectionForm />}
        readComponent={<div>Read Collection</div>}
        updateComponent={<UpdateCollection />}
        deleteComponent={<div>Delete Collection</div>}
      />
    </AdminContentLayout>
  );
}
