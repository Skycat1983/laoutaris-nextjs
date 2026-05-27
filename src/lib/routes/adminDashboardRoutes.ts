import { authProtectedRoutes } from "@/lib/routes/authProtectedRoutes";

export const adminDashboardRootPath = `${authProtectedRoutes.admin}/dashboard`;

export const adminDashboardSegments = [
  "articles",
  "artwork",
  "blogs",
  "collections",
  "comments",
  "users",
] as const;

export type AdminDashboardSegment = (typeof adminDashboardSegments)[number];

export const adminDashboardSegmentPath = (
  segment: AdminDashboardSegment
) => `${adminDashboardRootPath}/${segment}`;

export const adminDashboardArticlesPath =
  authProtectedRoutes.adminDashboardArticles;

export const adminDashboardDefaultPath = adminDashboardArticlesPath;

export const adminDashboardSegmentPaths = {
  articles: adminDashboardArticlesPath,
  artwork: adminDashboardSegmentPath("artwork"),
  blogs: adminDashboardSegmentPath("blogs"),
  collections: adminDashboardSegmentPath("collections"),
  comments: adminDashboardSegmentPath("comments"),
  users: adminDashboardSegmentPath("users"),
} as const satisfies Record<AdminDashboardSegment, string>;
