// "use server";

import React, { Suspense } from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { CreateArtworkWithUpload } from "@/components/ui/forms/CreateArtworkWithUpload";
import { ArtworkFeed } from "@/components/admin/feeds/ArtworkFeed";
import { DeleteArtwork } from "@/components/admin/crud/DeleteArtwork";
import { FeedSkeleton } from "@/components/skeletons/FeedSkeleton";
import { UpdateArtwork } from "@/components/admin/crud/UpdateArtwork";

export default function AdminArtworkPage() {
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
        readComponent={<div className="h-[2000px]">Read Artwork</div>}
        updateComponent={<UpdateArtwork />}
        deleteComponent={<DeleteArtwork />}
      />
    </AdminContentLayout>
  );
}
