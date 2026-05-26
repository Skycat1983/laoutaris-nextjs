import {
  authenticateUsername,
  authorizeUser,
} from "@/lib/actions/authenticateUser";
import { authCallbacks } from "@/lib/config/authCallbacks";
import { authOptions } from "@/lib/config/authOptions";
import dbConnect from "@/lib/db/mongodb";
import { UserModel } from "@/lib/data/models";
import { verifyPassword } from "@/lib/helpers/bcrypt";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { getServerSession } from "next-auth";

jest.mock("@/lib/config/authOptions", () => ({
  authOptions: { providers: [] },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("@/lib/helpers/bcrypt", () => ({
  verifyPassword: jest.fn(),
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockFindOne = UserModel.findOne as jest.Mock;
const mockVerifyPassword = verifyPassword as jest.MockedFunction<
  typeof verifyPassword
>;
const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

const requestInternal = {
  body: {},
  query: {},
  headers: {},
  method: "POST",
};

describe("credentials role propagation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
    mockVerifyPassword.mockResolvedValue(true);
  });

  it.each([
    { role: "admin", id: "admin-user-id", username: "admin1" },
    { role: "user", id: "regular-user-id", username: "member1" },
  ])(
    "returns the persisted $role role from credentials authorize",
    async ({ role, id, username }) => {
      mockFindOne.mockResolvedValue({
        _id: { toString: () => id },
        email: `${username}@example.com`,
        username,
        password: "hashed-password",
        role,
      });

      const user = await authorizeUser(
        { username, password: "password1" },
        requestInternal
      );

      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({ username });
      expect(mockVerifyPassword).toHaveBeenCalledWith(
        "password1",
        "hashed-password"
      );
      expect(user).toEqual({
        id,
        email: `${username}@example.com`,
        name: username,
        role,
      });
    }
  );

  it("rejects credentials authorize for an OAuth-style user without a stored password", async () => {
    mockFindOne.mockResolvedValue({
      _id: { toString: () => "oauth-user-id" },
      email: "oauth-user@example.com",
      username: "oauth1",
      role: "user",
    });

    await expect(
      authorizeUser(
        { username: "oauth1", password: "password1" },
        requestInternal
      )
    ).resolves.toBeNull();

    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({ username: "oauth1" });
    expect(mockVerifyPassword).not.toHaveBeenCalled();
  });

  it("does not verify credentials when the stored password hash is missing", async () => {
    mockFindOne.mockResolvedValue({
      _id: { toString: () => "oauth-user-id" },
      email: "oauth-user@example.com",
      username: "oauth1",
      password: "",
      role: "user",
    });

    await expect(
      authenticateUsername({ username: "oauth1", password: "password1" })
    ).resolves.toEqual({
      success: false,
      error: "Invalid password",
    });

    expect(mockFindOne).toHaveBeenCalledWith({ username: "oauth1" });
    expect(mockVerifyPassword).not.toHaveBeenCalled();
  });

  it.each([
    { role: "admin", id: "admin-user-id", username: "admin1" },
    { role: "user", id: "regular-user-id", username: "member1" },
  ])(
    "copies a credentials $role role from user to JWT and session",
    async ({ role, id, username }) => {
      const token = await authCallbacks.jwt({
        token: { id: "" },
        user: {
          id,
          email: `${username}@example.com`,
          name: username,
          role,
        },
      });

      const session = await authCallbacks.session({
        session: {
          user: {
            id: "",
            email: `${username}@example.com`,
            name: username,
          },
          expires: "2099-01-01T00:00:00.000Z",
        },
        token,
      });

      expect(token).toMatchObject({ id, role });
      expect(session.user).toMatchObject({ id, role });
    }
  );

  it("copies an OAuth provider default user role to JWT and session", async () => {
    const id = "oauth-user-id";
    const role = "user";

    const token = await authCallbacks.jwt({
      token: { id: "" },
      user: {
        id,
        email: "oauth-user@example.com",
        image: "https://example.com/avatar.png",
        name: "OAuth User",
        role,
      },
      account: {
        provider: "google",
        providerAccountId: "google-account-id",
        type: "oauth",
      },
      profile: {
        email: "oauth-user@example.com",
        name: "OAuth User",
      },
      isNewUser: true,
    });

    const session = await authCallbacks.session({
      session: {
        user: {
          id: "",
          email: "oauth-user@example.com",
          image: "https://example.com/avatar.png",
          name: "OAuth User",
        },
        expires: "2099-01-01T00:00:00.000Z",
      },
      token,
    });

    expect(token).toMatchObject({ id, role });
    expect(session.user).toMatchObject({ id, role });
  });
});

describe("stable session user ownership", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the stable session user ID", async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        id: "stable-user-id",
        name: "display-name",
        email: "user@example.com",
      },
      expires: "2099-01-01T00:00:00.000Z",
    });

    await expect(getUserIdFromSession()).resolves.toBe("stable-user-id");
    expect(mockGetServerSession).toHaveBeenCalledWith(authOptions);
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it("returns null when there is no session", async () => {
    mockGetServerSession.mockResolvedValue(null);

    await expect(getUserIdFromSession()).resolves.toBeNull();
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it("returns null when the session has no stable user ID", async () => {
    mockGetServerSession.mockResolvedValue({
      user: {
        name: "display-name",
        email: "user@example.com",
      },
      expires: "2099-01-01T00:00:00.000Z",
    });

    await expect(getUserIdFromSession()).resolves.toBeNull();
    expect(mockFindOne).not.toHaveBeenCalled();
  });
});
