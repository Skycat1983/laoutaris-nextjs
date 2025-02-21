import { CreateArticle } from "@/components/modules/forms/admin/CreateArticle";
import { UpdateArticle } from "@/components/modules/forms/admin/UpdateArticle";
import { DeleteArticle } from "@/components/modules/forms/admin/DeleteArticle";
import { CreateArtworkWithUpload } from "@/components/modules/forms/admin/CreateArtworkWithUpload";
import { UpdateArtwork } from "@/components/modules/forms/admin/UpdateArtwork";
import { DeleteArtwork } from "@/components/modules/forms/admin/DeleteArtwork";
import { CreateBlogForm } from "@/components/modules/forms/admin/CreateBlogForm";
import { UpdateBlogEntry } from "@/components/modules/forms/admin/UpdateBlogEntry";
import { DeleteBlogEntry } from "@/components/modules/forms/admin/DeleteBlogEntry";
import { CreateCollectionForm } from "@/components/modules/forms/admin/CreateCollectionForm";
import { UpdateCollection } from "@/components/modules/forms/admin/UpdateCollection";
import { ReadArtworkList } from "@/components/admin/crud/read/ReadArtworkList";
import { Suspense } from "react";
import { ArtworkListSkeleton } from "@/components/admin/crud/read/ReadArtworkList";

export const adminSegmentConfig = {
  articles: {
    createComponent: <CreateArticle />,
    readComponent: <div>Read Article</div>,
    updateComponent: <UpdateArticle />,
    deleteComponent: <DeleteArticle />,
  },
  artwork: {
    createComponent: <CreateArtworkWithUpload />,
    readComponent: (
      <Suspense fallback={<ArtworkListSkeleton />}>
        <ReadArtworkList />
      </Suspense>
    ),
    updateComponent: <UpdateArtwork />,
    deleteComponent: <DeleteArtwork />,
  },
  blogs: {
    createComponent: <CreateBlogForm />,
    readComponent: <div>Read Blog</div>,
    updateComponent: <UpdateBlogEntry />,
    deleteComponent: <DeleteBlogEntry />,
  },
  collections: {
    createComponent: <CreateCollectionForm />,
    readComponent: <div>Read Collection</div>,
    updateComponent: <UpdateCollection />,
    deleteComponent: <div>Delete Collection</div>,
  },
} as const;

// Type for our config
export type AdminSegment = keyof typeof adminSegmentConfig;
