"use server";

import {
  BlogEntryData,
  SortedBlogData,
} from "../loaders/viewLoaders/BlogListLoader";
import { BlogsViewLayout } from "../layouts/public/BlogsViewLayout";
import { BlogsViewCardSkeleton } from "../modules/cards/BlogsViewCard";
import { SkeletonFactory } from "../compositions/SkeletonFactory";
import { BlogsViewPagination } from "../modules/pagination/BlogsViewPagination";
import { BLOG_NAV_LINKS } from "@/lib/shared/constants/navigationLinks";
import { Subnav } from "../modules/navigation/subnav/Subnav";
import { BlogsSectionFeatured } from "../sections/BlogsSectionFeatured";
import { BlogSectionSplitScreen } from "../sections/BlogSectionSplitScreen";
import { BlogSectionContinuous } from "../sections/BlogSectionContinuous";
import { BlogSectionTiles } from "../sections/BlogSectionTiles";
import BlogSectionHeading from "../elements/typography/BlogSectionHeading";

interface BlogListViewProps {
  blogData: SortedBlogData;
  next: string | null;
  prev: string | null;
}

const BlogListView = ({ blogData, next, prev }: BlogListViewProps) => {
  // If we have a single sort type, show continuous view
  if (blogData.single) {
    return (
      <>
        <BlogSectionHeading heading={`${blogData.single.type} Posts`} />
        <BlogSectionContinuous
          blogEntries={blogData.single.data}
          next={next}
          prev={prev}
        />
      </>
    );
  }

  // Otherwise show all sections
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
