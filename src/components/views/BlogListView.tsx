"use server";

import { BlogEntryData } from "../loaders/viewLoaders/BlogListLoader";
import { BlogsViewLayout } from "../layouts/public/BlogsViewLayout";
import {
  BlogsViewCard,
  BlogsViewCardSkeleton,
} from "../modules/cards/BlogsViewCard";
import { SkeletonFactory } from "../compositions/SkeletonFactory";
import { BlogsViewPagination } from "../modules/pagination/BlogsViewPagination";

interface BlogListViewProps {
  blogEntries: BlogEntryData[];
  next: string | null;
  prev: string | null;
}

const BlogListView = ({ blogEntries, next, prev }: BlogListViewProps) => {
  return (
    <>
      <BlogsViewLayout>
        {blogEntries.map((blog, index) => (
          <BlogsViewCard key={index} blog={blog} />
        ))}
      </BlogsViewLayout>
      <BlogsViewPagination next={next} prev={prev} />
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
