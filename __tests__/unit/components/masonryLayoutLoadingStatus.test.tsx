import { render, screen } from "@testing-library/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { MasonryLayout } from "@/components/layouts/public/MasonryLayout";

jest.mock("@/hooks/useInfiniteScroll", () => ({
  useInfiniteScroll: jest.fn(),
}));

const mockUseInfiniteScroll = useInfiniteScroll as jest.Mock;

describe("MasonryLayout loading status", () => {
  beforeEach(() => {
    mockUseInfiniteScroll.mockReturnValue({
      observerRef: { current: null },
      isLoading: false,
      error: null,
    });
  });

  it("announces artwork pagination loading", () => {
    render(
      <MasonryLayout
        artworks={[]}
        hasMore
        onLoadMore={jest.fn()}
        isLoading
      />
    );

    expect(
      screen.getByRole("status", { name: "Loading more artworks" })
    ).toBeInTheDocument();
  });
});
