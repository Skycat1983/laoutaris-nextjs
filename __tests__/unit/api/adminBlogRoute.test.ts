import { POST } from "@/app/api/v2/admin/blog/create/route";
import { PATCH } from "@/app/api/v2/admin/blog/update/[id]/route";
import dbConnect from "@/lib/db/mongodb";
import { BlogModel, UserModel } from "@/lib/data/models";
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
};

const adminUserId = "507f1f77bcf86cd799439011";
const blogId = "507f1f77bcf86cd799439012";
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

const createRequest = (body: unknown): MockRequest => ({
  json: jest.fn().mockResolvedValue(body),
});

const createInvalidJsonRequest = (): MockRequest => ({
  json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
});

const createBlogDocument = (blog: typeof createdBlog | typeof updatedBlog) => ({
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

  it("rejects unknown create fields before persistence", async () => {
    const request = createRequest({
      ...validCreatePayload,
      author: "507f1f77bcf86cd799439099",
      pinned: true,
      tags: ["studio"],
    });

    const response = await POST(request as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author', 'pinned', 'tags'"],
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

  it("returns a public-safe 500 when blog creation fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockBlogCreate.mockRejectedValue(new Error("private database detail"));

    try {
      const response = await POST(createRequest(validCreatePayload) as never);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(mockDbConnect).toHaveBeenCalledTimes(2);
      expect(mockUserFindById).toHaveBeenCalledWith(adminUserId);
      expect(mockBlogCreate).toHaveBeenCalledWith({
        ...parsedCreatePayload,
        slug: "studio-journal",
        author: adminUserId,
      });
      expect(body).toEqual({
        success: false,
        error: "Failed to create blog",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error creating blog:",
        expect.any(Error)
      );
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

  it("rejects unknown update fields before persistence", async () => {
    const request = createRequest({
      title: "Updated Studio Journal",
      author: "507f1f77bcf86cd799439099",
      slug: "forced-slug",
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
      fieldErrors: {},
      formErrors: ["Unrecognized key(s) in object: 'author', 'slug', 'tags'"],
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
        createRequest({ title: "Updated Studio Journal" }) as never,
        {
          params: { id: blogId },
        }
      );
      const body = await response.json();

      expect(response.status).toBe(500);
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
        error: "Failed to update blog",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating blog:",
        expect.any(Error)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
