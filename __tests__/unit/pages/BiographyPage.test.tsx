import BiographyPage from "@/app/biography/page";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";
import { isNextError } from "@/lib/helpers/isNextError";
import { redirect } from "next/navigation";

jest.mock("@/lib/data/services/getArticleNavigationList", () => ({
  getArticleNavigationList: jest.fn(),
}));

jest.mock("@/lib/helpers/isNextError", () => ({
  isNextError: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetArticleNavigationList =
  getArticleNavigationList as jest.MockedFunction<
    typeof getArticleNavigationList
  >;
const mockIsNextError = isNextError as jest.MockedFunction<typeof isNextError>;
const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;

describe("/biography page", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    mockIsNextError.mockReturnValue(false);
    mockGetArticleNavigationList.mockResolvedValue({
      success: true,
      data: [
        {
          title: "Early Life",
          slug: "early-life",
          linkTo: "/early-life",
        },
        {
          title: "Studio Years",
          slug: "studio-years",
          linkTo: "/studio-years",
        },
      ],
      metadata: {
        page: 1,
        limit: 2,
        total: 2,
        totalPages: 1,
      },
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("redirects to the first biography article through the server data service", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    mockRedirect.mockImplementation(() => {
      throw redirectError;
    });
    mockIsNextError.mockImplementation((error) => error === redirectError);

    await expect(BiographyPage()).rejects.toThrow(redirectError);

    expect(mockGetArticleNavigationList).toHaveBeenCalledWith("biography");
    expect(mockRedirect).toHaveBeenCalledWith("/biography/early-life");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("throws the existing no-results error when no biography articles exist", async () => {
    mockGetArticleNavigationList.mockResolvedValue(null);

    await expect(BiographyPage()).rejects.toThrow(
      "No biography articles found"
    );

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error in biography default path:",
      expect.any(Error)
    );
  });

  it("preserves the logged error behavior when navigation loading fails", async () => {
    const error = new Error("navigation failed");
    mockGetArticleNavigationList.mockRejectedValue(error);

    await expect(BiographyPage()).rejects.toThrow(error);

    expect(mockRedirect).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error in biography default path:",
      error
    );
  });
});
