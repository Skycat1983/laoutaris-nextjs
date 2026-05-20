import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { CreateArticleForm } from "@/components/features/adminDashboard/crudForms/create/CreateArticleForm";
import { UpdateArticleForm } from "@/components/features/adminDashboard/crudForms/update/UpdateArticleForm";
import { CreateBlogForm } from "@/components/features/adminDashboard/crudForms/create/CreateBlogForm";
import { UpdateBlogForm } from "@/components/features/adminDashboard/crudForms/update/UpdateBlogForm";
import { clientApi } from "@/lib/api/clientApi";
import { BLOG_TAGS } from "@/lib/constants/blogConstants";
import {
  deriveBlogYearOptions,
  getBlogFilterOptions,
} from "@/components/features/adminDashboard/inputs/BlogFilterDropdowns";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
    className?: string;
  }) {
    const React = require("react");
    return React.createElement("img", props);
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/api/clientApi", () => ({
  clientApi: {
    admin: {
      create: {
        article: jest.fn(),
        blog: jest.fn(),
      },
      update: {
        patchArticle: jest.fn(),
        patchBlog: jest.fn(),
      },
      read: {
        artwork: jest.fn(),
      },
    },
  },
}));

const mockCreateArticle = clientApi.admin.create.article as jest.Mock;
const mockCreateBlog = clientApi.admin.create.blog as jest.Mock;
const mockPatchArticle = clientApi.admin.update.patchArticle as jest.Mock;
const mockPatchBlog = clientApi.admin.update.patchBlog as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockRefresh = jest.fn();

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const validContentImageUrl =
  "https://res.cloudinary.com/dzncmfirr/image/upload/v1730000000/content.jpg";
const artworkId = "507f1f77bcf86cd799439012";
const articleId = "507f1f77bcf86cd799439013";
const blogId = "507f1f77bcf86cd799439014";

type CreateArticleArtworkInfo = ComponentProps<
  typeof CreateArticleForm
>["artworkInfo"];
type UpdateArticleInfo = ComponentProps<typeof UpdateArticleForm>["articleInfo"];
type UpdateBlogInfo = ComponentProps<typeof UpdateBlogForm>["blogInfo"];

const artworkInfo = {
  _id: artworkId,
  title: "Archive Work",
  image: {
    secure_url: validContentImageUrl,
  },
} as CreateArticleArtworkInfo;

const articleInfo = {
  _id: articleId,
  title: "Archive Article",
  subtitle: "Article subtitle",
  summary: "A valid article summary.",
  text: "A valid article body with enough content for the form schema to pass.",
  imageUrl: validContentImageUrl,
  section: "artwork",
  overlayColour: "white",
  artwork: artworkInfo,
} as UpdateArticleInfo;

const blogInfo = {
  _id: blogId,
  title: "Archive Blog",
  slug: "archive-blog",
  subtitle: "Blog subtitle",
  summary: "A valid blog summary.",
  text: "A valid blog body with enough content for the form schema to pass.",
  imageUrl: validContentImageUrl,
  readTime: 2,
  commentCount: 0,
  featured: false,
  pinned: true,
  tags: ["artwork", "news"],
  displayDate: new Date("2026-05-01T00:00:00.000Z"),
} as UpdateBlogInfo;

const fillCreateArticleForm = () => {
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Archive Article" },
  });
  fireEvent.change(screen.getByLabelText("Subtitle"), {
    target: { value: "Article subtitle" },
  });
  fireEvent.change(screen.getByLabelText("Summary"), {
    target: { value: "A valid article summary." },
  });
  fireEvent.change(screen.getByLabelText("Article Content"), {
    target: {
      value: "A valid article body with enough content for the schema to pass.",
    },
  });
};

const fillCreateBlogForm = () => {
  fireEvent.change(screen.getByLabelText("Image URL"), {
    target: { value: validContentImageUrl },
  });
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: "Archive Blog" },
  });
  fireEvent.change(screen.getByLabelText("Subtitle"), {
    target: { value: "Blog subtitle" },
  });
  fireEvent.change(screen.getByLabelText("Summary"), {
    target: { value: "A valid blog summary." },
  });
  fireEvent.change(screen.getByLabelText("Blog Content"), {
    target: {
      value: "A valid blog body with enough content for the schema to pass.",
    },
  });
};

describe("admin article and blog forms", () => {
  beforeAll(() => {
    global.ResizeObserver = ResizeObserverMock;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ refresh: mockRefresh });
    mockCreateArticle.mockResolvedValue({ success: true, data: {} });
    mockCreateBlog.mockResolvedValue({ success: true, data: {} });
    mockPatchArticle.mockResolvedValue({ success: true, data: {} });
    mockPatchBlog.mockResolvedValue({ success: true, data: {} });
  });

  it("surfaces article create field errors without calling success", async () => {
    const onSuccess = jest.fn();
    mockCreateArticle.mockResolvedValueOnce({
      success: false,
      error: "Invalid article input",
      fieldErrors: {
        title: ["An article with this title already exists"],
      },
      formErrors: [],
    });

    render(
      <CreateArticleForm artworkInfo={artworkInfo} onSuccess={onSuccess} />
    );
    fillCreateArticleForm();

    fireEvent.click(screen.getByRole("button", { name: "Create Article" }));

    expect(
      await screen.findByText("An article with this title already exists")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("surfaces article update form errors without calling success", async () => {
    const onSuccess = jest.fn();
    mockPatchArticle.mockResolvedValueOnce({
      success: false,
      error: "Invalid article input",
      fieldErrors: {},
      formErrors: ["Article slug conflicts with an existing article"],
    });

    render(
      <UpdateArticleForm articleInfo={articleInfo} onSuccess={onSuccess} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Update Article" }));

    expect(
      await screen.findByText("Article slug conflicts with an existing article")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("surfaces blog create field errors without refreshing or calling success", async () => {
    const onSuccess = jest.fn();
    mockCreateBlog.mockResolvedValueOnce({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        imageUrl: ["Image URL must use an approved content image host"],
      },
      formErrors: [],
    });

    render(<CreateBlogForm onSuccess={onSuccess} />);
    fillCreateBlogForm();

    fireEvent.click(screen.getByRole("button", { name: "Create Blog" }));

    expect(
      await screen.findByText("Image URL must use an approved content image host")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it("surfaces blog update field errors without calling success", async () => {
    const onSuccess = jest.fn();
    mockPatchBlog.mockResolvedValueOnce({
      success: false,
      error: "Invalid blog input",
      fieldErrors: {
        title: ["A blog with this title already exists"],
      },
      formErrors: [],
    });

    render(<UpdateBlogForm blogInfo={blogInfo} onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: "Update Blog" }));

    expect(
      await screen.findByText("A blog with this title already exists")
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("preserves article and blog success callbacks", async () => {
    const createArticleSuccess = jest.fn();
    const updateArticleSuccess = jest.fn();
    const createBlogSuccess = jest.fn();
    const updateBlogSuccess = jest.fn();

    const { unmount: unmountCreateArticle } = render(
      <CreateArticleForm
        artworkInfo={artworkInfo}
        onSuccess={createArticleSuccess}
      />
    );
    fillCreateArticleForm();
    fireEvent.click(screen.getByRole("button", { name: "Create Article" }));
    await waitFor(() => expect(createArticleSuccess).toHaveBeenCalledTimes(1));
    unmountCreateArticle();

    const { unmount: unmountUpdateArticle } = render(
      <UpdateArticleForm
        articleInfo={articleInfo}
        onSuccess={updateArticleSuccess}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Update Article" }));
    await waitFor(() => expect(updateArticleSuccess).toHaveBeenCalledTimes(1));
    unmountUpdateArticle();

    const { unmount: unmountCreateBlog } = render(
      <CreateBlogForm onSuccess={createBlogSuccess} />
    );
    fillCreateBlogForm();
    fireEvent.click(screen.getByRole("button", { name: "Create Blog" }));
    await waitFor(() => expect(createBlogSuccess).toHaveBeenCalledTimes(1));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
    unmountCreateBlog();

    render(<UpdateBlogForm blogInfo={blogInfo} onSuccess={updateBlogSuccess} />);
    fireEvent.click(screen.getByRole("button", { name: "Update Blog" }));
    await waitFor(() => expect(updateBlogSuccess).toHaveBeenCalledTimes(1));
  });

  it("submits explicit blog create pinned and tags values", async () => {
    render(<CreateBlogForm />);
    fillCreateBlogForm();

    fireEvent.click(screen.getByLabelText("Pinned"));
    fireEvent.click(screen.getByLabelText("artwork"));
    fireEvent.click(screen.getByLabelText("news"));
    fireEvent.click(screen.getByRole("button", { name: "Create Blog" }));

    await waitFor(() =>
      expect(mockCreateBlog).toHaveBeenCalledWith(
        expect.objectContaining({
          pinned: true,
          tags: ["artwork", "news"],
        })
      )
    );
  });

  it("initializes and submits blog update pinned and replacement tags", async () => {
    render(<UpdateBlogForm blogInfo={blogInfo} />);

    expect(screen.getByLabelText("Pinned")).toBeChecked();
    expect(screen.getByLabelText("artwork")).toBeChecked();
    expect(screen.getByLabelText("news")).toBeChecked();

    fireEvent.click(screen.getByLabelText("Pinned"));
    fireEvent.click(screen.getByLabelText("news"));
    fireEvent.click(screen.getByLabelText("events"));
    fireEvent.click(screen.getByRole("button", { name: "Update Blog" }));

    await waitFor(() =>
      expect(mockPatchBlog).toHaveBeenCalledWith(
        blogId,
        expect.objectContaining({
          pinned: false,
          tags: ["artwork", "events"],
        })
      )
    );
  });

  it("derives blog read filter years from returned blog data", () => {
    const years = deriveBlogYearOptions([
      {
        ...blogInfo,
        displayDate: new Date("2026-05-01T00:00:00.000Z"),
      },
      {
        ...blogInfo,
        _id: "507f1f77bcf86cd799439015",
        displayDate: new Date("2025-01-01T00:00:00.000Z"),
      },
      {
        ...blogInfo,
        _id: "507f1f77bcf86cd799439016",
        displayDate: new Date("2026-02-01T00:00:00.000Z"),
      },
    ]);

    expect(years).toEqual(["2026", "2025"]);
    expect(years).not.toContain("2024");
    expect(years).not.toContain("2020");
  });

  it("keeps blog tag form options aligned with canonical constants", () => {
    render(<CreateBlogForm />);

    for (const tag of BLOG_TAGS) {
      expect(screen.getByLabelText(tag)).toBeInTheDocument();
    }

    const options = getBlogFilterOptions(["2026"]);

    expect(options.year).toEqual(["2026"]);
    expect(options.year).not.toContain("2024");
  });
});
