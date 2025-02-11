import { render, screen } from "@testing-library/react";
import { HomeBlogSectionLoader } from "./HomeBlogSectionLoader";
import { fetchBlogEntries } from "@/lib/api/blogApi";

// Mock the API call
jest.mock("@/lib/api/blogApi", () => ({
  fetchBlogEntries: jest.fn(),
}));

// Mock the HomeBlogSection component
jest.mock("@/components/contentSections/HomeBlogSection", () => ({
  __esModule: true,
  default: ({ blogs }: { blogs: any[] }) => (
    <div data-testid="blog-section">
      {blogs.map((blog) => (
        <div key={blog.slug}>{blog.title}</div>
      ))}
    </div>
  ),
}));

describe.skip("HomeBlogSectionLoader", () => {
  const mockBlogs = [
    {
      title: "Test Blog",
      subtitle: "Test Subtitle",
      slug: "test-blog",
      imageUrl: "test.jpg",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully fetches and transforms blog data", async () => {
    (fetchBlogEntries as jest.Mock).mockResolvedValue({ data: mockBlogs });
    render(await HomeBlogSectionLoader());

    expect(fetchBlogEntries).toHaveBeenCalledWith({
      sortby: "latest",
      limit: 4,
      fields: ["title", "subtitle", "slug", "imageUrl"],
    });

    expect(screen.getByText("Test Blog")).toBeInTheDocument();
  });

  it("handles errors gracefully", async () => {
    (fetchBlogEntries as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );
    const { container } = render(await HomeBlogSectionLoader());
    expect(container.firstChild).toBeNull();
  });
});
