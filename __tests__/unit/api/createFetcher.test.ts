import { createFetcher } from "@/lib/api/core/createFetcher";
import { isNextError } from "@/lib/helpers/isNextError";

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

const fetchMock = global.fetch as jest.Mock;
const isNextErrorMock = jest.mocked(isNextError);

const jsonResponse = (
  body: unknown,
  init: { ok?: boolean; status?: number } = {}
) =>
  ({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response);

describe("createFetcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isNextErrorMock.mockReturnValue(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("merges headers, executes fetch, parses JSON, and returns successful envelopes", async () => {
    const responseBody = {
      success: true,
      data: { id: "artwork-1" },
    };
    fetchMock.mockResolvedValueOnce(jsonResponse(responseBody));

    const fetcher = createFetcher({
      getUrl: (path) => `https://example.test${path}`,
      getHeaders: () =>
        new Headers([
          ["authorization", "Bearer token"],
          ["x-base", "base"],
        ]),
    });

    await expect(
      fetcher<typeof responseBody>("/api/v2/public/artwork", {
        method: "POST",
        headers: {
          "x-request-id": "request-1",
        },
      })
    ).resolves.toEqual(responseBody);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/api/v2/public/artwork",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer token",
          "x-base": "base",
          "x-request-id": "request-1",
        },
      }
    );
  });

  it("returns stable API errors for failed HTTP responses", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        {
          success: false,
          error: "Artwork not found",
        },
        { ok: false, status: 404 }
      )
    );

    const fetcher = createFetcher({
      getUrl: (path) => `https://example.test${path}`,
      getHeaders: () => ({}),
    });

    await expect(fetcher("/missing")).resolves.toEqual({
      success: false,
      error: "Artwork not found",
    });
  });

  it("returns a fallback API error when the failed envelope has a non-string error", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        success: false,
        error: { message: "private details" },
      })
    );

    const fetcher = createFetcher({
      getUrl: (path) => `https://example.test${path}`,
      getHeaders: () => ({}),
    });

    await expect(fetcher("/failed-envelope")).resolves.toEqual({
      success: false,
      error: "An error occurred",
    });
  });

  it("returns stable API errors for fetch failures", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const fetcher = createFetcher({
      getUrl: (path) => `https://example.test${path}`,
      getHeaders: () => ({}),
    });

    await expect(fetcher("/network-failure")).resolves.toEqual({
      success: false,
      error: "network down",
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("rethrows Next control-flow errors", async () => {
    const nextError = new Error("NEXT_REDIRECT");
    fetchMock.mockRejectedValueOnce(nextError);
    isNextErrorMock.mockReturnValueOnce(true);

    const fetcher = createFetcher({
      getUrl: (path) => `https://example.test${path}`,
      getHeaders: () => ({}),
    });

    await expect(fetcher("/redirect")).rejects.toBe(nextError);
  });
});
