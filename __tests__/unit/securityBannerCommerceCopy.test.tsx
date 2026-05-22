import { render, screen } from "@testing-library/react";
import { readFileSync } from "fs";
import path from "path";
import {
  SecurityBannerBlack,
  SecurityBannerGrey,
  SecurityBannerWhite,
} from "@/components/modules/banners/SecurityBanners";

const readRepoFile = (relativePath: string) =>
  readFileSync(path.join(process.cwd(), relativePath), "utf8");

const retiredCommerceAssurancePatterns = [
  /Secure Payment/i,
  /Secure Payments/i,
  /Safe Payments/i,
  /Buyer Protection/i,
  /money-back/i,
  /100% guaranteed/i,
  /100% money-back/i,
  /Insured Shipping/i,
  /Insured shipping/i,
  /Global Shipping/i,
  /Worldwide delivery/i,
  /Safe Delivery/i,
  /Multiple methods/i,
  /Encrypted transactions/i,
  /Protected transactions/i,
  /By invoice or credit card/i,
  /secure_platform/i,
  /safe_payments/i,
  /safe_delivery/i,
];

const sourceFiles = [
  "src/components/modules/banners/SecurityBanners.tsx",
  "src/lib/constants/translations.json",
  "src/lib/translations/categories/security.json",
];

describe("security banner commerce copy", () => {
  it("keeps retired commerce assurance claims out of banner and security translation sources", () => {
    for (const sourcePath of sourceFiles) {
      const source = readRepoFile(sourcePath);

      for (const pattern of retiredCommerceAssurancePatterns) {
        expect(source).not.toMatch(pattern);
      }
    }
  });

  it("renders factual archive, contact, and hosted Shopify link copy", () => {
    render(
      <>
        <SecurityBannerWhite />
        <SecurityBannerBlack />
        <SecurityBannerGrey />
      </>
    );

    expect(screen.getByText("Archive Records")).toBeInTheDocument();
    expect(screen.getAllByText("Studio Contact")).toHaveLength(2);
    expect(screen.getAllByText("Shopify Links")).toHaveLength(3);
    expect(screen.getAllByText("Hosted pages when available")).toHaveLength(3);
    expect(screen.getByText("Catalogue Access")).toBeInTheDocument();

    for (const pattern of retiredCommerceAssurancePatterns) {
      expect(screen.queryByText(pattern)).not.toBeInTheDocument();
    }
  });
});
