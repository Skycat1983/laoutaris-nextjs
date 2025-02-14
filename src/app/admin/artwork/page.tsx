"use server";

import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/admin/AdminContentLayout";
import { AdminCrudTabs } from "@/components/modules/tabs/AdminCrudTabs";
import { CreateArtworkWithUpload } from "@/components/modules/forms/admin/CreateArtworkWithUpload";
import { ArtworkFeed } from "@/components/admin/feeds/ArtworkFeed";
import { DeleteArtwork } from "@/components/modules/forms/admin/DeleteArtwork";
import { UpdateArtwork } from "@/components/modules/forms/admin/UpdateArtwork";
import { FeedSkeleton } from "@/components/compositions/Feed";

export default async function AdminArtworkPage() {
  console.log("server");
  return (
    <AdminContentLayout
      title="Artwork"
      feedComponent={
        <Suspense fallback={<FeedSkeleton />}>
          <ArtworkFeed />
        </Suspense>
      }
    >
      <AdminCrudTabs
        createComponent={<CreateArtworkWithUpload />}
        readComponent={<div>Read Artwork</div>}
        updateComponent={<UpdateArtwork />}
        deleteComponent={<DeleteArtwork />}
      />
    </AdminContentLayout>
  );
}
