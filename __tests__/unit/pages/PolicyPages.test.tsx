import { readFileSync } from "fs";
import path from "path";
import { render, screen, within } from "@testing-library/react";
import Footer from "@/components/modules/footer/Footer";
import PrivacyPage, { metadata as privacyMetadata } from "@/app/privacy/page";
import TermsPage, { metadata as termsMetadata } from "@/app/terms/page";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("policy pages and footer links", () => {
  it("renders the privacy page with owner contact and approved data surfaces", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Privacy" })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Heron Laoutaris/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/hlaoutaris@gmail\.com/).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/2026-05-22 \/ owner approval v1/)
    ).toBeInTheDocument();

    const cookiesSection = screen
      .getByRole("heading", { name: "Cookies And Third Parties" })
      .closest("section");

    expect(cookiesSection).not.toBeNull();
    expect(
      within(cookiesSection as HTMLElement).getByText(/NextAuth session/)
    ).toBeInTheDocument();
    expect(
      within(cookiesSection as HTMLElement).getByText(/OAuth providers/)
    ).toBeInTheDocument();
    expect(
      within(cookiesSection as HTMLElement).getByText(/Cloudinary/)
    ).toBeInTheDocument();
    expect(
      within(cookiesSection as HTMLElement).getByText(/Shopify product data/)
    ).toBeInTheDocument();
    expect(
      within(cookiesSection as HTMLElement).getByText(/YouTube embeds/)
    ).toBeInTheDocument();

    expect(screen.getByText(/account registration/i)).toBeInTheDocument();
    expect(screen.getByText(/newsletter subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/contact and artwork enquiry/i)).toBeInTheDocument();
    expect(screen.getByText(/saved artwork lists/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin tools/i)).toBeInTheDocument();
  });

  it("renders the terms page with archive, account, ownership, and Shopify boundaries", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: "Terms" })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Heron Laoutaris/).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/hlaoutaris@gmail\.com/).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/2026-05-22 \/ owner approval v1/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Archive Use" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Accounts, Saved Artworks, And Comments",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Artwork And Gallery Content" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Shopify-Hosted Purchase Boundary" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Purchases continue on Shopify-hosted pages/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not operate an owned cart/)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy"
    );
  });

  it("keeps footer contact/legal links without placeholder socials or stale copyright", () => {
    const { container } = render(<Footer />);

    const legalNav = screen.getByRole("navigation", { name: "Legal" });

    expect(screen.getByText("Email: hlaoutaris@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: 0049 1577 045 6469")).toBeInTheDocument();
    expect(
      within(legalNav).getByRole("link", { name: "Privacy" })
    ).toHaveAttribute("href", "/privacy");
    expect(
      within(legalNav).getByRole("link", { name: "Terms" })
    ).toHaveAttribute("href", "/terms");
    expect(screen.queryByRole("link", { name: "Facebook" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Twitter" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Instagram" })).toBeNull();
    expect(container.querySelector('a[href="#"]')).toBeNull();
    expect(
      screen.getByText(
        `© ${new Date().getFullYear()} Joseph Laoutaris. All rights reserved.`
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText("© 2024 Joseph Laoutaris. All rights reserved.")
    ).toBeNull();
  });

  it("keeps policy source jurisdiction-neutral and free of unsupported commerce assurances", () => {
    const policySource = [
      "src/app/privacy/page.tsx",
      "src/app/terms/page.tsx",
    ]
      .map(readRepoFile)
      .join("\n");

    expect(policySource).not.toMatch(/\b(GDPR|CCPA)\b/);
    expect(policySource).not.toMatch(/money-back|guarantee|buyer protection/i);
    expect(policySource).not.toMatch(/insured shipping|worldwide shipping/i);
    expect(policySource).not.toMatch(/shopify\.com\/polic/i);
  });

  it("keeps footer source free of placeholder social links and fixed 2024 copyright", () => {
    const footerSource = readRepoFile("src/components/modules/footer/Footer.tsx");

    expect(footerSource).not.toMatch(/href=["']#["']/);
    expect(footerSource).not.toMatch(/\b(Facebook|Twitter|Instagram)\b/);
    expect(footerSource).not.toContain(
      "© 2024 Joseph Laoutaris. All rights reserved."
    );
    expect(footerSource).toMatch(/new Date\(\)\.getFullYear\(\)/);
  });

  it("declares route metadata for privacy and terms", () => {
    expect(privacyMetadata).toEqual(
      expect.objectContaining({
        title: "Privacy",
        alternates: { canonical: "/privacy" },
      })
    );
    expect(termsMetadata).toEqual(
      expect.objectContaining({
        title: "Terms",
        alternates: { canonical: "/terms" },
      })
    );
  });
});
