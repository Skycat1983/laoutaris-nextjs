jest.mock("server-only", () => ({}), { virtual: true });

import { POST } from "@/app/api/v2/admin/artwork/create/route";
import { PATCH } from "@/app/api/v2/admin/artwork/update/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { ArtworkModel, UserModel } from "@/lib/data/models";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { getServerSession } from "next-auth";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  ArtworkModel: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

type MockRequest = {
  json: jest.Mock;
  headers: Headers;
  method: string;
  url: string;
};

type MockRequestOptions = {
  method?: string;
  requestId?: string | null;
  url?: string;
};

const adminUserId = "507f1f77bcf86cd799439011";
const artworkId = "507f1f77bcf86cd799439012";
const requestId = "req-admin-artwork";

const validImage = {
  secure_url: "https://example.com/artwork.jpg",
  public_id: "artwork/public-id",
  bytes: 123456,
  pixelHeight: 1200,
  pixelWidth: 900,
  format: "jpg",
  hexColors: [{ color: "#111111", percentage: 42 }],
  predominantColors: {
    cloudinary: [{ color: "#111111", percentage: 42 }],
    google: [{ color: "#222222", percentage: 58 }],
  },
};

const replacementImage = {
  ...validImage,
  secure_url: "https://example.com/replacement.jpg",
  public_id: "artwork/replacement-id",
};

const validCreatePayload = {
  title: "Untitled Archive",
  decade: "1980s",
  artstyle: "abstract",
  medium: "oil",
  surface: "canvas",
  featured: true,
  image: validImage,
};

const validShopifyProducts = [
  { productId: "10538938761480", type: "original" },
  { productId: "10538937319688", type: "book" },
] as const;

const validUpdatePayload = {
  title: "Updated Archive",
  decade: "1990s",
  artstyle: "figurative",
  medium: "acrylic",
  surface: "paper",
  featured: false,
};

const createdArtwork = {
  _id: artworkId,
  ...validCreatePayload,
  author: adminUserId,
};

const updatedArtwork = {
  _id: artworkId,
  ...validUpdatePayload,
  image: validImage,
};

const createRequest = (
  body: unknown,
  options: MockRequestOptions = {}
): MockRequest => ({
  json: jest.fn().mockResolvedValue(body),
  headers: new Headers(
    options.requestId === null
      ? {}
      : { "x-request-id": options.requestId ?? requestId }
  ),
  method: options.method ?? "POST",
  url: options.url ?? "http://localhost/api/v2/admin/artwork/create",
});

const createInvalidJsonRequest = (
  options: MockRequestOptions = {}
): MockRequest => ({
  json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
  headers: new Headers(
    options.requestId === null
      ? {}
      : { "x-request-id": options.requestId ?? requestId }
  ),
  method: options.method ?? "POST",
  url: options.url ?? "http://localhost/api/v2/admin/artwork/create",
});

const createArtworkDocument = (artwork: typeof createdArtwork) => ({
  toObject: jest.fn().mockReturnValue({
    ...artwork,
    __v: 0,
  }),
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArtworkCreate = ArtworkModel.create as jest.Mock;
const mockArtworkFindByIdAndUpdate = ArtworkModel.findByIdAndUpdate as jest.Mock;
const mockUserFindById = UserModel.findById as jest.Mock;
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

const setAdminSession = () => {
  mockGetServerSession.mockResolvedValue({
    user: {
      id: adminUserId,
      name: "Admin",
      email: "admin@example.com",
      role: "admin",
    },
    expires: "2099-01-01T00:00:00.000Z",
  });
  mockUserFindById.mockResolvedValue({ role: "admin" });
};

const setNonAdminSession = () => {
  mockGetServerSession.mockResolvedValue({
    user: {
      id: "507f1f77bcf86cd799439016",
      name: "Member",
      email: "member@example.com",
      role: "user",
    },
    expires: "2099-01-01T00:00:00.000Z",
  });
};

describe("POST /api/v2/admin/artwork/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockArtworkCreate.mockResolvedValue(createArtworkDocument(createdArtwork));
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const request = createRequest(validCreatePayload);

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockUserFindById).not.toHaveBeenCalled();
    expect(mockArtworkCreate).not.toHaveBeenCalled();
  });

  it("returns 403 without reading the body for authenticated non-admin callers", async () => {
    setNonAdminSession();
    const request = createRequest(validCreatePayload);

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      success: false,
      message: "Forbidden",
      error: "Forbidden",
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockUserFindById).not.toHaveBeenCalled();
    expect(mockArtworkCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid fields and does not write to MongoDB", async () => {
    const request = createRequest({
      ...validCreatePayload,
      title: "   ",
      decade: "1940s",
      image: {
        ...validImage,
        secure_url: "not-a-url",
      },
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {
        title: ["Title is required"],
        decade: [
          "Invalid enum value. Expected '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s', received '1940s'",
        ],
        image: ["Invalid url"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkCreate).not.toHaveBeenCalled();
  });

  it("rejects unknown create fields before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      author: "507f1f77bcf86cd799439099",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author'"],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkCreate).not.toHaveBeenCalled();
  });

  it("creates an artwork with validated Shopify product links", async () => {
    const request = createRequest({
      ...validCreatePayload,
      shopifyProducts: [
        { productId: " 10538938761480 ", type: "original" },
        { productId: "10538937319688", type: "book" },
      ],
    });

    const response = await POST(request as never);

    expect(response.status).toBe(201);
    expect(mockArtworkCreate).toHaveBeenCalledWith({
      ...validCreatePayload,
      shopifyProducts: validShopifyProducts,
      author: adminUserId,
    });
  });

  it.each([
    ["non-numeric IDs", [{ productId: "not-a-product-id", type: "original" }]],
    [
      "GID-style IDs",
      [{ productId: "gid://shopify/Product/10538938761480", type: "print" }],
    ],
    ["missing types", [{ productId: "10538938761480" }]],
    ["unknown types", [{ productId: "10538938761480", type: "poster" }]],
    [
      "within-artwork duplicate product IDs",
      [
        { productId: "10538938761480", type: "original" },
        { productId: " 10538938761480 ", type: "book" },
      ],
    ],
  ])("rejects create Shopify product links with %s", async (_label, links) => {
    const response = await POST(
      createRequest({
        ...validCreatePayload,
        shopifyProducts: links,
      }) as never
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid artwork input");
    expect(body.fieldErrors.shopifyProducts).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
    expect(mockArtworkCreate).not.toHaveBeenCalled();
  });

  it("creates an artwork from parsed fields and the session author", async () => {
    const request = createRequest({
      title: "  Untitled Archive  ",
      decade: "1980s",
      artstyle: "abstract",
      medium: "oil",
      surface: "canvas",
      featured: true,
      image: validImage,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkCreate).toHaveBeenCalledWith({
      ...validCreatePayload,
      title: "Untitled Archive",
      author: adminUserId,
    });
    expect(body).toEqual({
      success: true,
      data: createdArtwork,
    });
  });

  it("returns a public-safe 500 when artwork creation fails", async () => {
    const createRequestId = "req-admin-artwork-create";
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockArtworkCreate.mockRejectedValue(new Error("private database detail"));

    try {
      const response = await POST(
        createRequest(validCreatePayload, {
          requestId: createRequestId,
        }) as never
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(createRequestId);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockArtworkCreate).toHaveBeenCalledWith({
        ...validCreatePayload,
        author: adminUserId,
      });
      expect(body).toEqual({
        success: false,
        message: "Failed to create artwork",
        error: "Failed to create artwork",
        requestId: createRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          event: "api.admin.artwork_create.failed",
          level: "error",
          requestId: createRequestId,
          route: "/api/v2/admin/artwork/create",
          method: "POST",
          operation: "admin.artwork.create",
          errorLabel: "admin_artwork_create_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

describe("PATCH /api/v2/admin/artwork/update/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockArtworkFindByIdAndUpdate.mockResolvedValue(
      createArtworkDocument(updatedArtwork as typeof createdArtwork)
    );
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockUserFindById).not.toHaveBeenCalled();
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 403 without reading the body for authenticated non-admin callers", async () => {
    setNonAdminSession();
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      success: false,
      message: "Forbidden",
      error: "Forbidden",
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockUserFindById).not.toHaveBeenCalled();
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid artwork ID before reading the body", async () => {
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: "not-an-object-id" },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {
        id: ["Invalid artwork ID"],
      },
      formErrors: [],
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid update fields", async () => {
    const request = createRequest({
      medium: "marble",
      image: {
        ...replacementImage,
        public_id: 123,
      },
    });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {
        medium: [
          "Invalid enum value. Expected 'oil' | 'acrylic' | 'paint' | 'watercolour' | 'pastel' | 'pencil' | 'charcoal' | 'ink' | 'sand', received 'marble'",
        ],
        image: ["Expected string, received number"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("rejects unknown update fields before persistence", async () => {
    const request = createRequest({
      title: "Updated Archive",
      author: "507f1f77bcf86cd799439099",
    });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author'"],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("updates Shopify product links with validated canonical values", async () => {
    const request = createRequest({
      shopifyProducts: [
        { productId: " 10538938761480 ", type: "original" },
        { productId: "10538937319688", type: "book" },
      ],
    });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });

    expect(response.status).toBe(200);
    expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
      artworkId,
      {
        $set: {
          shopifyProducts: validShopifyProducts,
        },
      },
      { new: true }
    );
  });

  it("allows update Shopify product links to be cleared with an empty array", async () => {
    const request = createRequest({
      shopifyProducts: [],
    });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });

    expect(response.status).toBe(200);
    expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
      artworkId,
      {
        $set: {
          shopifyProducts: [],
        },
      },
      { new: true }
    );
  });

  it.each([
    ["non-numeric IDs", [{ productId: "not-a-product-id", type: "original" }]],
    [
      "GID-style IDs",
      [{ productId: "gid://shopify/Product/10538938761480", type: "print" }],
    ],
    ["missing types", [{ productId: "10538938761480" }]],
    ["unknown types", [{ productId: "10538938761480", type: "poster" }]],
    [
      "within-artwork duplicate product IDs",
      [
        { productId: "10538938761480", type: "original" },
        { productId: " 10538938761480 ", type: "book" },
      ],
    ],
  ])("rejects update Shopify product links with %s", async (_label, links) => {
    const response = await PATCH(
      createRequest({
        shopifyProducts: links,
      }) as never,
      { params: { id: artworkId } }
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Invalid artwork input");
    expect(body.fieldErrors.shopifyProducts).toEqual(
      expect.arrayContaining([expect.any(String)])
    );
    expect(mockArtworkFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 404 when the artwork is not found", async () => {
    mockArtworkFindByIdAndUpdate.mockResolvedValue(null);
    const request = createRequest({ title: "Updated Archive" });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
      artworkId,
      {
        $set: {
          title: "Updated Archive",
        },
      },
      { new: true }
    );
    expect(body).toEqual({
      success: false,
      message: "Artwork not found",
      error: "Artwork not found",
    });
  });

  it("updates only parsed fields without requiring a replacement image", async () => {
    const request = createRequest({
      title: "  Updated Archive  ",
      decade: "1990s",
      artstyle: "figurative",
      medium: "acrylic",
      surface: "paper",
      featured: false,
    });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
      artworkId,
      {
        $set: validUpdatePayload,
      },
      { new: true }
    );
    expect(body).toEqual({
      success: true,
      data: updatedArtwork,
    });
  });

  it("allows a validated replacement image when submitted", async () => {
    const request = createRequest({
      title: "Updated Archive",
      image: replacementImage,
    });

    const response = await PATCH(request as never, {
      params: { id: artworkId },
    });

    expect(response.status).toBe(200);
    expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
      artworkId,
      {
        $set: {
          title: "Updated Archive",
          image: replacementImage,
        },
      },
      { new: true }
    );
  });

  it("returns a public-safe 500 when artwork update persistence fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockArtworkFindByIdAndUpdate.mockRejectedValue(
      new Error("private database detail")
    );

    try {
      const response = await PATCH(
        createRequest(
          { title: "Updated Archive" },
          {
            method: "PATCH",
            url: `http://localhost/api/v2/admin/artwork/update/${artworkId}`,
          }
        ) as never,
        {
          params: { id: artworkId },
        }
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockArtworkFindByIdAndUpdate).toHaveBeenCalledWith(
        artworkId,
        {
          $set: {
            title: "Updated Archive",
          },
        },
        { new: true }
      );
      expect(body).toEqual({
        success: false,
        message: "Failed to update artwork",
        error: "Failed to update artwork",
        requestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          event: "api.admin.artwork_update.failed",
          level: "error",
          requestId,
          route: "/api/v2/admin/artwork/update/[id]",
          method: "PATCH",
          operation: "admin.artwork.update",
          errorLabel: "admin_artwork_update_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
