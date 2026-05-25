import type { ReactNode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { clientApi } from "@/lib/api/clientApi";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/components/artwork/filters/FilterDrawerWrapper", () => ({
  FilterDrawerWrapper: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/artwork/filters/ArtworkSortAndFilter", () => ({
  ArtworkSortAndFilter: () => null,
}));

jest.mock("@/components/layouts/public/MasonryLayout", () => ({
  MasonryLayout: ({
    artworks,
    hasMore,
    isLoading,
    onLoadMore,
  }: {
    artworks: Array<{ _id: string; title: string }>;
    hasMore: boolean;
    isLoading?: boolean;
    onLoadMore: () => Promise<void> | void;
  }) => (
    <div
      data-testid="masonry-layout"
      data-has-more={String(hasMore)}
      data-is-loading={String(isLoading)}
    >
      {artworks.map((artwork) => (
        <p key={artwork._id}>{artwork.title}</p>
      ))}
      <button type="button" onClick={() => void onLoadMore()}>
        load more artworks
      </button>
    </div>
  ),
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    public: {
      artwork: {
        multiple: jest.fn(),
      },
    },
  },
}));

const mockArtworkMultiple = clientApi.public.artwork.multiple as jest.Mock;

const createArtwork = (id: string, title: string) =>
  ({
    _id: id,
    title,
  }) as never;

describe("ArtworkGallery pagination state", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads page 4 after a server-rendered page 3 browse list", async () => {
    mockArtworkMultiple.mockResolvedValueOnce({
      success: true,
      data: [createArtwork("artwork-4", "Page 4 artwork")],
      metadata: {
        page: 4,
        limit: 10,
        total: 50,
        totalPages: 5,
      },
    });

    render(
      <ArtworkGallery
        startingArtworks={[createArtwork("artwork-3", "Page 3 artwork")]}
        filterDefaults={{
          filterMode: "ALL",
          page: 3,
          limit: 10,
        }}
        paginationMetadata={{
          page: 3,
          limit: 10,
          total: 50,
          totalPages: 5,
        }}
      />
    );

    expect(screen.getByTestId("masonry-layout")).toHaveAttribute(
      "data-has-more",
      "true"
    );

    fireEvent.click(
      screen.getByRole("button", { name: "load more artworks" })
    );

    await waitFor(() =>
      expect(mockArtworkMultiple).toHaveBeenCalledWith({
        filterMode: "ALL",
        page: 4,
        limit: 10,
      })
    );

    expect(await screen.findByText("Page 4 artwork")).toBeInTheDocument();
  });

  it("does not request another page from a server-rendered terminal page", () => {
    render(
      <ArtworkGallery
        startingArtworks={[createArtwork("artwork-5", "Page 5 artwork")]}
        filterDefaults={{
          filterMode: "ALL",
          page: 5,
          limit: 10,
        }}
        paginationMetadata={{
          page: 5,
          limit: 10,
          total: 50,
          totalPages: 5,
        }}
      />
    );

    expect(screen.getByTestId("masonry-layout")).toHaveAttribute(
      "data-has-more",
      "false"
    );

    fireEvent.click(
      screen.getByRole("button", { name: "load more artworks" })
    );

    expect(mockArtworkMultiple).not.toHaveBeenCalled();
  });
});
