import fs from "fs";
import path from "path";
import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Searchbar from "@/components/elements/inputs/Searchbar";
import { FavouritesButton } from "@/components/elements/buttons/FavouritesButton";
import { WatchlistButton } from "@/components/elements/buttons/WatchlistButton";
import { FilterableArtworks } from "@/components/modules/hero/slides/FilterableArtworks";
import { SearchDrawerBody } from "@/components/modules/search/SearchDrawerBody";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

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

jest.mock("@/components/shadcn/drawer", () => ({
  DrawerContent: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  DrawerClose: ({ children }: { children: ReactNode }) => <>{children}</>,
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

  it("submits mobile drawer search from a labelled pending-capable button", () => {
    const setOpen = jest.fn();
    render(<SearchDrawerBody setOpen={setOpen} />);

    const input = screen.getByRole("textbox", { name: "Search" });
    const submit = screen.getByRole("button", { name: "Submit search" });

    fireEvent.change(input, { target: { value: "  blue study  " } });
    fireEvent.click(submit);

    expect(mockPush).toHaveBeenCalledWith("/search?q=blue+study");
  });

  it("routes hero collection search through the App Router", () => {
    render(<FilterableArtworks />);

    fireEvent.click(screen.getByRole("button", { name: "Search Collection" }));

    expect(mockPush).toHaveBeenCalledWith("/artwork?filterMode=ALL");
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
    const searchDrawerBodySource = readSource(
      "src/components/modules/search/SearchDrawerBody.tsx"
    );
    const mobileNavSource = readSource(
      "src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx"
    );
    const mobileNavBodySource = readSource(
      "src/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody.tsx"
    );

    expect(searchDrawerSource).toContain('aria-label="Open search"');
    expect(searchDrawerBodySource).toContain('aria-label="Close search"');
    expect(searchDrawerBodySource).toContain('aria-label="Submit search"');
    expect(searchDrawerSource).not.toMatch(/<DrawerTrigger asChild>\s*<Search/);
    expect(searchDrawerBodySource).not.toMatch(/<DrawerClose asChild>\s*<X/);

    expect(mobileNavSource).toContain('aria-label="Open navigation menu"');
    expect(mobileNavBodySource).toContain(
      'aria-label="Close navigation menu"'
    );
    expect(mobileNavSource).not.toMatch(/<DrawerTrigger asChild>\s*<Menu/);
    expect(mobileNavBodySource).not.toMatch(/<DrawerClose asChild>\s*<X/);
  });

  it("keeps mobile drawer bodies out of the initial public header path", () => {
    const mobileNavLayoutSource = readSource(
      "src/components/modules/navigation/mainNav/MobileNavLayout.tsx"
    );
    const searchDrawerSource = readSource(
      "src/components/modules/search/SearchDrawer.tsx"
    );
    const mobileNavSource = readSource(
      "src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx"
    );

    expect(searchDrawerSource).toContain('from "next/dynamic"');
    expect(mobileNavSource).toContain('from "next/dynamic"');
    expect(searchDrawerSource).not.toContain("useRouter");
    expect(searchDrawerSource).not.toContain("DrawerContent");
    expect(mobileNavSource).not.toContain("useSession");
    expect(mobileNavSource).not.toContain("DrawerContent");
    expect(mobileNavLayoutSource).not.toContain("SearchDrawerBody");
    expect(mobileNavLayoutSource).not.toContain("MobileNavDrawerBody");
  });

  it("keeps programmatic public navigation on App Router pending paths", () => {
    const searchbarSource = readSource(
      "src/components/elements/inputs/Searchbar.tsx"
    );
    const searchDrawerBodySource = readSource(
      "src/components/modules/search/SearchDrawerBody.tsx"
    );
    const heroSearchSource = readSource(
      "src/components/modules/hero/slides/FilterableArtworks.tsx"
    );

    expect(searchbarSource).toContain("Opening search results");
    expect(searchDrawerBodySource).toContain("Opening mobile search results");
    expect(heroSearchSource).toContain("Opening collection...");

    expect(heroSearchSource).toContain("router.push(searchUrl)");
    expect(heroSearchSource).not.toContain("window.location.href");
  });

  it("does not reintroduce clickable div wrappers for scoped public controls", () => {
    const scopedSources = [
      "src/components/elements/inputs/Searchbar.tsx",
      "src/components/elements/buttons/FavouritesButton.tsx",
      "src/components/elements/buttons/WatchlistButton.tsx",
      "src/components/modules/hero/slides/FilterableArtworks.tsx",
    ].map(readSource);

    for (const source of scopedSources) {
      expect(source).not.toMatch(/<div[^>]*\bonClick=/);
    }
  });
});
