jest.mock("server-only", () => ({}), { virtual: true });

import React, { Children, type ReactElement } from "react";
import DashboardLayout from "@/app/admin/dashboard/layout";
import { authProtectedRoutes } from "@/lib/routes/authProtectedRoutes";
import {
  getAdminFrontendAccess,
  requireAdminFrontendAccess,
} from "@/lib/session/requireAdminFrontendAccess";
import { AdminSidebar } from "@/components/layouts/admin/AdminSidebar";
import dbConnect from "@/lib/db/mongodb";
import { UserModel } from "@/lib/data/models/userModel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

jest.mock("@/components/layouts/admin/AdminSidebar", () => ({
  AdminSidebar: jest.fn(() => <nav data-testid="admin-sidebar" />),
}));

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn((path: string) => {
    const error = new Error(`NEXT_REDIRECT:${path}`);
    Object.assign(error, { digest: `NEXT_REDIRECT;replace;${path};307;` });
    throw error;
  }),
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models/userModel", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindById = UserModel.findById as jest.Mock;
const mockRedirect = jest.mocked(redirect);

const adminUserId = "admin-user-id";
const regularUserId = "regular-user-id";

const setSession = (user: { id?: string; role?: string } | null) => {
  mockGetServerSession.mockResolvedValue(
    user
      ? {
          user: {
            name: "Test User",
            email: "test@example.com",
            ...user,
          },
          expires: "2099-01-01T00:00:00.000Z",
        }
      : null
  );
};

describe("admin frontend persisted role guard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockFindById.mockResolvedValue({ role: "admin" });
  });

  it("allows admin frontend rendering when session and persisted roles are admin", async () => {
    setSession({ id: adminUserId, role: "admin" });

    await expect(getAdminFrontendAccess()).resolves.toEqual({
      ok: true,
      userId: adminUserId,
    });

    const layout = (await DashboardLayout({
      children: <div data-testid="admin-content" />,
      feed: <aside data-testid="admin-feed" />,
      main: <main data-testid="admin-main" />,
    })) as ReactElement<{ children: React.ReactNode }>;

    const [sidebar] = Children.toArray(layout.props.children) as ReactElement[];

    expect(layout.type).toBe("div");
    expect(sidebar.type).toBe(AdminSidebar);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockFindById).toHaveBeenCalledWith(adminUserId);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated admin frontend requests before persistence work", async () => {
    setSession(null);

    await expect(getAdminFrontendAccess()).resolves.toEqual({
      ok: false,
      reason: "unauthenticated",
    });

    await expect(requireAdminFrontendAccess()).rejects.toMatchObject({
      digest: `NEXT_REDIRECT;replace;${authProtectedRoutes.signIn};307;`,
    });

    expect(mockRedirect).toHaveBeenCalledWith(authProtectedRoutes.signIn);
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("redirects non-admin session roles before persistence work", async () => {
    setSession({ id: regularUserId, role: "user" });

    await expect(getAdminFrontendAccess()).resolves.toEqual({
      ok: false,
      reason: "forbidden",
    });

    await expect(requireAdminFrontendAccess()).rejects.toMatchObject({
      digest: `NEXT_REDIRECT;replace;${authProtectedRoutes.home};307;`,
    });

    expect(mockRedirect).toHaveBeenCalledWith(authProtectedRoutes.home);
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });

  it("redirects stale admin JWTs when the persisted role has been demoted", async () => {
    setSession({ id: adminUserId, role: "admin" });
    mockFindById.mockResolvedValue({ role: "user" });

    await expect(getAdminFrontendAccess()).resolves.toEqual({
      ok: false,
      reason: "forbidden",
    });

    await expect(requireAdminFrontendAccess()).rejects.toMatchObject({
      digest: `NEXT_REDIRECT;replace;${authProtectedRoutes.home};307;`,
    });

    expect(mockRedirect).toHaveBeenCalledWith(authProtectedRoutes.home);
    expect(mockDbConnect).toHaveBeenCalledTimes(2);
    expect(mockFindById).toHaveBeenCalledWith(adminUserId);
  });

  it("fails closed when persisted admin verification cannot complete", async () => {
    setSession({ id: adminUserId, role: "admin" });
    mockDbConnect.mockRejectedValue(new Error("private database detail"));

    await expect(getAdminFrontendAccess()).resolves.toEqual({
      ok: false,
      reason: "unverified",
    });

    await expect(requireAdminFrontendAccess()).rejects.toThrow(
      "Unable to verify admin access"
    );
    expect(mockRedirect).not.toHaveBeenCalled();
    expect(mockFindById).not.toHaveBeenCalled();
  });
});
