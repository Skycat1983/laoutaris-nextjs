"use server";

import { BlogEntryData } from "../loaders/viewLoaders/BlogListLoader";
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
  blogEntries: BlogEntryData[];
  next: string | null;
  prev: string | null;
}

const BlogListView = ({ blogEntries, next, prev }: BlogListViewProps) => {
  return (
    <>
      {/* Featured Blogs Section */}
      <BlogsSectionFeatured blogEntries={blogEntries} next={next} prev={prev} />

      {/* Latest Posts Section */}
      <BlogSectionHeading heading="Latest Posts" />
      <BlogSectionSplitScreen
        blogEntries={blogEntries}
        next={next}
        prev={prev}
      />

      {/* Popular Posts Section */}
      <BlogSectionHeading heading="Popular Posts" />
      <BlogSectionTiles blogEntries={blogEntries} next={next} prev={prev} />

      {/* All Posts Section */}
      <BlogSectionHeading heading="All Posts" />
      <BlogSectionContinuous
        blogEntries={blogEntries}
        next={next}
        prev={prev}
      />
      {/* ! UNUSED PAGINATION COMPONENT */}
      {/* <BlogsViewPagination next={next} prev={prev} /> */}
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
