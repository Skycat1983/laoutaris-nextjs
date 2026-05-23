import fs from "fs";
import path from "path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProjectPage from "@/app/project/page";
import LogoutForm from "@/components/modules/forms/user/LogoutForm";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

jest.mock("@/contexts/GlobalFeaturesContext", () => ({
  useGlobalFeatures: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(),
}));

const mockUseGlobalFeatures = useGlobalFeatures as jest.Mock;
const mockSignOut = signOut as jest.Mock;
const mockRedirect = redirect as unknown as jest.MockedFunction<
  typeof redirect
>;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();
const mockOpenModal = jest.fn();

const readSource = (sourcePath: string) =>
  fs.readFileSync(path.join(process.cwd(), sourcePath), "utf8");

describe("relative navigation URLs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseGlobalFeatures.mockReturnValue({ openModal: mockOpenModal });
    mockSignOut.mockResolvedValue(undefined);
  });

  it("redirects /project to the relative about route", () => {
    ProjectPage();

    expect(mockRedirect).toHaveBeenCalledWith("/project/about");
  });

  it("pushes the relative home path after logout succeeds", async () => {
    render(<LogoutForm />);

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() =>
      expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
    );
    expect(mockOpenModal).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function)
    );

    const redirectToHome = mockOpenModal.mock.calls[0][1] as () => void;
    redirectToHome();

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("keeps touched navigation and redirect files free of hard-coded same-app origins", () => {
    const touchedSources = [
      "src/components/modules/forms/user/LogoutForm.tsx",
      "src/components/modules/navigation/mobileNavDrawer/MobileNavDrawer.tsx",
      "src/components/modules/navigation/mobileNavDrawer/MobileNavDrawerBody.tsx",
      "src/app/project/page.tsx",
    ].map(readSource);

    for (const source of touchedSources) {
      expect(source).not.toContain("http://localhost:3000");
      expect(source).not.toContain("NEXT_PUBLIC_BASE_URL");
      expect(source).not.toContain("process.env.VERCEL_URL");
    }

    expect(touchedSources[2]).toContain('path: "/sign-in"');
  });
});
