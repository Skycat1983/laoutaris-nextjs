import { readFileSync } from "fs";
import path from "path";
import { render, screen, within } from "@testing-library/react";
import MainLoading from "@/app/admin/dashboard/@main/loading";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("admin dashboard main loading fallback", () => {
  it("renders an accessible main-panel loading skeleton", () => {
    render(<MainLoading />);

    const region = screen.getByRole("region", {
      name: "Admin dashboard section loading",
      busy: true,
    });

    expect(
      within(region).getByRole("status", {
        name: "Loading admin dashboard section",
      })
    ).toHaveTextContent("Loading admin dashboard section");
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("keeps the main parallel default route free of stale generic loaders", () => {
    const source = readRepoFile("src/app/admin/dashboard/@main/default.tsx");

    expect(source).not.toContain("@/app/loading");
    expect(source).not.toContain("PageLoading");
    expect(source).not.toContain("Loading...");
    expect(source).toContain("return null");
  });
});
