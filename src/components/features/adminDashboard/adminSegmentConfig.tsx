import { ReadArticleList } from "./crudForms/read/ReadArticleList";
import { ReadArtworkList } from "./crudForms/read/ReadArtworkList";
import { ArtworkListSkeleton } from "./crudForms/read/ReadArtworkList";
import { Suspense } from "react";
import { ArticleListSkeleton } from "./crudForms/read/ReadArticleList";
import { ArticleOperations } from "./operationTabs/ArticleOperations";
import { ArtworkOperations } from "./operationTabs/ArtworkOperations";
import { ReadCollectionList } from "./crudForms/read/ReadCollectionList";
import { ReadBlogList } from "./crudForms/read/ReadBlogList";
import { BlogListSkeleton } from "./crudForms/read/ReadBlogList";
import { CollectionListSkeleton } from "./crudForms/read/ReadCollectionList";
import { BlogOperations } from "./operationTabs/BlogOperations";
import { CollectionOperations } from "./operationTabs/CollectionOperations";
import { CommentOperations } from "./operationTabs/CommentOperations";
import { ReadCommentList } from "./crudForms/read/ReadCommentList";
import { CommentListSkeleton } from "./crudForms/read/ReadCommentList";
import { ReadUserList } from "./crudForms/read/ReadUserList";
import { UserListSkeleton } from "./crudForms/read/ReadUserList";
import { UserOperations } from "./operationTabs/UserOperations";

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
