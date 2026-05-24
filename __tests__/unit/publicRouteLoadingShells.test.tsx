import { render, screen, within } from "@testing-library/react";
import ArtworkLoading from "@/app/artwork/loading";
import SearchLoading from "@/app/search/loading";

describe("public route loading shells", () => {
  it("renders an artwork route-shaped loading shell", () => {
    render(<ArtworkLoading />);

    const main = screen.getByRole("main", { busy: true });

    expect(
      within(main).getByRole("heading", { name: "Artwork" })
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("status", { name: "Loading artwork gallery" })
    ).toHaveTextContent("Loading artwork gallery");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders a search route-shaped loading shell", () => {
    render(<SearchLoading />);

    const main = screen.getByRole("main", { busy: true });

    expect(
      within(main).getByRole("heading", { name: "Search Results" })
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("status", { name: "Loading search results" })
    ).toHaveTextContent("Loading search results");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
