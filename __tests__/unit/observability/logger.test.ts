jest.mock("server-only", () => ({}), { virtual: true });

import { createApiLogger } from "@/lib/observability/logger";

describe("structured API logger", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
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
  });
});
