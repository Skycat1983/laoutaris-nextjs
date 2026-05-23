import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { getServerSession } from "next-auth";
import { ArtworkArchiveInfoCard } from "@/components/modules/cards/ArtworkArchiveInfoCard";
import { FavouritesButton } from "@/components/elements/buttons/FavouritesButton";
import { WatchlistButton } from "@/components/elements/buttons/WatchlistButton";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: {},
}));

jest.mock("@/components/elements/buttons/FavouritesButton", () => ({
  FavouritesButton: jest.fn(() => <button type="button">Favourite</button>),
}));

jest.mock("@/components/elements/buttons/WatchlistButton", () => ({
  WatchlistButton: jest.fn(() => <button type="button">Watchlist</button>),
}));

const mockGetServerSession = getServerSession as jest.Mock;
const mockFavouritesButton = FavouritesButton as jest.Mock;
const mockWatchlistButton = WatchlistButton as jest.Mock;

const artwork = {
  _id: "507f1f77bcf86cd799439011",
  title: "No.054",
  decade: "1970s",
  artstyle: "semi-abstract",
  medium: "oil",
  surface: "canvas",
  featured: false,
  isWatchlisted: true,
  isFavourited: false,
  watchlistCount: 4,
  favouriteCount: 2,
  shopifyProducts: [],
  image: {
    secure_url: "https://example.com/artwork.jpg",
    public_id: "artwork",
    bytes: 1200,
    pixelHeight: 3504,
    pixelWidth: 2543,
    format: "jpg",
    hexColors: [
      { color: "#f2aa38", percentage: 34 },
      { color: "#b51f2a", percentage: 21 },
    ],
    predominantColors: {
      cloudinary: [],
      google: [],
    },
  },
} as unknown as ArtworkFrontend;

const renderCard = async (
  props: Partial<Parameters<typeof ArtworkArchiveInfoCard>[0]> = {}
) => {
  const element = await ArtworkArchiveInfoCard({
    ...artwork,
    ...props,
  });

  render(element);
};

describe("ArtworkArchiveInfoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1" },
    });
  });

  it("renders archive-style artwork metadata and palette from real artwork fields", async () => {
    await renderCard();

    expect(
      screen.getByRole("heading", { name: "No.054" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Semi-Abstract")).toHaveLength(2);
    expect(screen.getByText("1970s")).toBeInTheDocument();
    expect(screen.getByText("Oil on canvas")).toBeInTheDocument();
    expect(screen.getByText("3504 x 2543 px")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Find artworks with color #f2aa38")
    ).toHaveAttribute(
      "href",
      "/artwork?sortBy=colorProximity&sortColor=%23f2aa38"
    );
    expect(screen.queryByText("Curatorial note")).not.toBeInTheDocument();
  });

  it("passes saved-item state through to the existing action buttons", async () => {
    await renderCard();

    expect(mockWatchlistButton).toHaveBeenCalledWith(
      {
        artworkId: "507f1f77bcf86cd799439011",
        isLoggedIn: true,
        isWatchlisted: true,
      },
      {}
    );
    expect(mockFavouritesButton).toHaveBeenCalledWith(
      {
        artworkId: "507f1f77bcf86cd799439011",
        isFavourited: false,
        isLoggedIn: true,
      },
      {}
    );
  });

  it("keeps the legacy info card available while ArtworkView uses the archive card", () => {
    const legacyCardSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/modules/cards/ArtworkInfoCard.tsx"
      ),
      "utf8"
    );
    const viewSource = fs.readFileSync(
      path.join(process.cwd(), "src/components/views/ArtworkView.tsx"),
      "utf8"
    );

    expect(legacyCardSource).toContain(
      "export async function ArtworkInfoCard"
    );
    expect(viewSource).toContain("ArtworkArchiveInfoCard");
    expect(viewSource).not.toContain("<ArtworkInfoCard");
  });
});
