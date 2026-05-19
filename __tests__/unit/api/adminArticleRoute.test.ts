jest.mock("server-only", () => ({}), { virtual: true });

import { POST } from "@/app/api/v2/admin/article/create/route";
import { PATCH } from "@/app/api/v2/admin/article/update/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { ArticleModel, ArtworkModel, UserModel } from "@/lib/data/models";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";
import { CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR } from "@/lib/validation/contentImageUrl";
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
  ArticleModel: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  ArtworkModel: {
    exists: jest.fn(),
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
const articleId = "507f1f77bcf86cd799439012";
const artworkId = "507f1f77bcf86cd799439013";
const newArtworkId = "507f1f77bcf86cd799439014";
const requestId = "req-admin-article";
const cloudinaryArticleImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/article.jpg";
const cloudinaryUpdatedArticleImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000001/updated-article.jpg";
const shopifyArticleImageUrl =
  "https://cdn.shopify.com/s/files/1/0000/0001/files/article.jpg";

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
  url: options.url ?? "http://localhost/api/v2/admin/article/create",
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
  url: options.url ?? "http://localhost/api/v2/admin/article/create",
});

const validCreatePayload = {
  title: "Studio Notes",
  subtitle: "On colour and form",
  summary: "A focused article summary.",
  text: "This article text is long enough to satisfy the route validation boundary.",
  imageUrl: cloudinaryArticleImageUrl,
  section: "artwork",
  overlayColour: "white",
  artwork: artworkId,
};

const validUpdatePayload = {
  title: "Updated Studio Notes",
  subtitle: "Updated colour and form",
  summary: "An updated article summary.",
  text: "This updated article text is long enough to satisfy validation.",
  imageUrl: cloudinaryUpdatedArticleImageUrl,
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
const mockArtworkExists = ArtworkModel.exists as jest.Mock;
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
    mockArtworkExists.mockResolvedValue({ _id: artworkId });
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

  it("rejects arbitrary create image hosts before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      imageUrl: "https://example.com/article.jpg",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {
        imageUrl: [CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR],
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

  it("rejects a valid-looking create artwork ID when the artwork is missing", async () => {
    mockArtworkExists.mockResolvedValue(null);
    const request = createRequest(validCreatePayload);

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid article input",
      fieldErrors: {
        artwork: ["Artwork not found"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkExists).toHaveBeenCalledWith({ _id: artworkId });
    expect(mockArticleCreate).not.toHaveBeenCalled();
  });

  it("creates an article from parsed fields, generated slug, and session author", async () => {
    const request = createRequest({
      title: "  Studio Notes  ",
      subtitle: "  On colour and form  ",
      summary: "  A focused article summary.  ",
      text: "  This article text is long enough to satisfy the route validation boundary.  ",
      imageUrl: `  ${cloudinaryArticleImageUrl}  `,
      section: "artwork",
      overlayColour: "white",
      artwork: `  ${artworkId}  `,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkExists).toHaveBeenCalledWith({ _id: artworkId });
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

  it("accepts explicitly allowed external image hosts on create", async () => {
    const externalCreatedArticle = {
      ...createdArticle,
      imageUrl: shopifyArticleImageUrl,
    };
    mockArticleCreate.mockResolvedValue(
      createArticleDocument(externalCreatedArticle)
    );

    const response = await POST(
      createRequest({
        ...validCreatePayload,
        imageUrl: `  ${shopifyArticleImageUrl}  `,
      }) as never
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArticleCreate).toHaveBeenCalledWith({
      ...validCreatePayload,
      imageUrl: shopifyArticleImageUrl,
      slug: "studio-notes",
      author: adminUserId,
    });
    expect(body).toEqual({
      success: true,
      data: externalCreatedArticle,
    });
  });

  it("returns a public-safe 500 when article creation fails", async () => {
    const createRequestId = "req-admin-article-create";
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockArticleCreate.mockRejectedValue(
      new Error("private admin@example.com database detail")
    );

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
      expect(mockArticleCreate).toHaveBeenCalledWith({
        ...validCreatePayload,
        slug: "studio-notes",
        author: adminUserId,
      });
      expect(body).toEqual({
        success: false,
        message: "Failed to create article",
        error: "Failed to create article",
        requestId: createRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          event: "api.admin.article_create.failed",
          level: "error",
          requestId: createRequestId,
          route: "/api/v2/admin/article/create",
          method: "POST",
          operation: "admin.article.create",
          errorLabel: "admin_article_create_failed",
        })
      );
      expect(logPayload.error.message).toBe(
        "private [redacted] database detail"
      );
      expect(JSON.stringify(body)).not.toContain("private");
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
    mockArtworkExists.mockResolvedValue({ _id: newArtworkId });
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

  it("rejects arbitrary update image hosts before persistence", async () => {
    const request = createRequest({
      imageUrl: "https://example.com/updated-article.jpg",
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
        imageUrl: [CONTENT_IMAGE_URL_ALLOWED_HOST_ERROR],
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

  it("rejects a valid-looking update artwork ID when the artwork is missing", async () => {
    mockArtworkExists.mockResolvedValue(null);
    const request = createRequest({
      artwork: newArtworkId,
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
        artwork: ["Artwork not found"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockArtworkExists).toHaveBeenCalledWith({ _id: newArtworkId });
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
      message: "Article not found",
      error: "Article not found",
    });
  });

  it("updates only parsed fields and generates slug from the parsed title", async () => {
    const request = createRequest({
      title: "  Updated Studio Notes  ",
      subtitle: "  Updated colour and form  ",
      summary: "  An updated article summary.  ",
      text: "  This updated article text is long enough to satisfy validation.  ",
      imageUrl: `  ${cloudinaryUpdatedArticleImageUrl}  `,
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
    expect(mockArtworkExists).toHaveBeenCalledWith({ _id: newArtworkId });
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
        createRequest(
          { title: "Updated Studio Notes" },
          {
            method: "PATCH",
            requestId: null,
            url: `http://localhost/api/v2/admin/article/update/${articleId}`,
          }
        ) as never,
        {
          params: { id: articleId },
        }
      );
      const body = await response.json();
      const generatedRequestId = body.requestId;
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(generatedRequestId).toEqual(
        expect.stringMatching(/^[0-9a-f-]{36}$/)
      );
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(generatedRequestId);
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
        message: "Failed to update article",
        error: "Failed to update article",
        requestId: generatedRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          event: "api.admin.article_update.failed",
          level: "error",
          requestId: generatedRequestId,
          route: "/api/v2/admin/article/update/[id]",
          method: "PATCH",
          operation: "admin.article.update",
          errorLabel: "admin_article_update_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
