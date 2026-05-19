import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { BlogListView } from "@/components/views/BlogListView";
import { BlogSectionContinuous } from "@/components/sections/BlogSectionContinuous";
import { BlogsSectionFeatured } from "@/components/sections/BlogsSectionFeatured";
import { BlogSectionSplitScreen } from "@/components/sections/BlogSectionSplitScreen";
import { BlogSectionTiles } from "@/components/sections/BlogSectionTiles";
import { BlogsViewPagination } from "@/components/modules/pagination/BlogsViewPagination";

jest.mock("@/components/layouts/public/BlogsViewLayout", () => ({
  BlogsViewLayout: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/modules/cards/BlogsViewCard", () => ({
  BlogsViewCardSkeleton: () => <div data-testid="blog-card-skeleton" />,
}));

jest.mock("@/components/compositions/SkeletonFactory", () => ({
  SkeletonFactory: () => <div data-testid="skeleton-factory" />,
}));

jest.mock("@/components/sections/BlogSectionContinuous", () => ({
  BlogSectionContinuous: jest.fn(() => <div data-testid="continuous-blogs" />),
}));

jest.mock("@/components/sections/BlogsSectionFeatured", () => ({
  BlogsSectionFeatured: jest.fn(() => <div data-testid="featured-blogs" />),
}));

jest.mock("@/components/sections/BlogSectionSplitScreen", () => ({
  BlogSectionSplitScreen: jest.fn(() => <div data-testid="latest-blogs" />),
}));

jest.mock("@/components/sections/BlogSectionTiles", () => ({
  BlogSectionTiles: jest.fn(() => <div data-testid="popular-blogs" />),
}));

jest.mock("@/components/modules/pagination/BlogsViewPagination", () => ({
  BlogsViewPagination: jest.fn(() => <nav data-testid="blog-pagination" />),
}));

jest.mock("@/components/elements/typography/BlogSectionHeading", () => ({
  __esModule: true,
  default: ({ heading }: { heading: string }) => <h2>{heading}</h2>,
}));

const createBlog = (slug: string) =>
  ({
    slug,
    title: slug,
    linkTo: `/blog/${slug}`,
  }) as never;

describe("BlogListView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("forwards sorted pagination state to continuous loading and renders pagination links", () => {
    const blogs = [createBlog("one"), createBlog("two")];
    const prev = "/blog?sortby=popular&page=1";
    const next = "/blog?sortby=popular&page=3";

    render(
      <BlogListView
        blogData={{
          single: {
            type: "popular",
            data: blogs,
          },
          metadata: {
            page: 2,
            limit: 10,
            total: 25,
            totalPages: 3,
          },
        }}
        activeSortBy="popular"
        prev={prev}
        next={next}
      />
    );

    expect((BlogSectionContinuous as jest.Mock).mock.calls[0][0]).toEqual({
      initialBlogEntries: blogs,
      initialPage: 2,
      initialHasMore: true,
      sortby: "popular",
    });
    expect((BlogsViewPagination as jest.Mock).mock.calls[0][0]).toEqual({
      next,
      prev,
    });
  });

  it("keeps grouped blog lists on their existing section layout without pagination", () => {
    const featured = [createBlog("featured")];
    const latest = [createBlog("latest")];
    const popular = [createBlog("popular")];

    render(
      <BlogListView
        blogData={{
          featured,
          latest,
          popular,
          metadata: {
            page: 1,
            limit: 10,
            total: 3,
            totalPages: 1,
          },
        }}
        prev={null}
        next={null}
      />
    );

    expect((BlogsSectionFeatured as jest.Mock).mock.calls[0][0]).toEqual({
      blogEntries: featured,
    });
    expect((BlogSectionSplitScreen as jest.Mock).mock.calls[0][0]).toEqual({
      blogEntries: latest,
    });
    expect((BlogSectionTiles as jest.Mock).mock.calls[0][0]).toEqual({
      blogEntries: popular,
    });
    expect(BlogSectionContinuous).not.toHaveBeenCalled();
    expect(BlogsViewPagination).not.toHaveBeenCalled();
  });
});
