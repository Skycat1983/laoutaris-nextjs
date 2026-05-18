jest.mock("server-only", () => ({}), { virtual: true });

import {
  REQUEST_ID_HEADER,
  createRequestContext,
  isSafeRequestId,
} from "@/lib/observability/requestContext";

describe("request context", () => {
  it("propagates a safe caller-provided x-request-id", () => {
    const requestId = "request-1234_safe.ID";
    const context = createRequestContext({
      headers: new Headers({ "x-request-id": requestId }),
      method: "GET",
      nextUrl: { pathname: "/api/example" },
    });

    expect(context.requestId).toBe(requestId);
    expect(context.method).toBe("GET");
    expect(context.route).toBe("/api/example");
    expect(context.responseHeaders.get(REQUEST_ID_HEADER)).toBe(requestId);
  });

  it("generates a request ID when the caller omits one", () => {
    const context = createRequestContext({
      headers: new Headers(),
    });

    expect(context.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
    expect(context.responseHeaders.get(REQUEST_ID_HEADER)).toBe(
      context.requestId
    );
  });

  it("rejects unsafe caller-provided request IDs", () => {
    expect(isSafeRequestId("short")).toBe(false);
    expect(isSafeRequestId("has spaces 123")).toBe(false);
    expect(isSafeRequestId("has\nnewline123")).toBe(false);

    const context = createRequestContext({
      headers: new Headers({ "x-request-id": "has spaces 123" }),
    });

    expect(context.requestId).not.toBe("has spaces 123");
    expect(context.requestId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
