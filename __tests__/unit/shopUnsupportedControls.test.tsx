import { render, screen } from "@testing-library/react";
import ShopFilters from "@/components/modules/filters/ShopFilters";
import ShopResultsBar from "@/components/modules/filters/ShopResultsBar";
import type { ReactNode } from "react";
import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";
import type { ShopFiltersState } from "@/lib/data/types/shopTypes";

jest.mock("@/components/shadcn/select", () => ({
  Select: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => (
    <div role="option" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock("@/components/shadcn/checkbox", () => ({
  Checkbox: ({
    id,
    checked,
    onCheckedChange,
  }: {
    id?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }) => (
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
    />
  ),
}));

const defaultShopFilters: ShopFiltersState = {
  artstyle: "all-style",
  medium: "all-medium",
  surface: "all-surface",
  decade: "all-epochs",
  showOriginals: true,
  showPrints: true,
  showBooks: true,
  sortBy: "type",
};

describe("shop unsupported controls", () => {
  it("does not render unsupported colour or dimension filters", () => {
    render(
      <ShopFilters filters={defaultShopFilters} onFilterChange={jest.fn()} />
    );

    expect(screen.queryByText("Colours")).not.toBeInTheDocument();
    expect(screen.queryByText("All Colours")).not.toBeInTheDocument();
    expect(screen.queryByText("Dimensions")).not.toBeInTheDocument();
    expect(screen.queryByText("All Sizes")).not.toBeInTheDocument();
  });

  it("keeps backed shop filters and product-type controls available", () => {
    const { container } = render(
      <ShopFilters filters={defaultShopFilters} onFilterChange={jest.fn()} />
    );

    expect(screen.getByText("All Styles")).toBeInTheDocument();
    expect(screen.getByText("All Mediums")).toBeInTheDocument();
    expect(screen.getByText("All Surfaces")).toBeInTheDocument();
    expect(screen.getByText("All Decades")).toBeInTheDocument();
    expect(screen.getByLabelText("Original artworks")).toBeChecked();
    expect(screen.getByLabelText("Limited edition")).toBeChecked();
    expect(screen.getByLabelText("Books")).toBeChecked();
    [
      ...ARTSTYLE_OPTIONS,
      ...MEDIUM_OPTIONS,
      ...SURFACE_OPTIONS,
      ...DECADE_OPTIONS,
    ].forEach((value) => {
      expect(container.querySelector(`[data-value="${value}"]`)).not.toBeNull();
    });
  });

  it("keeps result count and sorting while removing fake pagination", () => {
    render(
      <ShopResultsBar
        totalResults={42}
        sortBy="type"
        onSortChange={jest.fn()}
      />
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Sort by Type")).toBeInTheDocument();
    expect(screen.getByText("Price: Low to High")).toBeInTheDocument();
    expect(screen.getByText("Title: Z to A")).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "2" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "5" })).not.toBeInTheDocument();
    expect(screen.queryByText("...")).not.toBeInTheDocument();
  });
});
