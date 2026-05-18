import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import Searchbar from "@/components/elements/inputs/Searchbar";
import { FavouritesButton } from "@/components/elements/buttons/FavouritesButton";
import { WatchlistButton } from "@/components/elements/buttons/WatchlistButton";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

jest.mock("@/lib/actions/updateUserFavourites", () => ({
  updateUserFavourites: jest.fn(),
}));

jest.mock("@/lib/actions/updateUserWatchlist", () => ({
  updateUserWatchlist: jest.fn(),
}));

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  useFormState: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockUseFormState = useFormState as jest.Mock;
const mockPush = jest.fn();
const mockOpenModal = jest.fn();

const readSource = (sourcePath: string) =>
  fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8");

describe("public search and navigation accessibility controls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseGlobalFeatures.mockReturnValue({ openModal: mockOpenModal });
    mockUseFormState.mockImplementation((_action, initialState) => [
      initialState,
      jest.fn(),
    ]);
  });

  it("submits desktop search from a labelled submit button", () => {
    render(<Searchbar />);

    const input = screen.getByRole("textbox", { name: "Search" });
    const submit = screen.getByRole("button", { name: "Submit search" });

    expect(submit).toHaveAttribute("type", "submit");

    fireEvent.change(input, { target: { value: "  red figure  " } });
    fireEvent.click(submit);

    expect(mockPush).toHaveBeenCalledWith("/search?q=red+figure");
  });

  it("opens the existing login modal from unauthenticated saved-item buttons", () => {
    render(
      <>
        <FavouritesButton
          isLoggedIn={false}
          isFavourited={false}
          artworkId="artwork-1"
        />
        <WatchlistButton
          isLoggedIn={false}
          isWatchlisted={false}
          artworkId="artwork-1"
        />
      </>
    );

    const favouriteButton = screen.getByRole("button", { name: "Favourite" });
    const watchlistButton = screen.getByRole("button", { name: "Watchlist" });

    expect(favouriteButton).toHaveAttribute("type", "button");
    expect(watchlistButton).toHaveAttribute("type", "button");

    fireEvent.click(favouriteButton);
    fireEvent.click(watchlistButton);

    expect(mockOpenModal).toHaveBeenCalledTimes(2);
    for (const [modalContent] of mockOpenModal.mock.calls) {
      expect(modalContent).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            message: "You need to be logged in to do this",
          }),
        })
      );
    }
  });

  it("keeps drawer icon triggers and closes as labelled buttons", () => {
    const searchDrawerSource = readSource(
      "src/components/modules/search/SearchDrawer.tsx"
    );
    const mobileNavSource = readSource(
      "src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx"
    );

    expect(searchDrawerSource).toContain('aria-label="Open search"');
    expect(searchDrawerSource).toContain('aria-label="Close search"');
    expect(searchDrawerSource).not.toMatch(/<DrawerTrigger asChild>\s*<Search/);
    expect(searchDrawerSource).not.toMatch(/<DrawerClose asChild>\s*<X/);

    expect(mobileNavSource).toContain('aria-label="Open navigation menu"');
    expect(mobileNavSource).toContain('aria-label="Close navigation menu"');
    expect(mobileNavSource).not.toMatch(/<DrawerTrigger asChild>\s*<Menu/);
    expect(mobileNavSource).not.toMatch(/<DrawerClose asChild>\s*<X/);
  });

  it("does not reintroduce clickable div wrappers for scoped public controls", () => {
    const scopedSources = [
      "src/components/elements/inputs/Searchbar.tsx",
      "src/components/elements/buttons/FavouritesButton.tsx",
      "src/components/elements/buttons/WatchlistButton.tsx",
    ].map(readSource);

    for (const source of scopedSources) {
      expect(source).not.toMatch(/<div[^>]*\bonClick=/);
    }
  });
});
