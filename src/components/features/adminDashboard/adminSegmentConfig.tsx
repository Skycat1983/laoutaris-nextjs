import { CreateCollectionForm } from "@/components/modules/forms/admin/CreateCollectionForm";
import { UpdateCollection } from "@/components/modules/forms/admin/UpdateCollection";
import { ReadArtworkList } from "@/components/admin/crud/read/ReadArtworkList";
import { Suspense } from "react";
import { ArtworkListSkeleton } from "@/components/admin/crud/read/ReadArtworkList";
import { ReadArticleList } from "@/components/admin/crud/read/ReadArticleList";
import { ArticleListSkeleton } from "@/components/admin/crud/read/ReadArticleList";
import {
  BlogListSkeleton,
  ReadBlogList,
} from "@/components/admin/crud/read/ReadBlogList";
import { ArtworkOperations } from "@/components/features/adminDashboard/ArtworkOperations";
import { BlogOperations } from "@/components/features/adminDashboard/BlogOperations";
import { ArticleOperations } from "./ArticleOperations";
import { CollectionOperations } from "@/components/features/adminDashboard/CollectionOperations";

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
    createComponent: <ArtworkOperations operationType="create" />,
    readComponent: (
      <Suspense fallback={<ArtworkListSkeleton />}>
        <ReadArtworkList />
      </Suspense>
    ),
    updateComponent: <ArtworkOperations operationType="update" />,
    deleteComponent: <ArtworkOperations operationType="delete" />,
  },
  blogs: {
    createComponent: <BlogOperations operationType="create" />,
    readComponent: (
      <Suspense fallback={<BlogListSkeleton />}>
        <ReadBlogList />
      </Suspense>
    ),
    updateComponent: <BlogOperations operationType="update" />,
    deleteComponent: <BlogOperations operationType="delete" />,
  },
  collections: {
    createComponent: <CollectionOperations operationType="create" />,
    readComponent: <div>Read Collection</div>,
    updateComponent: <CollectionOperations operationType="update" />,
    deleteComponent: <CollectionOperations operationType="delete" />,
  },
  users: {
    createComponent: <div>Create User</div>,
    readComponent: <div>Read User</div>,
    updateComponent: <div>Update User</div>,
    deleteComponent: <div>Delete User</div>,
  },
  comments: {
    createComponent: <div>Create Comment</div>,
    readComponent: <div>Read Comment</div>,
    updateComponent: <div>Update Comment</div>,
    deleteComponent: <div>Delete Comment</div>,
  },
} as const;

// Type for our config
export type AdminSegment = keyof typeof adminSegmentConfig;
