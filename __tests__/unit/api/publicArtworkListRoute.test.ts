import { GET } from "@/app/api/v2/public/artwork/route";
import { getArtworkList } from "@/lib/data/services/getArtworkList";
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
    nextUrl: new URL(url),
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
        "https://example.test/api/v2/public/artwork?filterMode=ANY&sortBy=colorProximity&sortColor=%23111111&page=2&limit=5&decade=1970s&decade=1980s&medium=oil"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetArtworkList).toHaveBeenCalledWith({
      filterMode: "ANY",
      sortBy: "colorProximity",
      sortColor: "#111111",
      page: 2,
      limit: 5,
      decade: ["1970s", "1980s"],
      artstyle: [],
      medium: ["oil"],
      surface: [],
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

  it("returns a public-safe 500 envelope when the service throws", async () => {
    mockGetArtworkList.mockRejectedValue(new Error("database unavailable"));

    const response = await GET(
      createRequest("https://example.test/api/v2/public/artwork")
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: "Internal Server Error",
    });
  });
});
