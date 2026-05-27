jest.mock("server-only", () => ({}), { virtual: true });

jest.mock("@sentry/nextjs", () => ({
  __mockScope: {
    setContext: jest.fn(),
    setLevel: jest.fn(),
    setTag: jest.fn(),
  },
  captureException: jest.fn(),
  withScope: jest.fn((callback: (scope: unknown) => void) => {
    const sentry = jest.requireMock("@sentry/nextjs");
    callback(sentry.__mockScope);
  }),
}));

import * as Sentry from "@sentry/nextjs";
import { createApiLogger, createServerLogger } from "@/lib/observability/logger";

const sentryMock = Sentry as typeof Sentry & {
  __mockScope: {
    setContext: jest.Mock;
    setLevel: jest.Mock;
    setTag: jest.Mock;
  };
  captureException: jest.Mock;
};

describe("structured API logger", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    sentryMock.__mockScope.setContext.mockClear();
    sentryMock.__mockScope.setLevel.mockClear();
    sentryMock.__mockScope.setTag.mockClear();
    sentryMock.captureException.mockClear();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("writes structured request context and redacts unsafe fields", () => {
    const logger = createApiLogger({
      requestId: "request-1234",
      method: "POST",
      route: "/api/v2/example",
    });

    logger.error("api.example.failed", {
      errorLabel: "example_failed",
      email: "viewer@example.com",
      nested: {
        authorization: "Bearer secret-token",
        cookie: "session=private",
        password: "private-password",
        token: "private-token",
      },
      error: new Error("failed for admin@example.com"),
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(payload).toEqual(
      expect.objectContaining({
        level: "error",
        event: "api.example.failed",
        requestId: "request-1234",
        method: "POST",
        route: "/api/v2/example",
        errorLabel: "example_failed",
      })
    );
    expect(payload.email).toBe("[redacted]");
    expect(payload.nested).toEqual({
      authorization: "[redacted]",
      cookie: "[redacted]",
      password: "[redacted]",
      token: "[redacted]",
    });
    expect(payload.error).toEqual({
      name: "Error",
      message: "failed for [redacted]",
    });
    expect(JSON.stringify(payload)).not.toContain("secret-token");
    expect(JSON.stringify(payload)).not.toContain("admin@example.com");
    expect(JSON.stringify(payload)).not.toContain("stack");
    expect(sentryMock.__mockScope.setTag).toHaveBeenCalledWith(
      "request_id",
      "request-1234"
    );
    expect(sentryMock.__mockScope.setTag).toHaveBeenCalledWith(
      "route",
      "/api/v2/example"
    );
    expect(sentryMock.__mockScope.setTag).toHaveBeenCalledWith(
      "method",
      "POST"
    );
    expect(sentryMock.__mockScope.setContext).toHaveBeenCalledWith(
      "observability",
      expect.objectContaining({
        event: "api.example.failed",
        email: "[redacted]",
      })
    );
    expect(JSON.stringify(sentryMock.__mockScope.setContext.mock.calls)).not.toContain(
      "secret-token"
    );
    expect(JSON.stringify(sentryMock.__mockScope.setContext.mock.calls)).not.toContain(
      "admin@example.com"
    );
    expect(sentryMock.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Error",
        message: "failed for [redacted]",
      })
    );
  });

  it("allows explicitly approved email fields and gated stacks", () => {
    const logger = createApiLogger(
      {
        requestId: "request-5678",
        route: "/api/v2/example",
      },
      {
        allowEmailFields: ["supportEmail"],
        includeStack: true,
      }
    );

    logger.error("api.example.failed", {
      supportEmail: "support@example.com",
      email: "viewer@example.com",
      error: new Error("boom"),
    });

    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(payload.supportEmail).toBe("support@example.com");
    expect(payload.email).toBe("[redacted]");
    expect(payload.error.stack).toEqual(expect.any(String));
    expect(sentryMock.__mockScope.setContext).toHaveBeenCalledWith(
      "observability",
      expect.objectContaining({
        supportEmail: "[redacted]",
        email: "[redacted]",
      })
    );
  });

  it("writes requestless server logs with redacted fields", () => {
    const logger = createServerLogger({
      component: "ExampleLoader",
      operation: "public.example.loader",
      surface: "server_loader",
    });

    logger.error("loader.public.example.failed", {
      slug: "public-slug",
      email: "viewer@example.com",
      error: new Error("failed for admin@example.com"),
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(payload).toEqual(
      expect.objectContaining({
        level: "error",
        event: "loader.public.example.failed",
        component: "ExampleLoader",
        operation: "public.example.loader",
        surface: "server_loader",
        slug: "public-slug",
        email: "[redacted]",
        error: {
          name: "Error",
          message: "failed for [redacted]",
        },
      })
    );
    expect(payload.requestId).toBeUndefined();
    expect(JSON.stringify(payload)).not.toContain("admin@example.com");
  });
});
