import { POST } from "@/app/api/v2/admin/article/create/route";
import { PATCH } from "@/app/api/v2/admin/article/update/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { ArticleModel, UserModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";

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
  ArticleModel: {
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
};

const adminUserId = "507f1f77bcf86cd799439011";
const articleId = "507f1f77bcf86cd799439012";
const artworkId = "507f1f77bcf86cd799439013";
const newArtworkId = "507f1f77bcf86cd799439014";

const createRequest = (body: unknown): MockRequest => ({
  json: jest.fn().mockResolvedValue(body),
});

const createInvalidJsonRequest = (): MockRequest => ({
  json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
});

const validCreatePayload = {
  title: "Studio Notes",
  subtitle: "On colour and form",
  summary: "A focused article summary.",
  text: "This article text is long enough to satisfy the route validation boundary.",
  imageUrl: "https://example.com/article.jpg",
  section: "artwork",
  overlayColour: "white",
  artwork: artworkId,
};

const validUpdatePayload = {
  title: "Updated Studio Notes",
  subtitle: "Updated colour and form",
  summary: "An updated article summary.",
  text: "This updated article text is long enough to satisfy validation.",
  imageUrl: "https://example.com/updated-article.jpg",
  section: "project",
  overlayColour: "black",
  artwork: newArtworkId,
};

const createdArticle = {
  _id: articleId,
  ...validCreatePayload,
  slug: "studio-notes",
  author: adminUserId,
};

const updatedArticle = {
  _id: articleId,
  ...validUpdatePayload,
  slug: "updated-studio-notes",
  author: adminUserId,
};

const createArticleDocument = (article: typeof createdArticle) => ({
  toObject: jest.fn().mockReturnValue({
    ...article,
    __v: 0,
  }),
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockArticleCreate = ArticleModel.create as jest.Mock;
const mockArticleFindByIdAndUpdate = ArticleModel.findByIdAndUpdate as jest.Mock;
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

describe("POST /api/v2/admin/article/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockArticleCreate.mockResolvedValue(createArticleDocument(createdArticle));
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
    expect(mockArticleCreate).not.toHaveBeenCalled();
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
    expect(mockArticleCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid fields and does not write to MongoDB", async () => {
    const request = createRequest({
      ...validCreatePayload,
      title: "   ",
      text: "too short",
      artwork: "bad-artwork-id",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {
        title: ["Title is required"],
        text: ["Article text must be at least 50 characters"],
        artwork: ["Invalid artwork ID"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleCreate).not.toHaveBeenCalled();
  });

  it("rejects unknown create fields before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      author: "507f1f77bcf86cd799439099",
      role: "admin",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author', 'role'"],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleCreate).not.toHaveBeenCalled();
  });

  it("creates an article from parsed fields, generated slug, and session author", async () => {
    const request = createRequest({
      title: "  Studio Notes  ",
      subtitle: "  On colour and form  ",
      summary: "  A focused article summary.  ",
      text: "  This article text is long enough to satisfy the route validation boundary.  ",
      imageUrl: "  https://example.com/article.jpg  ",
      section: "artwork",
      overlayColour: "white",
      artwork: `  ${artworkId}  `,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleCreate).toHaveBeenCalledWith({
      ...validCreatePayload,
      slug: "studio-notes",
      author: adminUserId,
    });
    expect(body).toEqual({
      success: true,
      data: createdArticle,
    });
  });

  it("returns a public-safe 500 when article creation fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockArticleCreate.mockRejectedValue(new Error("private database detail"));

    try {
      const response = await POST(createRequest(validCreatePayload) as never);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockArticleCreate).toHaveBeenCalledWith({
        ...validCreatePayload,
        slug: "studio-notes",
        author: adminUserId,
      });
      expect(body).toEqual({
        success: false,
        error: "Failed to create article",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error creating article:",
        expect.any(Error)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

describe("PATCH /api/v2/admin/article/update/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockArticleFindByIdAndUpdate.mockResolvedValue(
      createArticleDocument(updatedArticle)
    );
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: articleId },
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
    expect(mockArticleFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 403 without reading the body for authenticated non-admin callers", async () => {
    setNonAdminSession();
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: articleId },
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
    expect(mockArticleFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid article ID before reading the body", async () => {
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: "not-an-object-id" },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {
        id: ["Invalid article ID"],
      },
      formErrors: [],
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await PATCH(request as never, {
      params: { id: articleId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid update fields", async () => {
    const request = createRequest({
      imageUrl: "not-a-url",
      artwork: "bad-artwork-id",
    });

    const response = await PATCH(request as never, {
      params: { id: articleId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {
        imageUrl: ["Invalid URL"],
        artwork: ["Invalid artwork ID"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("rejects unknown update fields before persistence", async () => {
    const request = createRequest({
      title: "Updated Studio Notes",
      author: "507f1f77bcf86cd799439099",
      slug: "forced-slug",
    });

    const response = await PATCH(request as never, {
      params: { id: articleId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author', 'slug'"],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 404 when the article is not found", async () => {
    mockArticleFindByIdAndUpdate.mockResolvedValue(null);
    const request = createRequest({ title: "Updated Studio Notes" });

    const response = await PATCH(request as never, {
      params: { id: articleId },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFindByIdAndUpdate).toHaveBeenCalledWith(
      articleId,
      {
        $set: {
          title: "Updated Studio Notes",
          slug: "updated-studio-notes",
        },
      },
      { new: true }
    );
    expect(body).toEqual({
      success: false,
      error: "Article not found",
    });
  });

  it("updates only parsed fields and generates slug from the parsed title", async () => {
    const request = createRequest({
      title: "  Updated Studio Notes  ",
      subtitle: "  Updated colour and form  ",
      summary: "  An updated article summary.  ",
      text: "  This updated article text is long enough to satisfy validation.  ",
      imageUrl: "  https://example.com/updated-article.jpg  ",
      section: "project",
      overlayColour: "black",
      artwork: `  ${newArtworkId}  `,
    });

    const response = await PATCH(request as never, {
      params: { id: articleId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleFindByIdAndUpdate).toHaveBeenCalledWith(
      articleId,
      {
        $set: {
          ...validUpdatePayload,
          slug: "updated-studio-notes",
        },
      },
      { new: true }
    );
    expect(body).toEqual({
      success: true,
      data: updatedArticle,
    });
  });

  it("returns a public-safe 500 when article update persistence fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockArticleFindByIdAndUpdate.mockRejectedValue(
      new Error("private database detail")
    );

    try {
      const response = await PATCH(
        createRequest({ title: "Updated Studio Notes" }) as never,
        {
          params: { id: articleId },
        }
      );
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockArticleFindByIdAndUpdate).toHaveBeenCalledWith(
        articleId,
        {
          $set: {
            title: "Updated Studio Notes",
            slug: "updated-studio-notes",
          },
        },
        { new: true }
      );
      expect(body).toEqual({
        success: false,
        error: "Failed to update article",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating article:",
        expect.any(Error)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
