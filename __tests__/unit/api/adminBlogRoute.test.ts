jest.mock("server-only", () => ({}), { virtual: true });

import { POST } from "@/app/api/v2/admin/blog/create/route";
import { PATCH } from "@/app/api/v2/admin/blog/update/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { BlogModel, UserModel } from "@/lib/data/models";
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
  BlogModel: {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
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
const blogId = "507f1f77bcf86cd799439012";
const requestId = "req-admin-blog";
const displayDate = new Date("2025-01-15T00:00:00.000Z");
const updatedDisplayDate = new Date("2025-02-20T00:00:00.000Z");

const validCreatePayload = {
  title: "Studio Journal",
  subtitle: "Notes from the archive",
  summary: "A focused blog summary.",
  text: "This blog text is long enough to satisfy the route validation boundary.",
  imageUrl: "https://example.com/blog.jpg",
  displayDate: displayDate.toISOString(),
  featured: true,
};

const validUpdatePayload = {
  title: "Updated Studio Journal",
  subtitle: "Updated notes from the archive",
  summary: "An updated blog summary.",
  text: "This updated blog text is long enough to satisfy validation.",
  imageUrl: "https://example.com/updated-blog.jpg",
  displayDate: updatedDisplayDate.toISOString(),
  featured: false,
};

const parsedCreatePayload = {
  ...validCreatePayload,
  displayDate,
  pinned: false,
  tags: [],
};

const parsedUpdatePayload = {
  ...validUpdatePayload,
  displayDate: updatedDisplayDate,
};

const createdBlog = {
  _id: blogId,
  ...parsedCreatePayload,
  slug: "studio-journal",
  author: adminUserId,
};

const existingBlog = {
  _id: blogId,
  title: "Studio Journal",
  slug: "studio-journal",
};

const updatedBlog = {
  _id: blogId,
  ...parsedUpdatePayload,
  slug: "updated-studio-journal",
  author: adminUserId,
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
  url: options.url ?? "http://localhost/api/v2/admin/blog/create",
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
  url: options.url ?? "http://localhost/api/v2/admin/blog/create",
});

const createBlogDocument = (blog: object) => ({
  toObject: jest.fn().mockReturnValue({
    ...blog,
    __v: 0,
  }),
});

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockBlogCreate = BlogModel.create as jest.Mock;
const mockBlogFindById = BlogModel.findById as jest.Mock;
const mockBlogFindOne = BlogModel.findOne as jest.Mock;
const mockBlogFindByIdAndUpdate = BlogModel.findByIdAndUpdate as jest.Mock;
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

describe("POST /api/v2/admin/blog/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockBlogCreate.mockResolvedValue(createBlogDocument(createdBlog));
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
    expect(mockBlogCreate).not.toHaveBeenCalled();
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
    expect(mockBlogCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not write to MongoDB", async () => {
    const request = createInvalidJsonRequest();

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid fields and does not write to MongoDB", async () => {
    const request = createRequest({
      ...validCreatePayload,
      title: " ",
      text: "too short",
      displayDate: "not-a-date",
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        title: ["Title must be at least 2 characters"],
        text: ["Blog text must be at least 50 characters"],
        displayDate: ["Display date must be a valid date"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when imageUrl is missing and does not write to MongoDB", async () => {
    const payloadWithoutImageUrl: Partial<typeof validCreatePayload> = {
      ...validCreatePayload,
    };
    delete payloadWithoutImageUrl.imageUrl;
    const request = createRequest(payloadWithoutImageUrl);

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        imageUrl: ["Image URL is required"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).not.toHaveBeenCalled();
  });

  it("rejects invalid create tags before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      tags: ["studio"],
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        tags: ["Tag must be a valid blog tag"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).not.toHaveBeenCalled();
  });

  it("rejects unknown create fields before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      author: "507f1f77bcf86cd799439099",
      pinned: true,
      tags: ["artwork"],
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author'"],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).not.toHaveBeenCalled();
  });

  it("creates a blog from parsed fields, generated slug, and session author", async () => {
    const request = createRequest({
      title: "  Studio Journal  ",
      subtitle: "  Notes from the archive  ",
      summary: "  A focused blog summary.  ",
      text: "  This blog text is long enough to satisfy the route validation boundary.  ",
      imageUrl: "  https://example.com/blog.jpg  ",
      displayDate: displayDate.toISOString(),
      featured: true,
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).toHaveBeenCalledWith({
      ...parsedCreatePayload,
      slug: "studio-journal",
      author: adminUserId,
    });
    expect(body).toEqual({
      success: true,
      data: createdBlog,
    });
  });

  it("creates a blog with explicit pinned and tags values", async () => {
    const explicitCreatePayload = {
      ...validCreatePayload,
      pinned: true,
      tags: ["artwork", "news"],
    };
    const explicitParsedCreatePayload = {
      ...parsedCreatePayload,
      pinned: true,
      tags: ["artwork", "news"],
    };
    const explicitCreatedBlog = {
      _id: blogId,
      ...explicitParsedCreatePayload,
      slug: "studio-journal",
      author: adminUserId,
    };
    mockBlogCreate.mockResolvedValue(createBlogDocument(explicitCreatedBlog));

    const response = await POST(
      createRequest(explicitCreatePayload) as never
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogCreate).toHaveBeenCalledWith({
      ...explicitParsedCreatePayload,
      slug: "studio-journal",
      author: adminUserId,
    });
    expect(body).toEqual({
      success: true,
      data: explicitCreatedBlog,
    });
  });

  it("returns a public-safe 500 when blog creation fails", async () => {
    const createRequestId = "req-admin-blog-create";
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockBlogCreate.mockRejectedValue(new Error("private database detail"));

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
      expect(mockBlogCreate).toHaveBeenCalledWith({
        ...parsedCreatePayload,
        slug: "studio-journal",
        author: adminUserId,
      });
      expect(body).toEqual({
        success: false,
        message: "Failed to create blog",
        error: "Failed to create blog",
        requestId: createRequestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          event: "api.admin.blog_create.failed",
          level: "error",
          requestId: createRequestId,
          route: "/api/v2/admin/blog/create",
          method: "POST",
          operation: "admin.blog.create",
          errorLabel: "admin_blog_create_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

describe("PATCH /api/v2/admin/blog/update/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAdminSession();
    mockDbConnect.mockResolvedValue(undefined);
    mockBlogFindById.mockResolvedValue(existingBlog);
    mockBlogFindOne.mockResolvedValue(null);
    mockBlogFindByIdAndUpdate.mockResolvedValue(createBlogDocument(updatedBlog));
  });

  it("returns 401 without reading the body for unauthenticated callers", async () => {
    mockGetServerSession.mockResolvedValue(null);
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: blogId },
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
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 403 without reading the body for authenticated non-admin callers", async () => {
    setNonAdminSession();
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: blogId },
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
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid blog ID before reading the body", async () => {
    const request = createRequest(validUpdatePayload);

    const response = await PATCH(request as never, {
      params: { id: "not-an-object-id" },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        id: ["Invalid blog ID"],
      },
      formErrors: [],
    });
    expect(request.json).not.toHaveBeenCalled();
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON and does not read or write blogs", async () => {
    const request = createInvalidJsonRequest();

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {},
      formErrors: ["Request body must be valid JSON."],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid update fields before blog reads", async () => {
    const request = createRequest({
      imageUrl: "not-a-url",
      displayDate: "not-a-date",
    });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        imageUrl: ["Please enter a valid URL"],
        displayDate: ["Display date must be a valid date"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("rejects invalid update tags before blog reads", async () => {
    const request = createRequest({
      tags: ["studio"],
    });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        tags: ["Tag must be a valid blog tag"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("rejects unknown update fields before persistence", async () => {
    const request = createRequest({
      title: "Updated Studio Journal",
      author: "507f1f77bcf86cd799439099",
      slug: "forced-slug",
      pinned: true,
      tags: ["artwork"],
    });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author', 'slug'"],
    });
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 404 when the blog is not found", async () => {
    mockBlogFindById.mockResolvedValue(null);
    const request = createRequest({ title: "Updated Studio Journal" });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).toHaveBeenCalledWith(blogId);
    expect(mockBlogFindOne).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
    expect(body).toEqual({
      success: false,
      message: "Blog not found",
      error: "Blog not found",
    });
  });

  it("returns 409 when the generated update slug already exists", async () => {
    mockBlogFindOne.mockResolvedValue({ _id: "507f1f77bcf86cd799439099" });
    const request = createRequest({ title: "Updated Studio Journal" });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockBlogFindById).toHaveBeenCalledWith(blogId);
    expect(mockBlogFindOne).toHaveBeenCalledWith({
      slug: "updated-studio-journal",
      _id: { $ne: blogId },
    });
    expect(mockBlogFindByIdAndUpdate).not.toHaveBeenCalled();
    expect(body).toEqual({
      success: false,
      message:
        'A blog with a similar title already exists. The slug "updated-studio-journal" is already taken.',
      error:
        'A blog with a similar title already exists. The slug "updated-studio-journal" is already taken.',
    });
  });

  it("updates only parsed fields and generates slug from the parsed title", async () => {
    const request = createRequest({
      title: "  Updated Studio Journal  ",
      subtitle: "  Updated notes from the archive  ",
      summary: "  An updated blog summary.  ",
      text: "  This updated blog text is long enough to satisfy validation.  ",
      imageUrl: "  https://example.com/updated-blog.jpg  ",
      displayDate: updatedDisplayDate.toISOString(),
      featured: false,
    });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).toHaveBeenCalledWith(blogId);
    expect(mockBlogFindOne).toHaveBeenCalledWith({
      slug: "updated-studio-journal",
      _id: { $ne: blogId },
    });
    expect(mockBlogFindByIdAndUpdate).toHaveBeenCalledWith(
      blogId,
      {
        $set: {
          ...parsedUpdatePayload,
          slug: "updated-studio-journal",
        },
      },
      { new: true }
    );
    expect(body).toEqual({
      success: true,
      data: updatedBlog,
    });
  });

  it("updates explicit pinned and tags values", async () => {
    const explicitUpdatedBlog = {
      ...updatedBlog,
      pinned: true,
      tags: ["artwork", "events"],
    };
    mockBlogFindByIdAndUpdate.mockResolvedValue(
      createBlogDocument(explicitUpdatedBlog)
    );
    const request = createRequest({
      pinned: true,
      tags: ["artwork", "events"],
    });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockBlogFindById).toHaveBeenCalledWith(blogId);
    expect(mockBlogFindOne).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).toHaveBeenCalledWith(
      blogId,
      {
        $set: {
          pinned: true,
          tags: ["artwork", "events"],
        },
      },
      { new: true }
    );
    expect(body).toEqual({
      success: true,
      data: explicitUpdatedBlog,
    });
  });

  it("does not check slug conflicts when the title is unchanged", async () => {
    const request = createRequest({
      title: "Studio Journal",
      featured: false,
    });

    const response = await PATCH(request as never, {
      params: { id: blogId },
    });

    expect(response.status).toBe(200);
    expect(mockBlogFindOne).not.toHaveBeenCalled();
    expect(mockBlogFindByIdAndUpdate).toHaveBeenCalledWith(
      blogId,
      {
        $set: {
          title: "Studio Journal",
          featured: false,
        },
      },
      { new: true }
    );
  });

  it("returns a public-safe 500 when blog update persistence fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockBlogFindByIdAndUpdate.mockRejectedValue(
      new Error("private database detail")
    );

    try {
      const response = await PATCH(
        createRequest(
          { title: "Updated Studio Journal" },
          {
            method: "PATCH",
            url: `http://localhost/api/v2/admin/blog/update/${blogId}`,
          }
        ) as never,
        {
          params: { id: blogId },
        }
      );
      const body = await response.json();
      const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      expect(response.status).toBe(500);
      expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockBlogFindByIdAndUpdate).toHaveBeenCalledWith(
        blogId,
        {
          $set: {
            title: "Updated Studio Journal",
            slug: "updated-studio-journal",
          },
        },
        { new: true }
      );
      expect(body).toEqual({
        success: false,
        message: "Failed to update blog",
        error: "Failed to update blog",
        requestId,
      });
      expect(logPayload).toEqual(
        expect.objectContaining({
          event: "api.admin.blog_update.failed",
          level: "error",
          requestId,
          route: "/api/v2/admin/blog/update/[id]",
          method: "PATCH",
          operation: "admin.blog.update",
          errorLabel: "admin_blog_update_failed",
        })
      );
      expect(JSON.stringify(body)).not.toContain("private database detail");
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
