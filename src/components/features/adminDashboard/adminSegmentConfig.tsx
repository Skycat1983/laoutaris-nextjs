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
import {
  CollectionListSkeleton,
  ReadCollectionList,
} from "@/components/admin/crud/read/ReadCollectionList";
import { UserOperations } from "./UserOperations";
import { CommentOperations } from "./CommentOperations";
import {
  UserListSkeleton,
  ReadUserList,
} from "@/components/admin/crud/read/ReadUserList";
import {
  CommentListSkeleton,
  ReadCommentList,
} from "@/components/admin/crud/read/ReadCommentList";

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
    readComponent: (
      <Suspense fallback={<CollectionListSkeleton />}>
        <ReadCollectionList />
      </Suspense>
    ),
    updateComponent: <CollectionOperations operationType="update" />,
    deleteComponent: <CollectionOperations operationType="delete" />,
  },
  users: {
    createComponent: <div>Not Available</div>,
    readComponent: (
      <Suspense fallback={<UserListSkeleton />}>
        <ReadUserList />
      </Suspense>
    ),
    updateComponent: <div>Not Available</div>,
    deleteComponent: <UserOperations operationType="delete" />,
    disabledOperations: ["create", "update"],
  },
  comments: {
    createComponent: <div>Not Available</div>,
    readComponent: (
      <Suspense fallback={<CommentListSkeleton />}>
        <ReadCommentList />
      </Suspense>
    ),
    updateComponent: <div>Not Available</div>,
    deleteComponent: <CommentOperations operationType="delete" />,
    disabledOperations: ["create", "update"],
  },
} as const;

// Type for our config
export type AdminSegment = keyof typeof adminSegmentConfig;
