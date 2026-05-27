import { render, screen } from "@testing-library/react";
import AdminPage from "@/app/admin/page";
import DashboardPage from "@/app/admin/dashboard/page";
import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import {
  adminDashboardDefaultPath,
  adminDashboardRootPath,
  adminDashboardSegmentPath,
  adminDashboardSegmentPaths,
  adminDashboardSegments,
} from "@/lib/routes/adminDashboardRoutes";
import { redirect, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  usePathname: jest.fn(),
}));

const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;
const mockUsePathname = usePathname as jest.Mock;

describe("adminDashboardRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/admin/dashboard/articles");
  });

  it("exports the current admin dashboard segment paths", () => {
    expect(adminDashboardRootPath).toBe("/admin/dashboard");
    expect(adminDashboardDefaultPath).toBe("/admin/dashboard/articles");
    expect(adminDashboardSegments).toEqual([
      "articles",
      "artwork",
      "blogs",
      "collections",
      "comments",
      "users",
    ]);
    expect(adminDashboardSegmentPaths).toEqual({
      articles: "/admin/dashboard/articles",
      artwork: "/admin/dashboard/artwork",
      blogs: "/admin/dashboard/blogs",
      collections: "/admin/dashboard/collections",
      comments: "/admin/dashboard/comments",
      users: "/admin/dashboard/users",
    });
  });

  it("builds supported admin dashboard segment paths", () => {
    for (const segment of adminDashboardSegments) {
      expect(adminDashboardSegmentPath(segment)).toBe(
        adminDashboardSegmentPaths[segment]
      );
    }
  });

  it("uses the default dashboard path for admin entry redirects", () => {
    AdminPage();
    DashboardPage();

    expect(mockRedirect).toHaveBeenNthCalledWith(
      1,
      adminDashboardDefaultPath
    );
    expect(mockRedirect).toHaveBeenNthCalledWith(
      2,
      adminDashboardDefaultPath
    );
  });

  it("renders sidebar links with unchanged destinations and prefix active state", () => {
    mockUsePathname.mockReturnValue("/admin/dashboard/comments/review");

    render(<AdminSidebar />);

    expect(screen.getByRole("link", { name: /articles/i })).toHaveAttribute(
      "href",
      adminDashboardSegmentPaths.articles
    );
    expect(screen.getByRole("link", { name: /artwork/i })).toHaveAttribute(
      "href",
      adminDashboardSegmentPaths.artwork
    );
    expect(screen.getByRole("link", { name: /blogs/i })).toHaveAttribute(
      "href",
      adminDashboardSegmentPaths.blogs
    );
    expect(screen.getByRole("link", { name: /collections/i })).toHaveAttribute(
      "href",
      adminDashboardSegmentPaths.collections
    );
    expect(screen.getByRole("link", { name: /comments/i })).toHaveAttribute(
      "href",
      adminDashboardSegmentPaths.comments
    );
    expect(screen.getByRole("link", { name: /users/i })).toHaveAttribute(
      "href",
      adminDashboardSegmentPaths.users
    );
    expect(screen.getByRole("link", { name: /comments/i }).innerHTML).toContain(
      "ring-2"
    );
  });
});
