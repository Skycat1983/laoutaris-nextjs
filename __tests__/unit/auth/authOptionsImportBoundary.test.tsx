import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

type CredentialsProviderForTest = {
  id: string;
  options: {
    authorize: (
      credentials: Record<"username" | "password", string> | undefined,
      req: {
        body: Record<string, never>;
        query: Record<string, never>;
        headers: Record<string, never>;
        method: string;
      }
    ) => Promise<unknown>;
  };
};

const requestInternal = {
  body: {},
  query: {},
  headers: {},
  method: "POST",
};

const mockAuthDb = () => {
  jest.doMock("@/lib/db/adapter", () => ({
    CustomMongoDBAdapter: jest.fn(() => ({})),
  }));

  jest.doMock("@/lib/db", () => ({
    clientPromise: Promise.resolve({}),
  }));
};

const mockBcryptFailure = () => {
  const state = {
    helperLoaded: false,
    nativePackageLoaded: false,
  };

  jest.doMock("@/lib/helpers/bcrypt", () => {
    state.helperLoaded = true;
    throw new Error("bcrypt helper should not load during public auth imports");
  });

  jest.doMock("bcrypt", () => {
    state.nativePackageLoaded = true;
    throw new Error("native bcrypt package should not load during public auth imports");
  });

  return state;
};

const getCredentialsProvider = (authOptions: {
  providers: Array<{ id?: string }>;
}) => {
  const provider = authOptions.providers.find(
    (candidate) => candidate.id === "credentials"
  ) as CredentialsProviderForTest | undefined;

  if (!provider) {
    throw new Error("Credentials provider was not configured");
  }

  return provider;
};

const mockRootLayoutDependencies = (
  mockDbConnect: jest.Mock,
  mockGetServerSession: jest.Mock
) => {
  jest.doMock("next-auth", () => ({
    getServerSession: mockGetServerSession,
  }));

  jest.doMock("@/lib/db/mongodb", () => ({
    __esModule: true,
    default: mockDbConnect,
  }));

  jest.doMock("@/lib/styles/fonts", () => ({
    archivo: { variable: "font-archivo" },
    archivoBlack: { variable: "font-archivo-black" },
    cinzelDecorative: { variable: "font-cinzel-decorative" },
    crimson: { variable: "font-crimson" },
    cormorant: { variable: "font-cormorant" },
  }));

  jest.doMock("@/components/modules/modal/Modal", () => ({
    __esModule: true,
    default: function MockModal() {
      return React.createElement("div", { "data-testid": "modal" });
    },
  }));

  jest.doMock("@/components/modules/footer/Footer", () => ({
    __esModule: true,
    default: function MockFooter() {
      return React.createElement("footer", { "data-testid": "footer" });
    },
  }));

  jest.doMock("@/components/modules/navigation/header/Header", () => ({
    Header: function MockHeader({ className }: { className?: string }) {
      return React.createElement("header", {
        className,
        "data-testid": "header",
      });
    },
  }));

  jest.doMock("@/contexts/ClientContextBoundary", () => ({
    __esModule: true,
    default: function MockClientContextBoundary({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return React.createElement(
        "div",
        { "data-testid": "client-context-boundary" },
        children
      );
    },
  }));
};

describe("authOptions import boundary", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.dontMock("@/lib/db");
    jest.dontMock("@/lib/db/adapter");
    jest.dontMock("@/lib/db/mongodb");
    jest.dontMock("@/lib/helpers/bcrypt");
    jest.dontMock("@/lib/actions/authenticateUser");
    jest.dontMock("bcrypt");
    jest.dontMock("next-auth");
    jest.dontMock("@/lib/styles/fonts");
    jest.dontMock("@/components/modules/modal/Modal");
    jest.dontMock("@/components/modules/footer/Footer");
    jest.dontMock("@/components/modules/navigation/header/Header");
    jest.dontMock("@/contexts/ClientContextBoundary");
  });

  it("does not load bcrypt when authOptions is imported for session reads", async () => {
    mockAuthDb();
    const bcryptState = mockBcryptFailure();

    const { authOptions } = await import("@/lib/config/authOptions");

    expect(getCredentialsProvider(authOptions)).toBeDefined();
    expect(bcryptState.helperLoaded).toBe(false);
    expect(bcryptState.nativePackageLoaded).toBe(false);
  });

  it("lazy-loads the credentials authorize implementation when credentials authorize runs", async () => {
    mockAuthDb();
    const mockAuthorizeUser = jest.fn().mockResolvedValue({
      id: "user-id",
      email: "member1@example.com",
      name: "member1",
      role: "user",
    });
    const authenticateUserState = {
      loaded: false,
    };

    jest.doMock("@/lib/actions/authenticateUser", () => {
      authenticateUserState.loaded = true;
      return {
        authorizeUser: mockAuthorizeUser,
      };
    });

    const { authOptions } = await import("@/lib/config/authOptions");
    const credentialsProvider = getCredentialsProvider(authOptions);

    expect(authenticateUserState.loaded).toBe(false);

    await expect(
      credentialsProvider.options.authorize(
        { username: "member1", password: "password1" },
        requestInternal
      )
    ).resolves.toEqual({
      id: "user-id",
      email: "member1@example.com",
      name: "member1",
      role: "user",
    });
    expect(authenticateUserState.loaded).toBe(true);
    expect(mockAuthorizeUser).toHaveBeenCalledWith(
      { username: "member1", password: "password1" },
      requestInternal
    );
  });

  it("renders the root layout public shell without requiring bcrypt", async () => {
    mockAuthDb();
    const bcryptState = mockBcryptFailure();
    const mockDbConnect = jest.fn().mockResolvedValue(undefined);
    const mockGetServerSession = jest.fn().mockResolvedValue(null);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    mockRootLayoutDependencies(mockDbConnect, mockGetServerSession);

    try {
      const { default: RootLayout } = await import("@/app/layout");
      const element = await RootLayout({
        children: React.createElement("section", null, "Public route content"),
      });

      expect(renderToStaticMarkup(element)).toContain("Public route content");
      expect(mockDbConnect).toHaveBeenCalledTimes(1);
      expect(mockGetServerSession).toHaveBeenCalledWith(
        expect.objectContaining({
          providers: expect.any(Array),
        })
      );
      expect(bcryptState.helperLoaded).toBe(false);
      expect(bcryptState.nativePackageLoaded).toBe(false);
    } finally {
      consoleLogSpy.mockRestore();
    }
  });
});
