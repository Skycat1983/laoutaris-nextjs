"use server";

import type { SortedBlogData } from "../loaders/viewLoaders/BlogListLoader";
import { BlogsViewLayout } from "../layouts/public/BlogsViewLayout";
import { BlogsViewCardSkeleton } from "../modules/cards/BlogsViewCard";
import { SkeletonFactory } from "../compositions/SkeletonFactory";
import { BlogsViewPagination } from "../modules/pagination/BlogsViewPagination";
import { BlogsSectionFeatured } from "../sections/BlogsSectionFeatured";
import { BlogSectionSplitScreen } from "../sections/BlogSectionSplitScreen";
import { BlogSectionContinuous } from "../sections/BlogSectionContinuous";
import { BlogSectionTiles } from "../sections/BlogSectionTiles";
import BlogSectionHeading from "../elements/typography/BlogSectionHeading";

interface BlogListViewProps {
  blogData: SortedBlogData;
  activeSortBy?: NonNullable<SortedBlogData["single"]>["type"];
  next: string | null;
  prev: string | null;
}

const BlogListView = ({
  blogData,
  activeSortBy,
  next,
  prev,
}: BlogListViewProps) => {
  if (blogData.single) {
    const sortby = activeSortBy ?? blogData.single.type;

    return (
      <>
        <BlogSectionHeading heading={`${blogData.single.type} Posts`} />
        <BlogSectionContinuous
          initialBlogEntries={blogData.single.data}
          initialPage={blogData.metadata.page}
          initialHasMore={blogData.metadata.page < blogData.metadata.totalPages}
          sortby={sortby}
        />
        <BlogsViewPagination next={next} prev={prev} />
      </>
    );
  }

  // otherwise, render all sections
  return (
    <>
      {blogData.featured && (
        <>
          {/* <BlogSectionHeading heading="Featured Posts" /> */}
          <BlogsSectionFeatured blogEntries={blogData.featured} />
        </>
      )}

      {blogData.latest && (
        <>
          <BlogSectionHeading heading="Latest Posts" />
          <BlogSectionSplitScreen blogEntries={blogData.latest} />
        </>
      )}

      {blogData.popular && (
        <>
          <BlogSectionHeading heading="Popular Posts" />
          <BlogSectionTiles blogEntries={blogData.popular} />
        </>
      )}
    </>
  );
};

export const BlogListViewSkeleton = () => (
  <>
    <BlogsViewLayout>
      <SkeletonFactory
        Layout={({ children }) => <>{children}</>}
        Card={BlogsViewCardSkeleton}
        count={6}
      />
    </BlogsViewLayout>
    <BlogsViewPagination next={null} prev={null} />
  </>
);

export { BlogListView };
