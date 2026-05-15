jest.mock("mongoose", () => {
  class MockObjectId {
    private value: string;

    constructor(value = "mock-object-id") {
      this.value = value;
    }

    toString() {
      return this.value;
    }
  }

  class MockSchema {
    static Types = {
      ObjectId: MockObjectId,
    };
  }

  return {
    __esModule: true,
    default: {
      models: {},
      model: jest.fn(),
      Schema: MockSchema,
    },
    Types: {
      ObjectId: MockObjectId,
    },
    Schema: MockSchema,
  };
});

import {
  transformArtwork,
  transformArtworkPopulated,
} from "@/lib/transforms/artwork/transformArtwork";
import { cloudinaryImageSchema } from "@/lib/data/schemas/cloudinarySchema";

const createImage = (overrides: Record<string, unknown> = {}) => ({
  secure_url: "https://example.com/artwork.jpg",
  public_id: "artwork/private-cloudinary-id",
  bytes: 123456,
  pixelHeight: 1200,
  pixelWidth: 900,
  format: "jpg",
  hexColors: [
    { color: "#111111", percentage: 60 },
    { color: "#ffffff", percentage: 40 },
  ],
  predominantColors: {
    cloudinary: [{ color: "#111111", percentage: 60 }],
    google: [{ color: "#222222", percentage: 40 }],
  },
  ...overrides,
});

const createArtwork = (overrides: Record<string, unknown> = {}) => ({
  _id: "artwork-1",
  title: "Archive Painting",
  decade: "1980s",
  artstyle: "abstract",
  medium: "oil",
  surface: "canvas",
  featured: false,
  image: createImage(),
  collections: ["collection-1"],
  watcherlist: ["watcher-1"],
  favourited: ["favourite-1"],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  ...overrides,
});

const createCollection = (overrides: Record<string, unknown> = {}) => ({
  _id: "collection-1",
  title: "Recent Work",
  subtitle: "Paintings",
  summary: "A collection summary",
  text: "Collection text",
  imageUrl: "/collection.jpg",
  slug: "recent-work",
  section: "collections",
  artworks: ["artwork-1"],
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  ...overrides,
});

const expectedPublicImage = {
  secure_url: "https://example.com/artwork.jpg",
  bytes: 123456,
  pixelHeight: 1200,
  pixelWidth: 900,
  format: "jpg",
  hexColors: [
    { color: "#111111", percentage: 60 },
    { color: "#ffffff", percentage: 40 },
  ],
  predominantColors: {
    cloudinary: [{ color: "#111111", percentage: 60 }],
    google: [{ color: "#222222", percentage: 40 }],
  },
};

describe("public artwork image contracts", () => {
  it("sanitizes direct artwork image payloads while preserving public image fields", () => {
    const transformed = transformArtwork.toFrontend(createArtwork() as never);

    expect(transformed.image).toEqual(expectedPublicImage);
    expect(transformed.image).not.toHaveProperty("public_id");
    expect(transformed).toMatchObject({
      favouriteCount: 1,
      watchlistCount: 1,
      collectionCount: 1,
    });
  });

  it("sanitizes populated artwork image payloads", () => {
    const transformed = transformArtworkPopulated(
      createArtwork({
        collections: [createCollection()],
      }) as never
    );

    expect(transformed.image).toEqual(expectedPublicImage);
    expect(transformed.image).not.toHaveProperty("public_id");
    expect(transformed.collections[0]).toMatchObject({
      _id: "collection-1",
      firstArtworkId: "artwork-1",
    });
  });

  it("preserves color-proximity similarityScore as optional public-only image metadata", () => {
    const transformed = transformArtwork.toFrontend(
      createArtwork({
        image: createImage({
          hexColors: [{ color: "#111111", percentage: 60 }],
          similarityScore: 7,
        }),
      }) as never
    );

    expect(transformed.image).toEqual({
      ...expectedPublicImage,
      hexColors: [{ color: "#111111", percentage: 60 }],
      similarityScore: 7,
    });
    expect(transformed.image).not.toHaveProperty("public_id");
  });

  it("validates persisted Cloudinary color entries against the ColourInfo shape", () => {
    expect(cloudinaryImageSchema.safeParse(createImage()).success).toBe(true);

    expect(
      cloudinaryImageSchema.safeParse({
        ...createImage(),
        hexColors: [["#111111", 60]],
      }).success
    ).toBe(false);

    expect(
      cloudinaryImageSchema.safeParse({
        ...createImage(),
        predominantColors: {
          cloudinary: [{ color: "#111111", percentage: "60" }],
          google: [{ color: "#222222", percentage: 40 }],
        },
      }).success
    ).toBe(false);
  });

  it("keeps similarityScore out of persisted Cloudinary image validation", () => {
    expect(
      cloudinaryImageSchema.strict().safeParse({
        ...createImage(),
        similarityScore: 7,
      }).success
    ).toBe(false);
  });
});
