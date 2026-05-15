import { GET } from "@/app/api/v2/public/artwork/[id]/route";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkById", () => ({
  getArtworkById: jest.fn(),
}));

const mockGetArtworkById = getArtworkById as jest.MockedFunction<
  typeof getArtworkById
>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;

const request = {} as never;
const validArtworkId = "507f1f77bcf86cd799439011";
const frontendArtwork = {
  _id: validArtworkId,
  title: "Linked Artwork",
};

const createParams = (id: string) => ({
  params: { id },
});

describe("GET /api/v2/public/artwork/[id]", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue("user-123");
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns a success envelope for an existing artwork", async () => {
    mockGetArtworkById.mockResolvedValue(frontendArtwork as never);

    const response = await GET(request, createParams(validArtworkId));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetArtworkById).toHaveBeenCalledWith(validArtworkId, "user-123");
    expect(body).toEqual({
      success: true,
      data: frontendArtwork,
    });
  });

  it("returns 404 when the artwork service returns null", async () => {
    mockGetArtworkById.mockResolvedValue(null);

    const response = await GET(request, createParams("not-an-object-id"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockGetArtworkById).toHaveBeenCalledWith(
      "not-an-object-id",
      "user-123"
    );
    expect(body).toEqual({
      success: false,
      message: "Artwork not found",
      error: "Artwork not found",
    });
  });

  it("returns a public-safe 500 when the artwork service throws", async () => {
    mockGetArtworkById.mockRejectedValue(new Error("private database detail"));

    const response = await GET(request, createParams(validArtworkId));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      message: "Failed to fetch artwork",
      error: "Failed to fetch artwork",
    });
    expect(JSON.stringify(body)).not.toContain("private database detail");
  });
});
