/* eslint-disable @next/next/no-img-element */
import { act, render, screen } from "@testing-library/react";
import { BlogSectionContinuous } from "@/components/sections/BlogSectionContinuous";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { clientApi } from "@/lib/api/clientApi";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

jest.mock("@/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(),
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    public: {
      blog: {
        multiple: jest.fn(),
      },
    },
  },
}));

jest.mock("@/lib/images/cloudinaryDelivery", () => ({
  getCloudinaryDeliveryUrl: (src?: string) => src ?? "",
}));

const mockUseInfiniteScroll = useInfiniteScroll as jest.Mock;
const mockBlogMultiple = clientApi.public.blog.multiple as jest.Mock;

let latestInfiniteScrollOptions: {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
} | null = null;

const createBlog = (slug: string) =>
  ({
    slug,
    title: slug,
    subtitle: `${slug} subtitle`,
    imageUrl: `https://res.cloudinary.com/demo/image/upload/${slug}.jpg`,
  }) as never;

describe("BlogSectionContinuous", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    latestInfiniteScrollOptions = null;
    mockUseInfiniteScroll.mockImplementation((options) => {
      latestInfiniteScrollOptions = options;
      return {
        observerRef: { current: null },
        isLoading: false,
        error: null,
        retry: jest.fn(),
      };
    });
  });

  it("preserves the active sort when loading the next sorted page", async () => {
    mockBlogMultiple.mockResolvedValue({
      success: true,
      data: [createBlog("third")],
      metadata: {
        page: 3,
        limit: 10,
        total: 30,
        totalPages: 3,
      },
    });

    render(
      <BlogSectionContinuous
        initialBlogEntries={[createBlog("first"), createBlog("second")]}
        initialPage={2}
        sortby="popular"
      />
    );

    await act(async () => {
      await latestInfiniteScrollOptions?.onLoadMore();
    });

    expect(mockBlogMultiple).toHaveBeenCalledWith({
      page: 3,
      limit: 10,
      sortby: "popular",
    });
    expect(screen.getByText("third")).toBeInTheDocument();
  });

  it("keeps unsorted follow-up requests on the default blog list behavior", async () => {
    mockBlogMultiple.mockResolvedValue({
      success: true,
      data: [createBlog("second")],
      metadata: {
        page: 2,
        limit: 10,
        total: 20,
        totalPages: 2,
      },
    });

    render(<BlogSectionContinuous initialBlogEntries={[createBlog("first")]} />);

    await act(async () => {
      await latestInfiniteScrollOptions?.onLoadMore();
    });

    expect(mockBlogMultiple).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
    });
  });

  it("passes the initial has-more state into infinite scroll", () => {
    render(
      <BlogSectionContinuous
        initialBlogEntries={[createBlog("only")]}
        initialHasMore={false}
      />
    );

    expect(latestInfiniteScrollOptions?.hasMore).toBe(false);
  });

  it("announces follow-up loading without replacing existing posts", () => {
    mockUseInfiniteScroll.mockImplementation((options) => {
      latestInfiniteScrollOptions = options;
      return {
        observerRef: { current: null },
        isLoading: true,
        error: null,
        retry: jest.fn(),
      };
    });

    render(<BlogSectionContinuous initialBlogEntries={[createBlog("first")]} />);

    expect(screen.getByText("first")).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Loading more blog posts" })
    ).toBeInTheDocument();
  });

  it("renders a visible follow-up loading error without removing existing posts", () => {
    const retry = jest.fn();
    mockUseInfiniteScroll.mockImplementation((options) => {
      latestInfiniteScrollOptions = options;
      return {
        observerRef: { current: null },
        isLoading: false,
        error: new Error("private fetch details"),
        retry,
      };
    });

    render(<BlogSectionContinuous initialBlogEntries={[createBlog("first")]} />);

    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load more blog posts"
    );

    screen.getByRole("button", { name: "Try again" }).click();
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
