jest.mock("server-only", () => ({}), { virtual: true });

import { GET } from "@/app/api/v2/public/artwork/route";
import { getArtworkList } from "@/lib/data/services/getArtworkList";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/lib/data/services/getArtworkList", () => ({
  getArtworkList: jest.fn(),
}));

const mockGetArtworkList = getArtworkList as jest.MockedFunction<
  typeof getArtworkList
>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;

const createRequest = (url: string) =>
  ({
    method: "GET",
    headers: new Headers(),
    nextUrl: new URL(url),
    url,
  } as never);

const listResult = {
  success: true,
  data: [{ _id: "artwork-1", title: "Artwork 1" }],
  metadata: {
    page: 2,
    limit: 5,
    total: 11,
    totalPages: 3,
  },
} as never;

describe("GET /api/v2/public/artwork", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue("user-123");
    mockGetArtworkList.mockResolvedValue(listResult);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("parses search params and returns the service success envelope", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/artwork?filterMode=ANY&sortBy=colorProximity&sortColor=%23111111&page=2&limit=50&decade=1970s&decade=1980s&artstyle=abstract&medium=oil&surface=canvas"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetArtworkList).toHaveBeenCalledWith({
      filterMode: "ANY",
      sortBy: "colorProximity",
      sortColor: "#111111",
      page: 2,
      limit: 50,
      decade: ["1970s", "1980s"],
      artstyle: ["abstract"],
      medium: ["oil"],
      surface: ["canvas"],
      userId: "user-123",
    });
    expect(body).toBe(listResult);
  });

  it("uses route defaults when optional params are absent", async () => {
    await GET(createRequest("https://example.test/api/v2/public/artwork"));

    expect(mockGetArtworkList).toHaveBeenCalledWith({
      filterMode: "ALL",
      sortBy: "mostRecent",
      sortColor: undefined,
      page: 1,
      limit: 10,
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
      userId: "user-123",
    });
  });

  it("returns 400 for invalid enum params before session or service work", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/artwork?filterMode=SOME&sortBy=oldest"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork query",
      fieldErrors: {
        filterMode: ["Filter mode must be ALL or ANY"],
        sortBy: [
          "Sort option must be colorProximity, mostRecent, mostPopular, or mostFeatured",
        ],
      },
      formErrors: [],
    });
    expect(mockGetUserIdFromSession).not.toHaveBeenCalled();
    expect(mockGetArtworkList).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid repeated filter values", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/artwork?decade=1970s&decade=1900s&artstyle=cubist&medium=stone&surface=metal"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork query",
      fieldErrors: {
        decade: ["Decade filter contains an invalid value"],
        artstyle: ["Art style filter contains an invalid value"],
        medium: ["Medium filter contains an invalid value"],
        surface: ["Surface filter contains an invalid value"],
      },
      formErrors: [],
    });
    expect(mockGetUserIdFromSession).not.toHaveBeenCalled();
    expect(mockGetArtworkList).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid sort colors", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/artwork?sortBy=colorProximity&sortColor=red"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork query",
      fieldErrors: {
        sortColor: ["Sort color must be a valid hex color"],
      },
      formErrors: [],
    });
    expect(mockGetUserIdFromSession).not.toHaveBeenCalled();
    expect(mockGetArtworkList).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid pagination values", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/artwork?page=0&limit=51"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid artwork query",
      fieldErrors: {
        page: ["Page must be at least 1"],
        limit: ["Limit must be 50 or less"],
      },
      formErrors: [],
    });
    expect(mockGetUserIdFromSession).not.toHaveBeenCalled();
    expect(mockGetArtworkList).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 envelope when the service throws", async () => {
    mockGetArtworkList.mockRejectedValue(new Error("database unavailable"));

    const response = await GET(
      createRequest("https://example.test/api/v2/public/artwork")
    );
    const body = await response.json();
    const generatedRequestId = response.headers.get(REQUEST_ID_HEADER);
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(generatedRequestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(body).toEqual({
      success: false,
      error: "Internal Server Error",
      requestId: generatedRequestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId: generatedRequestId,
        route: "/api/v2/public/artwork",
        method: "GET",
        errorLabel: "artwork_list_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("database unavailable");
  });
});
