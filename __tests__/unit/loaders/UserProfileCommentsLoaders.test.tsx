import fs from "fs";
import path from "path";
import React, { type ReactElement } from "react";
import { UserSettingsLoader } from "@/components/loaders/componentLoaders/UserSettingsLoader";
import { UserCommentsLoader } from "@/components/loaders/viewLoaders/UserCommentsLoader";
import { AccountSettings } from "@/components/sections/AccountSettings";
import { UserCommentsView } from "@/components/views/UserCommentsView";
import { getOwnUserProfile } from "@/lib/data/services/getOwnUserProfile";
import { getOwnUserComments } from "@/lib/data/services/getOwnUserComments";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

jest.mock("@/lib/data/services/getOwnUserProfile", () => ({
  getOwnUserProfile: jest.fn(),
}));

jest.mock("@/lib/data/services/getOwnUserComments", () => ({
  getOwnUserComments: jest.fn(),
}));

jest.mock("@/lib/session/getUserIdFromSession", () => ({
  getUserIdFromSession: jest.fn(),
}));

jest.mock("@/components/sections/AccountSettings", () => ({
  AccountSettings: jest.fn(() => null),
}));

jest.mock("@/components/views/UserCommentsView", () => ({
  UserCommentsView: jest.fn(() => null),
}));

const mockGetOwnUserProfile = getOwnUserProfile as jest.MockedFunction<
  typeof getOwnUserProfile
>;
const mockGetOwnUserComments = getOwnUserComments as jest.MockedFunction<
  typeof getOwnUserComments
>;
const mockGetUserIdFromSession = getUserIdFromSession as jest.MockedFunction<
  typeof getUserIdFromSession
>;

const userId = "507f1f77bcf86cd799439011";

const profile = {
  _id: userId,
  email: "joseph@example.com",
  username: "joseph",
  role: "user",
  favourites: [],
  watchlist: [],
  comments: [],
  favouritedCount: 0,
  watchlistCount: 0,
  commentCount: 0,
} as never;

const comments = [
  {
    _id: "comment-1",
    text: "A note",
    isOwner: true,
  },
] as never;

describe("account profile and comment loaders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUserIdFromSession.mockResolvedValue(userId);
    mockGetOwnUserProfile.mockResolvedValue(profile);
    mockGetOwnUserComments.mockResolvedValue({
      comments,
      metadata: {
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      },
    } as never);
  });

  it("renders account settings through the server profile service without same-app fetches", async () => {
    const element = (await UserSettingsLoader()) as ReactElement;

    expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
    expect(mockGetOwnUserProfile).toHaveBeenCalledWith(userId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(AccountSettings);
    expect(element.props).toEqual(profile);
  });

  it("renders user comments through the server comment service without same-app fetches", async () => {
    const element = (await UserCommentsLoader()) as ReactElement<{
      children: React.ReactNode;
    }>;
    const children = React.Children.toArray(
      element.props.children
    ) as ReactElement[];

    expect(mockGetUserIdFromSession).toHaveBeenCalledTimes(1);
    expect(mockGetOwnUserComments).toHaveBeenCalledWith(userId);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(children[0].type).toBe(UserCommentsView);
    expect(children[0].props).toEqual({ comments });
  });

  it("throws the existing unauthorized loader errors before service work", async () => {
    mockGetUserIdFromSession.mockResolvedValue(null);

    await expect(UserSettingsLoader()).rejects.toThrow("Unauthorized");
    await expect(UserCommentsLoader()).rejects.toThrow("Unauthorized");

    expect(mockGetOwnUserProfile).not.toHaveBeenCalled();
    expect(mockGetOwnUserComments).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("throws existing missing-user errors when services return null", async () => {
    mockGetOwnUserProfile.mockResolvedValue(null);
    mockGetOwnUserComments.mockResolvedValue(null);

    await expect(UserSettingsLoader()).rejects.toThrow("User not found");
    await expect(UserCommentsLoader()).rejects.toThrow("User not found");

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("converts service failures to existing loader errors", async () => {
    mockGetOwnUserProfile.mockRejectedValue(
      new Error("private profile failure")
    );
    mockGetOwnUserComments.mockRejectedValue(
      new Error("private comments failure")
    );

    await expect(UserSettingsLoader()).rejects.toThrow(
      "Failed to fetch user settings"
    );
    await expect(UserCommentsLoader()).rejects.toThrow(
      "Failed to fetch user comments"
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies or direct fetches", () => {
    const files = [
      "src/components/loaders/componentLoaders/UserSettingsLoader.tsx",
      "src/components/loaders/viewLoaders/UserCommentsLoader.tsx",
    ];
    const retiredUserApiName = ["server", "UserApi"].join("");

    for (const file of files) {
      const source = fs.readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source).not.toMatch(
        new RegExp(
          `${retiredUserApiName}|serverApi|getUserComments|profile\\.get|fetch\\(`
        )
      );
    }
  });
});
