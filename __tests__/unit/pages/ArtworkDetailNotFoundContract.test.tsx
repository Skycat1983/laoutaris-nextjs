import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import ArtworkNotFound from "@/app/artwork/[artworkId]/not-found";
import ArtworkDetailPage, {
  generateMetadata as generateArtworkMetadata,
} from "@/app/artwork/[artworkId]/page";
import CollectionArtworkNotFound from "@/app/collections/[slug]/[artworkId]/not-found";
import CollectionArtworkPage, {
  generateMetadata as generateCollectionArtworkMetadata,
} from "@/app/collections/[slug]/[artworkId]/page";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/loaders/viewLoaders/ArtworkLoader", () =>
  jest.fn(() => null)
);

jest.mock("@/components/loaders/viewLoaders/CollectionArtworkLoader", () => ({
  CollectionArtworkLoader: jest.fn(() => null),
}));

jest.mock("@/components/elements/skeletons/ArtworkViewSkeleton", () =>
  jest.fn(() => null)
);

jest.mock("@/components/metadata/PublicDetailJsonLd", () => ({
  ArtworkStructuredData: jest.fn(() => null),
  CollectionArtworkStructuredData: jest.fn(() => null),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

jest.mock("@/lib/data/services/getCollectionArtwork", () => ({
  getCollectionArtwork: jest.fn(),
}));

const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;
const mockGetCollectionArtwork =
  getCollectionArtwork as jest.MockedFunction<typeof getCollectionArtwork>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

describe("artwork detail not-found contract", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls notFound for malformed standalone artwork IDs before primary content access", () => {
    expect(() =>
      ArtworkDetailPage({ params: { artworkId: "installHook.js.map" } })
    ).toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockGetArtworkById).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns missing metadata for malformed standalone artwork IDs without data access", async () => {
    await expect(
      generateArtworkMetadata({ params: { artworkId: "invalid" } })
    ).resolves.toEqual({
      title: "Artwork not found",
      robots: {
        index: false,
        follow: false,
      },
    });

    expect(mockGetArtworkById).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls notFound for malformed collection artwork IDs before primary content access", async () => {
    await expect(
      CollectionArtworkPage({
        params: { slug: "paintings", artworkId: "bad-id" },
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockGetCollectionArtwork).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns missing metadata for malformed collection artwork IDs without service access", async () => {
    await expect(
      generateCollectionArtworkMetadata({
        params: { slug: "paintings", artworkId: "bad-id" },
      })
    ).resolves.toEqual({
      title: "Artwork not found",
      robots: {
        index: false,
        follow: false,
      },
    });

    expect(mockGetCollectionArtwork).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("uses shared public presentation for route-local not-found views", () => {
    const { rerender } = render(<ArtworkNotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Artwork not found"
    );
    expect(screen.getByRole("link", { name: "Browse artwork" })).toHaveAttribute(
      "href",
      "/artwork"
    );

    rerender(<CollectionArtworkNotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Collection artwork not found"
    );
    expect(
      screen.getByRole("link", { name: "Browse collections" })
    ).toHaveAttribute("href", "/collections");
  });
});
