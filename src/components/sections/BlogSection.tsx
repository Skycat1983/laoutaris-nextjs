import { SectionLayout } from "../layouts/public/SectionLayout";

import { BlogCardData } from "@/components/loaders/sectionLoaders/BlogSectionLoader";
import { ReactNode } from "react";
import { BlogCard, BlogCardSkeleton } from "../modules/cards/BlogCard";
import { SkeletonFactory } from "../compositions/SkeletonFactory";

interface GridLayoutProps {
  children: ReactNode;
}

export const BlogGrid = ({ children }: GridLayoutProps) => {
  return (
    <section className="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-4 lg:grid-rows-1 p-4 w-full py-8 gap-5">
      {children}
    </section>
  );
};

interface BlogSectionProps {
  blogs: BlogCardData[];
}

export const BlogSection = ({ blogs }: BlogSectionProps) => {
  return (
    <SectionLayout
      heading="Blog:"
      subheading="Recent posts"
      buttonLabel="See more"
      buttonLink="/blog"
    >
      <BlogGrid>
        {blogs.map((blog, index) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </BlogGrid>
    </SectionLayout>
  );
};

export const BlogSectionSkeleton = () => (
  <SkeletonFactory Layout={BlogGrid} Card={BlogCardSkeleton} count={4} />
);
