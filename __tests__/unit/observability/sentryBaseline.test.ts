import { readFileSync } from "fs";
import path from "path";
import { redactSentryEvent } from "@/lib/observability/sentryRedaction";

const repoRoot = process.cwd();

const readSource = (filePath: string) =>
  readFileSync(path.join(repoRoot, filePath), "utf8");

describe("Sentry monitoring baseline", () => {
  it("redacts Sentry event PII and request payloads before send", () => {
    const event = redactSentryEvent({
      type: undefined,
      message: "failed for admin@example.com",
      user: {
        email: "admin@example.com",
      },
      request: {
        method: "POST",
        url: "https://example.com/api/v2/contact?token=secret",
        headers: {
          authorization: "Bearer private",
          cookie: "session=private",
        },
        cookies: {
          session: "private",
        },
        data: {
          password: "private",
          email: "viewer@example.com",
        },
        query_string: "token=secret",
      },
      extra: {
        email: "viewer@example.com",
        token: "private-token",
      },
      exception: {
        values: [
          {
            type: "Error",
            value: "failed for owner@example.com",
          },
        ],
      },
      breadcrumbs: [
        {
          message: "clicked by viewer@example.com",
          data: {
            cookie: "session=private",
          },
        },
      ],
    });

    expect(event?.user).toBeUndefined();
    expect(event?.request).toEqual({
      method: "POST",
      url: "https://example.com/api/v2/contact",
      headers: undefined,
      cookies: undefined,
      data: undefined,
      query_string: undefined,
    });
    expect(event?.message).toBe("failed for [redacted]");
    expect(event?.extra).toEqual({
      email: "[redacted]",
      token: "[redacted]",
    });
    expect(event?.exception?.values?.[0]?.value).toBe("failed for [redacted]");
    expect(event?.breadcrumbs?.[0]).toEqual(
      expect.objectContaining({
        message: "clicked by [redacted]",
        data: {
          cookie: "[redacted]",
        },
      })
    );
    expect(JSON.stringify(event)).not.toContain("private");
    expect(JSON.stringify(event)).not.toContain("example.com?token");
    expect(JSON.stringify(event)).not.toContain("@example.com");
  });

  it("keeps runtime config to error reporting without PII, tracing, replay, or source-map upload", () => {
    const runtimeConfig = [
      readSource("sentry.server.config.ts"),
      readSource("sentry.edge.config.ts"),
      readSource("instrumentation-client.ts"),
    ].join("\n");
    const nextConfig = readSource("next.config.mjs");

    expect(runtimeConfig).toMatch(/sendDefaultPii:\s*false/);
    expect(runtimeConfig).toMatch(/tracesSampleRate:\s*0/);
    expect(runtimeConfig).not.toMatch(/replayIntegration|profilesSampleRate/);

    expect(nextConfig).toMatch(/withSentryConfig/);
    expect(nextConfig).toMatch(/sourcemaps:\s*{[\s\S]*disable:\s*true/);
    expect(nextConfig).toMatch(/excludeTracing:\s*true/);
    expect(nextConfig).toMatch(/routeManifestInjection:\s*false/);
    expect(nextConfig).not.toMatch(/SENTRY_AUTH_TOKEN|SENTRY_ORG|SENTRY_PROJECT/);
  });

  it("does not expose server-only Sentry variables through Next config env", () => {
    const nextConfig = readSource("next.config.mjs");

    expect(nextConfig).not.toMatch(/env:\s*{/);
    expect(nextConfig).not.toMatch(/NEXT_PUBLIC_SENTRY_AUTH_TOKEN/);
    expect(nextConfig).not.toMatch(/NEXT_PUBLIC_SENTRY_ORG/);
    expect(nextConfig).not.toMatch(/NEXT_PUBLIC_SENTRY_PROJECT/);
  });
});
