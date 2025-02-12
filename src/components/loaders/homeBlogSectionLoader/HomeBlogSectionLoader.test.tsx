import { render, screen } from "@testing-library/react";
import { HomeBlogSectionLoader } from "./HomeBlogSectionLoader";
import { fetchBlogEntries } from "@/lib/api/blogApi";
import { HomeBlogSection } from "@/components/contentSections/HomeBlogSection";

// Before imports, mock the modules
jest.mock("@/lib/api/blogApi", () => ({
  fetchBlogEntries: jest.fn(),
}));

// Fix the HomeBlogSection mock to properly export the named function
jest.mock("@/components/contentSections/HomeBlogSection", () => ({
  HomeBlogSection: jest.fn().mockImplementation(({ blogs }) => (
    <div data-testid="blog-section">
      {blogs.map((blog: any) => (
        <div key={blog.slug}>{blog.title}</div>
      ))}
    </div>
  )),
}));

describe("HomeBlogSectionLoader", () => {
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
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (fetchBlogEntries as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );
    const { container } = render(await HomeBlogSectionLoader());
    expect(container.firstChild).toBeNull();

    consoleSpy.mockRestore();
  });
});
