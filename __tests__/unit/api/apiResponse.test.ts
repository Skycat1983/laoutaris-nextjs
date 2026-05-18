import {
  apiErrorResponse,
  apiListResponse,
  apiSuccessResponse,
} from "@/lib/api/apiResponse";
import { apiAuthError } from "@/lib/api/apiAuthError";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

describe("api response helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status-bearing public-safe error envelopes", async () => {
    const response = apiErrorResponse({
      message: "Artwork not found",
      status: 404,
    });

    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Artwork not found",
      error: "Artwork not found",
    });
    expect(response.status).toBe(404);
  });

  it("allows error text to stay distinct when a route needs it", async () => {
    const response = apiErrorResponse({
      message: "Unable to process request",
      error: "Internal Server Error",
      status: 500,
    });

    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Unable to process request",
      error: "Internal Server Error",
    });
    expect(response.status).toBe(500);
  });

  it("includes optional public request IDs on error envelopes and headers", async () => {
    const response = apiErrorResponse({
      message: "Unable to process request",
      error: "Internal Server Error",
      status: 500,
      requestId: "req-1234567890",
    });

    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Unable to process request",
      error: "Internal Server Error",
      requestId: "req-1234567890",
    });
    expect(response.status).toBe(500);
    expect(response.headers.get("X-Request-Id")).toBe("req-1234567890");
  });

  it("returns single-result success envelopes", async () => {
    const data = { id: "user-1", name: "Joseph" };

    const response = apiSuccessResponse(data);

    await expect(response.json()).resolves.toEqual({
      success: true,
      data,
    });
    expect(response.status).toBe(200);
  });

  it("preserves optional success messages", async () => {
    const response = apiSuccessResponse(null, {
      message: "Artwork deleted successfully",
    });

    await expect(response.json()).resolves.toEqual({
      success: true,
      data: null,
      message: "Artwork deleted successfully",
    });
    expect(response.status).toBe(200);
  });

  it("returns list success envelopes with metadata", async () => {
    const data = [{ id: "art-1" }];
    const metadata = {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    const response = apiListResponse(data, metadata);

    await expect(response.json()).resolves.toEqual({
      success: true,
      data,
      metadata,
    });
    expect(response.status).toBe(200);
  });

  it("preserves the shared auth-error envelope", async () => {
    const response = apiAuthError("Unauthorized", 401);

    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Unauthorized",
      error: "Unauthorized",
    });
    expect(response.status).toBe(401);
  });
});
