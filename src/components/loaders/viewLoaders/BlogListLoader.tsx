"use server";

import { transformToPick } from "@/lib/transforms/transformToPick";
import type { FrontendBlogEntry } from "@/lib/data/types/blogTypes";
// import { BlogListView } from "@/components/views/BlogListView";
import { transformToPaginationLinks } from "@/lib/transforms/paginationTransforms";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
// Combo 1
import { CarouselLayout } from "@/components/views/AlternativeBlogLayouts";
import {
  CategoryCards,
  MagazineSpotlight,
  MagazineSpotlight2,
} from "@/components/views/MoreBlogLayouts";

// Combo 2
import {
  MagazineFeatured,
  SplitScreenFeatured,
} from "@/components/views/FeaturedListVariations";

import { HorizontalScrollLayout } from "@/components/views/AlternativeBlogLayouts";
import { FeaturedBlog } from "@/components/views/FeaturedListVariations";
import HorizontalDivider from "@/components/elements/misc/HorizontalDivider";
import { Subnav } from "@/components/modules/navigation/subnav/Subnav";
import { BLOG_NAV_LINKS } from "@/lib/shared/constants/navigationLinks";
// Config Constants
const BLOG_ENTRIES_CONFIG = {
  fields: [
    "title",
    "subtitle",
    "slug",
    "imageUrl",
    "summary",
    "displayDate",
    // "tags",
  ] as const,
  limit: 10,
} as const;

// Type Definitions
export type BlogEntryData = Pick<
  FrontendBlogEntry,
  (typeof BLOG_ENTRIES_CONFIG.fields)[number]
>;

interface BlogEntriesLoaderProps {
  sortby: "latest" | "oldest" | "popular" | "featured";
  page: number;
}

// Loader Function
export async function BlogListLoader({ sortby, page }: BlogEntriesLoaderProps) {
  try {
    const result = (await serverPublicApi.blog.fetchBlogs({
      sortby,
      page,
      limit: BLOG_ENTRIES_CONFIG.limit,
      fields: BLOG_ENTRIES_CONFIG.fields,
    })) as ApiResponse<FrontendBlogEntry[]>;

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch blog entries");
    }

    const { data: blogs, metadata } = result as PaginatedResponse<
      FrontendBlogEntry[]
    >;

    // Transform blogs with explicit typing
    const transformedBlogs: BlogEntryData[] = blogs.map((blog) =>
      transformToPick(blog, BLOG_ENTRIES_CONFIG.fields)
    );

    const currentUrl = `/blog?sortby=${sortby}&page=${page}`;
    const { prev, next } = transformToPaginationLinks(
      metadata.page,
      metadata.limit,
      metadata.total,
      currentUrl
    );

    const Combo1 = () => {
      return (
        <>
          <CarouselLayout
            blogEntries={transformedBlogs}
            next={next}
            prev={prev}
          />
          <CategoryCards
            blogEntries={transformedBlogs}
            next={next}
            prev={prev}
          />
        </>
      );
    };

    const LatestBlogs = () => {
      return (
        <>
          {/* <Subnav links={BLOG_NAV_LINKS} /> */}

          <FeaturedBlog blogEntries={transformedBlogs} />
          {/* <CategoryCards
            blogEntries={transformedBlogs}
            next={next}
            prev={prev}
          /> */}
          {/* <DynamicGrid blogEntries={transformedBlogs} next={next} prev={prev} /> */}
          <HorizontalScrollLayout
            blogEntries={transformedBlogs}
            next={next}
            prev={prev}
          />
        </>
      );
    };

    const Divider = () => {
      return (
        <>
          <div className="py-8 container mx-auto">
            <HorizontalDivider />
          </div>
          <div className="py-8 container mx-auto">
            <HorizontalDivider />
          </div>
        </>
      );
    };

    return (
      <>
        {/* <Subnav links={BLOG_NAV_LINKS} /> */}
        <MagazineFeatured blogEntries={transformedBlogs} />

        <Divider />
        <SplitScreenFeatured blogEntries={transformedBlogs} />
        <Divider />
        <LatestBlogs />
        <Divider />
        <Combo1 />
        <Divider />
        <MagazineSpotlight
          blogEntries={transformedBlogs}
          next={next}
          prev={prev}
        />
        <Divider />
        <MagazineSpotlight2
          blogEntries={transformedBlogs}
          next={next}
          prev={prev}
        />
        <Divider />

        {/* <DynamicGrid blogEntries={transformedBlogs} next={next} prev={prev} /> */}

        {/* <Combo1 /> */}
        {/* <BlogListView2 blogEntries={transformedBlogs} next={next} prev={prev} /> */}
        {/* <MasonryLayout blogEntries={transformedBlogs} next={next} prev={prev} /> */}
      </>
    );
  } catch (error) {
    throw error;
  }
}
