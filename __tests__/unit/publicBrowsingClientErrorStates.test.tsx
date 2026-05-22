/* eslint-disable @next/next/no-img-element */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { BlogDetail } from "@/components/views/BlogDetail";
import { clientApi } from "@/lib/api/clientApi";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";

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

jest.mock("@/components/modules/forms/user/CommentForm", () => ({
  __esModule: true,
  default: ({
    onCommentSubmit,
  }: {
    onCommentSubmit: (comment: { text: string; blogSlug: string }) => void;
  }) => (
    <button
      type="button"
      onClick={() =>
        onCommentSubmit({ text: "A thoughtful comment", blogSlug: "news" })
      }
    >
      Submit comment
    </button>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/components/artwork/filters/FilterDrawerWrapper", () => ({
  FilterDrawerWrapper: ({
    children,
    filterComponent: FilterComponent,
    filterProps,
  }: {
    children: React.ReactNode;
    filterComponent: React.ComponentType<Record<string, unknown>>;
    filterProps: Record<string, unknown>;
  }) => (
    <div>
      <FilterComponent {...filterProps} />
      {children}
    </div>
  ),
}));

jest.mock("@/components/artwork/filters/ArtworkSortAndFilter", () => ({
  ArtworkSortAndFilter: ({
    onFilterChange,
    onClearFilters,
  }: {
    onFilterChange: (filters: {
      decade: string[];
      filterMode: "ALL";
      sort: { by: "decade" };
    }) => void;
    onClearFilters: () => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onFilterChange({
            decade: ["1970s"],
            filterMode: "ALL",
            sort: { by: "decade" },
          })
        }
      >
        apply artwork filter
      </button>
      <button type="button" onClick={onClearFilters}>
        clear artwork filters
      </button>
    </div>
  ),
}));

jest.mock("@/components/sections/BlogCommentsList", () => ({
  BlogCommentsList: () => <div data-testid="blog-comments-list" />,
}));

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    public: {
      artwork: {
        multiple: jest.fn(),
      },
      blog: {
        singlePopulated: jest.fn(),
      },
    },
    user: {
      comments: {
        createComment: jest.fn(),
      },
    },
  },
}));

const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockArtworkMultiple = clientApi.public.artwork.multiple as jest.Mock;
const mockSinglePopulated = clientApi.public.blog.singlePopulated as jest.Mock;
const mockCreateComment = clientApi.user.comments.createComment as jest.Mock;
const mockOpenModal = jest.fn();

let intersectionCallback: IntersectionObserverCallback | null = null;

const HookProbe = ({
  onLoadMore,
  hasMore = true,
}: {
  onLoadMore: () => Promise<void>;
  hasMore?: boolean;
}) => {
  const { observerRef, isLoading, error } = useInfiniteScroll({
    onLoadMore,
    hasMore,
  });

  return (
    <div>
      <div ref={observerRef} data-testid="observer-target" />
      <span data-testid="loading-state">
        {isLoading ? "loading" : "idle"}
      </span>
      <span data-testid="error-state">{error?.message ?? ""}</span>
    </div>
  );
};

const blog = {
  title: "Studio news",
  subtitle: "Archive update",
  text: "First paragraph.\n\nSecond paragraph.",
  imageUrl: "https://res.cloudinary.com/demo/image/upload/blog.jpg",
  displayDate: "2026-05-18T00:00:00.000Z",
  slug: "studio-news",
  commentCount: 3,
};

const createArtwork = (id: string, title: string) =>
  ({
    _id: id,
    title,
    decade: "1970s",
    medium: "oil",
    surface: "canvas",
    favouriteCount: 0,
    watchlistCount: 0,
    collectionCount: 0,
    image: {
      secure_url: `https://res.cloudinary.com/demo/image/upload/${id}.jpg`,
      pixelWidth: 600,
      pixelHeight: 400,
      hexColors: [{ color: "#111111" }],
    },
  }) as never;

describe("public browsing client error states", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalFeatures.mockReturnValue({ openModal: mockOpenModal });
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    intersectionCallback = null;
    global.IntersectionObserver = jest.fn((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        root: null,
        rootMargin: "",
        thresholds: [],
        takeRecords: jest.fn(() => []),
      };
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("keeps infinite-scroll error state and loading reset when load-more rejects", async () => {
    const loadMoreError = new Error("Next page failed");
    const onLoadMore = jest.fn().mockRejectedValue(loadMoreError);

    render(<HookProbe onLoadMore={onLoadMore} />);

    expect(intersectionCallback).toBeDefined();

    await act(async () => {
      await intersectionCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("error-state")).toHaveTextContent(
      "Next page failed"
    );
    expect(screen.getByTestId("loading-state")).toHaveTextContent("idle");
  });

  it("shows artwork filter failures, preserves the current list, and clears after retry", async () => {
    mockArtworkMultiple
      .mockResolvedValueOnce({ success: false })
      .mockResolvedValueOnce({
        success: true,
        data: [createArtwork("filtered", "Filtered artwork")],
        metadata: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

    render(
      <ArtworkGallery
        startingArtworks={[createArtwork("current", "Current artwork")]}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "apply artwork filter" })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to update the artwork filters"
    );
    expect(screen.getByText("Current artwork")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry filters" }));

    await waitFor(() =>
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Filtered artwork")).toBeInTheDocument();
    expect(screen.queryByText("Current artwork")).not.toBeInTheDocument();
  });

  it("shows artwork load-more failures, preserves loaded artworks, and clears after retry", async () => {
    mockArtworkMultiple
      .mockResolvedValueOnce({ success: false })
      .mockResolvedValueOnce({
        success: true,
        data: [createArtwork("next", "Next artwork")],
        metadata: {
          page: 2,
          limit: 10,
          total: 2,
          totalPages: 2,
        },
      });

    render(
      <ArtworkGallery
        startingArtworks={[createArtwork("current", "Current artwork")]}
      />
    );

    expect(intersectionCallback).toBeDefined();

    await act(async () => {
      await intersectionCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(
      await screen.findByText(/Unable to load more artworks/)
    ).toBeInTheDocument();
    expect(screen.getByText("Current artwork")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    await waitFor(() =>
      expect(
        screen.queryByText(/Unable to load more artworks/)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByText("Current artwork")).toBeInTheDocument();
    expect(screen.getByText("Next artwork")).toBeInTheDocument();
  });

  it("keeps the comment-load failure modal behavior", async () => {
    mockSinglePopulated.mockRejectedValue(new Error("private response body"));

    render(<BlogDetail blog={blog as never} showComments={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Show Comments (3)" }));

    await waitFor(() => expect(mockOpenModal).toHaveBeenCalledTimes(1));
    expect(mockOpenModal.mock.calls[0][0].props).toEqual({
      message: "Failed to load comments",
      type: "error",
    });
    expect(
      screen.getByRole("button", { name: "Show Comments (3)" })
    ).toBeInTheDocument();
  });

  it("keeps the comment-post failure modal behavior", async () => {
    mockCreateComment.mockRejectedValue(new Error("private comment payload"));

    render(<BlogDetail blog={blog as never} showComments={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Submit comment" }));

    await waitFor(() => expect(mockOpenModal).toHaveBeenCalledTimes(1));
    expect(mockOpenModal.mock.calls[0][0].props).toEqual({
      message: "Failed to post comment",
      type: "error",
    });
  });
});
