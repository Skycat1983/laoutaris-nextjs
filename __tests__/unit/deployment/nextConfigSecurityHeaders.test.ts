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

  it("preserves current external resource allowances", () => {
    const headers = getHeaderMap(globalHeaderRule?.headers ?? []);
    const csp = headers.get("content-security-policy");

    expect(csp).toEqual(expect.any(String));
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
});
