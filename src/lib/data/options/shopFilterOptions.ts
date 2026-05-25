import {
  ARTSTYLE_OPTIONS,
  DECADE_OPTIONS,
  MEDIUM_OPTIONS,
  SURFACE_OPTIONS,
} from "@/lib/constants/artworkConstants";

export type ShopFilterOption = {
  value: string;
  label: string;
};

const labelFromValue = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");

const optionsFromValues = (values: readonly string[]) =>
  values.map((value) => ({
    value,
    label: labelFromValue(value),
  }));

export const SHOP_ARTSTYLE_FILTER_OPTIONS: readonly ShopFilterOption[] = [
  { value: "all-style", label: "All Styles" },
  ...optionsFromValues(ARTSTYLE_OPTIONS),
];

export const SHOP_MEDIUM_FILTER_OPTIONS: readonly ShopFilterOption[] = [
  { value: "all-medium", label: "All Mediums" },
  ...optionsFromValues(MEDIUM_OPTIONS),
];

export const SHOP_SURFACE_FILTER_OPTIONS: readonly ShopFilterOption[] = [
  { value: "all-surface", label: "All Surfaces" },
  ...optionsFromValues(SURFACE_OPTIONS),
];

export const SHOP_DECADE_FILTER_OPTIONS: readonly ShopFilterOption[] = [
  { value: "all-epochs", label: "All Decades" },
  ...optionsFromValues(DECADE_OPTIONS),
];
