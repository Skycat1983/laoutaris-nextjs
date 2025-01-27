import React from "react";
import { AdminContentLayout } from "@/components/layouts/AdminContentLayout";
import { AdminCrudTabs } from "@/components/admin/AdminCrudTabs";
import { CreateArtworkWithUpload } from "@/components/ui/forms/CreateArtworkWithUpload";
import { ArtworkFeed } from "@/components/admin/feeds/ArtworkFeed";
import { DeleteArtwork } from "@/components/admin/crud/DeleteArtwork";
// import { CreateArticleForm } from "@/components/forms/CreateArticleForm";
// import other forms...
export default function ArtworkPage() {
  return (
    <AdminContentLayout title="Artwork" feedComponent={<ArtworkFeed />}>
      <AdminCrudTabs
        createComponent={<CreateArtworkWithUpload />}
        readComponent={
          <div className="h-[2000px] bg-blue-600">Read Artwork</div>
        }
        updateComponent={<div>Update Artwork</div>}
        deleteComponent={<DeleteArtwork />}
      />
    </AdminContentLayout>
  );
}
