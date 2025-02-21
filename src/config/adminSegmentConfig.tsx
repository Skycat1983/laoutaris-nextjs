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
import { ArticleOperations } from "@/components/modules/forms/admin/article/ArticleOperations";
import { ReadArticleList } from "@/components/admin/crud/read/ReadArticleList";
import { ArticleListSkeleton } from "@/components/admin/crud/read/ReadArticleList";
import {
  BlogListSkeleton,
  ReadBlogList,
} from "@/components/admin/crud/read/ReadBlogList";

export const adminSegmentConfig = {
  articles: {
    createComponent: <ArticleOperations operationType="create" />,
    readComponent: (
      <Suspense fallback={<ArticleListSkeleton />}>
        <ReadArticleList />
      </Suspense>
    ),
    updateComponent: <ArticleOperations operationType="update" />,
    deleteComponent: <ArticleOperations operationType="delete" />,
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
    readComponent: (
      <Suspense fallback={<BlogListSkeleton />}>
        <ReadBlogList />
      </Suspense>
    ),
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
