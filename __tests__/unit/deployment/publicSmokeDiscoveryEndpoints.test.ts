import { spawn } from "child_process";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import path from "path";

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, "scripts/smoke-public-routes.mjs");
const canonicalOrigin = "https://laoutaris-nextjs.vercel.app";

type RouteFixture = {
  body?: string;
  headers?: Record<string, string>;
  status: number;
};

type SmokeResult = {
  status: number | null;
  stdout: string;
  stderr: string;
};

const stableSitemapBody = (extraLocs: string[] = []) => {
  const locs = [
    "/",
    "/artwork",
    "/collections",
    "/biography",
    "/blog",
    "/project/about",
    "/project/contact",
    "/shop/products",
    "/search",
    ...extraLocs,
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs
  .map((pathValue) => `  <url><loc>${canonicalOrigin}${pathValue}</loc></url>`)
  .join("\n")}
</urlset>`;
};

const defaultRoutes = (
  overrides: Record<string, RouteFixture> = {}
): Record<string, RouteFixture> => ({
  "/": { status: 200, body: "home" },
  "/artwork": { status: 200, body: "artwork" },
  "/collections": { status: 200, body: "collections" },
  "/blog": { status: 200, body: "blog" },
  "/search?q=art": { status: 200, body: "search" },
  "/shop/products": { status: 200, body: "shop" },
  "/shop/products/codex-smoke-missing-product": {
    status: 404,
    body: "missing product",
  },
  "/robots.txt": {
    status: 200,
    headers: { "Content-Type": "text/plain" },
    body: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /api
Sitemap: ${canonicalOrigin}/sitemap.xml
`,
  },
  "/sitemap.xml": {
    status: 200,
    headers: { "Content-Type": "application/xml" },
    body: stableSitemapBody(),
  },
  "/sign-in": { status: 200, body: "signin" },
  "/api/auth/signout": { status: 200, body: "signout" },
  "/admin/dashboard/articles": {
    status: 302,
    headers: { Location: "/sign-in" },
    body: "",
  },
  ...overrides,
});

const startFixtureServer = async (routes: Record<string, RouteFixture>) => {
  const server = createServer(
    (request: IncomingMessage, response: ServerResponse) => {
      const route = routes[request.url ?? ""];

      if (!route) {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("not found");
        return;
      }

      response.writeHead(route.status, route.headers);
      response.end(route.body ?? "");
    }
  );

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Fixture server did not expose a local port.");
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
};

const runSmoke = async (baseUrl: string): Promise<SmokeResult> =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath, "--base-url", baseUrl], {
      cwd: repoRoot,
      env: {
        ...process.env,
        SMOKE_SEARCH_QUERY: "art",
      },
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => {
      resolve({ status, stdout, stderr });
    });
  });

describe("public smoke discovery endpoint checks", () => {
  it("passes when robots and sitemap discovery endpoints expose safe public output", async () => {
    const fixture = await startFixtureServer(defaultRoutes());

    try {
      const result = await runSmoke(fixture.baseUrl);

      expect(result.status).toBe(0);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("[PASS] Robots discovery");
      expect(result.stdout).toContain("[PASS] Sitemap discovery");
      expect(result.stdout).toContain("Summary: 12 passed, 0 failed, 4 skipped.");
    } finally {
      await fixture.close();
    }
  });

  it("fails without dumping robots body when the sitemap directive is missing", async () => {
    const fixture = await startFixtureServer(
      defaultRoutes({
        "/robots.txt": {
          status: 200,
          headers: { "Content-Type": "text/plain" },
          body: "User-agent: *\nAllow: /\nPRIVATE BODY SHOULD NOT PRINT",
        },
      })
    );

    try {
      const result = await runSmoke(fixture.baseUrl);

      expect(result.status).toBe(1);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("[FAIL] Robots discovery");
      expect(result.stdout).toContain(
        "body check failed: expected a Sitemap: directive"
      );
      expect(result.stdout).not.toContain("PRIVATE BODY SHOULD NOT PRINT");
    } finally {
      await fixture.close();
    }
  });

  it("fails when sitemap output exposes private route paths", async () => {
    const fixture = await startFixtureServer(
      defaultRoutes({
        "/sitemap.xml": {
          status: 200,
          headers: { "Content-Type": "application/xml" },
          body: stableSitemapBody(["/admin/dashboard/articles"]),
        },
      })
    );

    try {
      const result = await runSmoke(fixture.baseUrl);

      expect(result.status).toBe(1);
      expect(result.stderr).toBe("");
      expect(result.stdout).toContain("[FAIL] Sitemap discovery");
      expect(result.stdout).toContain(
        "body check failed: sitemap includes private paths: /admin/dashboard/articles"
      );
    } finally {
      await fixture.close();
    }
  });
});
