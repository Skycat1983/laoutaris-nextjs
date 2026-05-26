import { spawnSync } from "child_process";

type NextHeader = {
  key: string;
  value: string;
};

type NextHeaderRule = {
  source: string;
  headers: NextHeader[];
};

type RemotePattern = {
  protocol?: string;
  hostname?: string;
  pathname?: string;
};

type NextConfigSnapshot = {
  headerRules: NextHeaderRule[];
  remotePatterns: RemotePattern[];
};

const CURRENT_ENFORCED_CSP = [
  "default-src 'self' https: data: blob:",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "style-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "connect-src 'self' data: https: blob:",
  "media-src 'self' data: https: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const REPORT_ONLY_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://cdn-icons-png.flaticon.com https://cdn.shopify.com",
  "font-src 'self' data: https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "connect-src 'self' https://api.cloudinary.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "style-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "script-src 'self' 'unsafe-inline' https://widget.cloudinary.com https://upload-widget.cloudinary.com https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' blob: https://res.cloudinary.com",
].join("; ");

const repoRoot = process.cwd();

const readNextConfig = () => {
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      "import('./next.config.mjs').then(async ({ default: config }) => console.log(JSON.stringify({ headerRules: await config.headers(), remotePatterns: config.images?.remotePatterns ?? [] })))",
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout);
  }

  return JSON.parse(result.stdout) as NextConfigSnapshot;
};

const getHeaderMap = (headers: NextHeader[]) =>
  new Map(headers.map(({ key, value }) => [key.toLowerCase(), value]));

const getDirectives = (csp: string | undefined) =>
  new Map(
    (csp ?? "").split("; ").map((directive) => {
      const [name, ...sources] = directive.split(" ");
      return [name, sources];
    })
  );

describe("Next security headers", () => {
  const nextConfig = readNextConfig();
  const headerRules = nextConfig.headerRules;
  const allHeaders = headerRules.flatMap(({ headers }) => headers);
  const globalHeaderRule = headerRules.find(({ source }) => source === "/:path*");

  it("does not configure invalid wildcard credentialed API CORS", () => {
    const corsHeaders = getHeaderMap(
      allHeaders.filter(({ key }) => key.startsWith("Access-Control-"))
    );

    expect(corsHeaders.get("access-control-allow-origin")).not.toBe("*");
    expect(corsHeaders.get("access-control-allow-credentials")).not.toBe(
      "true"
    );
  });

  it("does not allow wildcard request headers in global API CORS", () => {
    const allowedHeaderValues = allHeaders
      .filter(({ key }) => key.toLowerCase() === "access-control-allow-headers")
      .map(({ value }) => value);

    expect(allowedHeaderValues).not.toContain("*");
  });

  it("sets baseline hardening headers on app routes", () => {
    expect(globalHeaderRule).toBeDefined();

    const headers = getHeaderMap(globalHeaderRule?.headers ?? []);
    const permissionsPolicy = headers.get("permissions-policy");

    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(permissionsPolicy).toEqual(expect.any(String));
    expect(permissionsPolicy).toContain("camera=()");
    expect(permissionsPolicy).toContain("microphone=()");
    expect(permissionsPolicy).toContain("geolocation=()");
    expect(permissionsPolicy).toContain("payment=()");
  });

  it("adds low-risk CSP hardening directives", () => {
    const headers = getHeaderMap(globalHeaderRule?.headers ?? []);
    const csp = headers.get("content-security-policy");

    expect(csp).toEqual(expect.any(String));
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
  });

  it("preserves the current enforced CSP during report-only observation", () => {
    const headers = getHeaderMap(globalHeaderRule?.headers ?? []);
    const csp = headers.get("content-security-policy");

    expect(csp).toBe(CURRENT_ENFORCED_CSP);
    expect(csp).toContain("https://widget.cloudinary.com");
    expect(csp).toContain("https://upload-widget.cloudinary.com");
    expect(csp).toContain("https://www.youtube.com");
    expect(csp).toContain("https://www.youtube-nocookie.com");
    expect(csp).toContain("img-src 'self' data: https: blob:");
    expect(csp).toContain("connect-src 'self' data: https: blob:");
    expect(csp).toContain("media-src 'self' data: https: blob:");
    expect(csp).toContain("font-src 'self' data: https://widget.cloudinary.com");
    expect(nextConfig.remotePatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          protocol: "https",
          hostname: "res.cloudinary.com",
          pathname: "/dzncmfirr/**",
        }),
        expect.objectContaining({
          protocol: "https",
          hostname: "cdn.shopify.com",
          pathname: "/**",
        }),
      ])
    );
  });

  it("adds a narrowed report-only CSP allowlist", () => {
    const headers = getHeaderMap(globalHeaderRule?.headers ?? []);
    const reportOnlyCsp = headers.get("content-security-policy-report-only");

    expect(reportOnlyCsp).toBe(REPORT_ONLY_CSP);

    const directives = getDirectives(reportOnlyCsp);

    expect(directives.get("default-src")).toEqual(["'self'"]);
    expect(directives.get("script-src")).not.toContain("'unsafe-eval'");
    expect(directives.get("script-src")).toEqual(
      expect.arrayContaining([
        "'self'",
        "'unsafe-inline'",
        "https://widget.cloudinary.com",
        "https://upload-widget.cloudinary.com",
        "https://www.youtube.com",
        "https://www.youtube-nocookie.com",
      ])
    );

    expect(directives.get("img-src")).not.toContain("https:");
    expect(directives.get("img-src")).toEqual(
      expect.arrayContaining([
        "'self'",
        "data:",
        "blob:",
        "https://res.cloudinary.com",
        "https://cdn-icons-png.flaticon.com",
        "https://cdn.shopify.com",
      ])
    );

    expect(directives.get("connect-src")).toEqual([
      "'self'",
      "https://api.cloudinary.com",
      "https://widget.cloudinary.com",
      "https://upload-widget.cloudinary.com",
    ]);
    expect(directives.get("connect-src")).not.toEqual(
      expect.arrayContaining(["data:", "https:", "blob:"])
    );

    expect(directives.get("media-src")).toEqual([
      "'self'",
      "blob:",
      "https://res.cloudinary.com",
    ]);
    expect(directives.get("media-src")).not.toEqual(
      expect.arrayContaining(["data:", "https:"])
    );
  });
});
