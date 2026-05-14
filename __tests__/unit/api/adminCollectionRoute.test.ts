import { POST } from "@/app/api/v2/admin/collection/create/route";
import { PATCH } from "@/app/api/v2/admin/collection/update/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { CollectionModel } from "@/lib/data/models";
import { isAdmin } from "@/lib/session/isAdmin";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  CollectionModel: {
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

jest.mock("@/lib/session/isAdmin", () => ({
  isAdmin: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

type MockRequest = {
  json: jest.Mock;
};

const adminUserId = "507f1f77bcf86cd799439011";
const collectionId = "507f1f77bcf86cd799439012";
const artworkToAddId = "507f1f77bcf86cd799439013";
const artworkToRemoveId = "507f1f77bcf86cd799439014";
const existingArtworkId = "507f1f77bcf86cd799439015";

const createRequest = (body: unknown): MockRequest => ({
  json: jest.fn().mockResolvedValue(body),
});

const createInvalidJsonRequest = (): MockRequest => ({
  json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
});

const validCreatePayload = {
  title: "Painting Series",
  subtitle: "Archive grouping",
  summary: "A concise collection summary.",
  text: "Longer collection text for the archive.",
  imageUrl: "https://example.com/collection.jpg",
};

const validUpdatePayload = {
  title: "Updated Series",
  subtitle: "Updated grouping",
  summary: "Updated collection summary.",
  text: "Updated collection text for the archive.",
  imageUrl: "https://example.com/updated-collection.jpg",
  section: "project",
  artworksToAdd: [artworkToAddId],
  artworksToRemove: [artworkToRemoveId],
};

const createdCollection = {
  _id: collectionId,
  ...validCreatePayload,
  section: "collections",
  slug: "painting-series",
  author: adminUserId,
};

const createCollectionDocument = () => ({
  _id: collectionId,
  title: "Painting Series",
  subtitle: "Archive grouping",
  summary: "A concise collection summary.",
  text: "Longer collection text for the archive.",
  imageUrl: "https://example.com/collection.jpg",
  section: "collections",
  artworks: [
    {
      toString: () => artworkToRemoveId,
    },
    {
      toString: () => existingArtworkId,
    },
  ] as unknown[],
  save: jest.fn().mockResolvedValue(undefined),
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockCreate = CollectionModel.create as jest.Mock;
const mockFindById = CollectionModel.findById as jest.Mock;
const mockIsAdmin = isAdmin as jest.MockedFunction<typeof isAdmin>;
const mockGetUserIdFromSession =
  getUserIdFromSession as jest.MockedFunction<typeof getUserIdFromSession>;

describe("POST /api/v2/admin/collection/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAdmin.mockResolvedValue(true);
    mockGetUserIdFromSession.mockResolvedValue(adminUserId);
    mockDbConnect.mockResolvedValue(undefined);
    mockCreate.mockResolvedValue(createdCollection);
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockIsAdmin.mockResolvedValue(false);
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
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid fields and does not write to MongoDB", async () => {
    const request = createRequest({
      ...validCreatePayload,
      title: "   ",
      imageUrl: "not-a-url",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {
        title: ["Title is required"],
        imageUrl: ["Must be a valid URL"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("rejects unknown create fields before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      role: "admin",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'role'"],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates a collection from only parsed fields, generated slug, and session author", async () => {
    const request = createRequest({
      title: "  Painting Series  ",
      subtitle: "  Archive grouping  ",
      summary: "  A concise collection summary.  ",
      text: "  Longer collection text for the archive.  ",
      imageUrl: "  https://example.com/collection.jpg  ",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      ...validCreatePayload,
      section: "collections",
      slug: "painting-series",
      author: adminUserId,
    });
    expect(body).toEqual({
      success: true,
      data: createdCollection,
    });
  });

  it("returns a public-safe 500 when collection creation fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockCreate.mockRejectedValue(new Error("private database detail"));

    try {
      const response = await POST(createRequest(validCreatePayload) as never);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({
        ...validCreatePayload,
        section: "collections",
        slug: "painting-series",
        author: adminUserId,
      });
      expect(body).toEqual({
        success: false,
        error: "Failed to create collection",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error creating collection:",
        expect.any(Error)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

describe("PATCH /api/v2/admin/collection/update/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAdmin.mockResolvedValue(true);
    mockGetUserIdFromSession.mockResolvedValue(adminUserId);
    mockDbConnect.mockResolvedValue(undefined);
    mockFindById.mockResolvedValue(createCollectionDocument());
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockIsAdmin.mockResolvedValue(false);
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: collectionId },
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
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid collection ID before reading the body", async () => {
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: "not-an-object-id" },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {
        id: ["Invalid collection ID"],
      },
      formErrors: [],
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await PATCH(request as never, {
      params: { id: collectionId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid update fields and artwork IDs", async () => {
    const request = createRequest({
      imageUrl: "not-a-url",
      artworksToAdd: ["bad-artwork-id"],
    });

    const response = await PATCH(request as never, {
      params: { id: collectionId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {
        imageUrl: ["Must be a valid URL"],
        artworksToAdd: ["Invalid artwork ID"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("rejects unknown update fields before persistence", async () => {
    const request = createRequest({
      title: "Updated Series",
      role: "admin",
    });

    const response = await PATCH(request as never, {
      params: { id: collectionId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid collection input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'role'"],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("returns 404 when the collection is not found", async () => {
    mockFindById.mockResolvedValue(null);
    const request = createRequest({ title: "Updated Series" });

    const response = await PATCH(request as never, {
      params: { id: collectionId },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(collectionId);
    expect(body).toEqual({
      success: false,
      error: "Collection not found",
    });
  });

  it("updates only parsed fields and validated artwork changes", async () => {
    const collection = createCollectionDocument();
    mockFindById.mockResolvedValue(collection);
    const request = createRequest({
      title: "  Updated Series  ",
      subtitle: "  Updated grouping  ",
      summary: "  Updated collection summary.  ",
      text: "  Updated collection text for the archive.  ",
      imageUrl: "  https://example.com/updated-collection.jpg  ",
      section: "project",
      artworksToAdd: [artworkToAddId],
      artworksToRemove: [artworkToRemoveId],
    });

    const response = await PATCH(request as never, {
      params: { id: collectionId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindById).toHaveBeenCalledWith(collectionId);
    expect(collection.title).toBe("Updated Series");
    expect(collection.subtitle).toBe("Updated grouping");
    expect(collection.summary).toBe("Updated collection summary.");
    expect(collection.text).toBe("Updated collection text for the archive.");
    expect(collection.imageUrl).toBe(
      "https://example.com/updated-collection.jpg"
    );
    expect(collection.section).toBe("project");
    expect(collection.artworks.map(String)).toEqual([
      existingArtworkId,
      artworkToAddId,
    ]);
    expect(collection.save).toHaveBeenCalledTimes(1);
    expect(body).toEqual({
      success: true,
      data: collection,
    });
  });

  it("returns a public-safe 500 when collection update persistence fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const collection = createCollectionDocument();
    collection.save.mockRejectedValue(new Error("private database detail"));
    mockFindById.mockResolvedValue(collection);

    try {
      const response = await PATCH(
        createRequest({ title: "Updated Series" }) as never,
        {
          params: { id: collectionId },
        }
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockFindById).toHaveBeenCalledWith(collectionId);
      expect(body).toEqual({
        success: false,
        error: "Failed to update collection",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating collection:",
        expect.any(Error)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
