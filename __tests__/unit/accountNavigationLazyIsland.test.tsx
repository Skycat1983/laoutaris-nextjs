import fs from "fs";
import path from "path";
import { fireEvent, render, screen } from "@testing-library/react";
import { AccountNav } from "@/components/modules/navigation/accountNav/AccountNav";

jest.mock("@/components/shadcn/menubar", () => {
  const React = require("react");

  const Passthrough = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );

  return {
    Menubar: Passthrough,
    MenubarCheckboxItem: Passthrough,
    MenubarContent: Passthrough,
    MenubarItem: Passthrough,
    MenubarMenu: Passthrough,
    MenubarRadioGroup: Passthrough,
    MenubarSeparator: () => <hr />,
    MenubarShortcut: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    ),
    MenubarSub: Passthrough,
    MenubarSubContent: Passthrough,
    MenubarSubTrigger: Passthrough,
    MenubarTrigger: ({
      children,
      disabled,
    }: {
      children: React.ReactNode;
      disabled?: boolean;
    }) => (
      <button disabled={disabled} type="button">
        {children}
      </button>
    ),
    MenubarRadioItem: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => (
      <button type="button" value={value}>
        {children}
      </button>
    ),
  };
});

jest.mock(
  "@/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown",
  () => ({
    AccountNavDropdown: ({ initialOpen = false }: { initialOpen?: boolean }) => (
      <div
        data-initial-open={String(initialOpen)}
        data-testid="account-nav-dropdown"
      >
        Account menu island
      </div>
    ),
  })
);

const readSource = (sourcePath: string) =>
  fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8");

describe("public account navigation lazy island", () => {
  it("renders the stable account trigger before account-menu intent", () => {
    render(<AccountNav />);

    expect(
      screen.getByRole("button", { name: "Open account menu" })
    ).toBeInTheDocument();
    expect(screen.queryByTestId("account-nav-dropdown")).not.toBeInTheDocument();
    expect(screen.getByText("ENG")).toBeInTheDocument();
  });

  it("loads the account dropdown after click intent and asks it to mount open", async () => {
    render(<AccountNav />);

    fireEvent.click(screen.getByRole("button", { name: "Open account menu" }));

    const dropdown = await screen.findByTestId("account-nav-dropdown");
    expect(dropdown).toHaveAttribute("data-initial-open", "true");
  });

  it("preloads the account dropdown on keyboard focus without forcing it open", async () => {
    render(<AccountNav />);

    fireEvent.focus(screen.getByRole("button", { name: "Open account menu" }));

    const dropdown = await screen.findByTestId("account-nav-dropdown");
    expect(dropdown).toHaveAttribute("data-initial-open", "false");
  });

  it("keeps the dropdown implementation out of the persistent desktop and tablet header path", () => {
    const accountNavSource = readSource(
      "src/components/modules/navigation/accountNav/AccountNav.tsx"
    );
    const dropdownSource = readSource(
      "src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx"
    );
    const desktopNavSource = readSource(
      "src/components/modules/navigation/mainNav/DesktopNavLayout.tsx"
    );
    const tabletNavSource = readSource(
      "src/components/modules/navigation/mainNav/TabletNavLayout.tsx"
    );

    expect(accountNavSource).toContain("lazy(");
    expect(accountNavSource).toContain(
      'import("./accountNavDropdown/AccountNavDropdown")'
    );
    expect(accountNavSource).not.toContain('from "next-auth/react"');
    expect(accountNavSource).not.toContain("useGlobalFeatures");
    expect(accountNavSource).not.toContain(
      'from "./accountNavDropdown/AccountNavDropdown"'
    );

    expect(dropdownSource).toContain('from "next-auth/react"');
    expect(dropdownSource).toContain("useSession");
    expect(dropdownSource).toContain("signOut");
    expect(dropdownSource).toContain("useGlobalFeatures");

    expect(desktopNavSource).toContain("AccountNav");
    expect(tabletNavSource).toContain("AccountNav");
    expect(desktopNavSource).not.toContain("AccountNavDropdown");
    expect(tabletNavSource).not.toContain("AccountNavDropdown");
  });

  it("keeps session and modal providers rooted while splitting only the account menu island", () => {
    const boundarySource = readSource("src/contexts/ClientContextBoundary.tsx");

    expect(boundarySource).toContain("SessionProvider");
    expect(boundarySource).toContain("GlobalFeaturesProvider");
    expect(boundarySource).toContain("<GlobalFeaturesProvider>");
  });

  it("keeps account-menu internal routes on App Router Link semantics", () => {
    const dropdownSource = readSource(
      "src/components/modules/navigation/accountNav/accountNavDropdown/AccountNavDropdown.tsx"
    );

    expect(dropdownSource).toContain('import Link from "next/link"');
    expect(dropdownSource).toContain("<Link");
    expect(dropdownSource).not.toContain("<a");
    expect(dropdownSource).not.toContain('href="#"');
  });
});
