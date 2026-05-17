"use client";

import { Loader2, Plus, SearchCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { clientPublicApi } from "@/lib/api/public/clientPublicApi";
import {
  SHOPIFY_PRODUCT_TYPE_OPTIONS,
  type ArtworkFormValues,
} from "@/lib/data/schemas/artworkSchema";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopifyProductLink } from "@/lib/data/types/shopifyTypes";
import { cn } from "@/lib/utils";

const SHOPIFY_PRODUCT_TYPE_LABELS: Record<ShopifyProductLink["type"], string> =
  {
    original: "Original",
    print: "Print",
    book: "Book",
  };

const EMPTY_SHOPIFY_PRODUCT_LINK = {
  productId: "",
  type: "original",
} satisfies ShopifyProductLink;

const SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN = /^\d+$/;

type VerificationStatus =
  | "unchecked"
  | "checking"
  | "verified"
  | "not-found"
  | "invalid"
  | "upstream-error";

type VerificationState = {
  status: VerificationStatus;
  inputKey: string;
  message?: string;
  product?: SimpleProduct;
};

type VerificationInput =
  | {
      success: true;
      inputKey: string;
      productId: string;
      type: ShopifyProductLink["type"];
    }
  | {
      success: false;
      inputKey: string;
      message: string;
    };

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  unchecked: "Unchecked",
  checking: "Checking",
  verified: "Verified",
  "not-found": "Not found",
  invalid: "Invalid local input",
  "upstream-error": "Upstream error",
};

const isShopifyProductType = (
  value: unknown
): value is ShopifyProductLink["type"] =>
  typeof value === "string" &&
  (SHOPIFY_PRODUCT_TYPE_OPTIONS as readonly string[]).includes(value);

const getInputKey = (link: Partial<ShopifyProductLink> | undefined) => {
  const productId =
    typeof link?.productId === "string" ? link.productId.trim() : "";
  const type = typeof link?.type === "string" ? link.type : "";

  return `${productId}:${type}`;
};

const getVerificationInput = (
  link: Partial<ShopifyProductLink> | undefined
): VerificationInput => {
  const productId =
    typeof link?.productId === "string" ? link.productId.trim() : "";
  const inputKey = getInputKey(link);

  if (!productId) {
    return {
      success: false,
      inputKey,
      message: "Shopify product ID is required",
    };
  }

  if (!SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN.test(productId)) {
    return {
      success: false,
      inputKey,
      message: "Shopify product ID must be numeric",
    };
  }

  if (!isShopifyProductType(link?.type)) {
    return {
      success: false,
      inputKey,
      message: "Shopify product type is required",
    };
  }

  return {
    success: true,
    inputKey,
    productId,
    type: link.type,
  };
};

const getVerificationTone = (status: VerificationStatus) => {
  if (status === "verified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }

  if (status === "checking") {
    return "border-sky-200 bg-sky-50 text-sky-900";
  }

  if (
    status === "not-found" ||
    status === "invalid" ||
    status === "upstream-error"
  ) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }

  return "border-muted bg-muted/30 text-muted-foreground";
};

const getFailedVerificationState = (
  inputKey: string,
  error: string
): VerificationState => {
  if (error === "Product not found") {
    return {
      status: "not-found",
      inputKey,
      message: "Product not found in Shopify",
    };
  }

  if (error === "Product ID must be a numeric Shopify product ID") {
    return {
      status: "invalid",
      inputKey,
      message: "Shopify product ID must be numeric",
    };
  }

  return {
    status: "upstream-error",
    inputKey,
    message: "Shopify verification is unavailable",
  };
};

const formatProductAvailability = (product: SimpleProduct) =>
  product.availableForSale ? "Available" : "Unavailable";

const formatProductPrice = (product: SimpleProduct) =>
  product.price && product.currencyCode
    ? `${product.currencyCode} ${product.price}`
    : "Price unavailable";

interface ShopifyProductLinksInputProps {
  control: Control<ArtworkFormValues>;
  register: UseFormRegister<ArtworkFormValues>;
  errors?: FieldErrors<ArtworkFormValues>["shopifyProducts"];
  disabled?: boolean;
}

const getErrorMessage = (error: unknown): string | undefined => {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const maybeMessage = (error as { message?: unknown }).message;
  return typeof maybeMessage === "string" ? maybeMessage : undefined;
};

export function ShopifyProductLinksInput({
  control,
  register,
  errors,
  disabled = false,
}: ShopifyProductLinksInputProps) {
  const [verificationByFieldId, setVerificationByFieldId] = useState<
    Record<string, VerificationState>
  >({});
  const { fields, append, remove } = useFieldArray({
    control,
    name: "shopifyProducts",
  });
  const watchedLinks = useWatch({
    control,
    name: "shopifyProducts",
  });

  const arrayErrorMessage = getErrorMessage(errors);

  useEffect(() => {
    const currentFieldIds = new Set(fields.map((field) => field.id));

    setVerificationByFieldId((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([fieldId]) =>
          currentFieldIds.has(fieldId)
        )
      );
      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(next);

      return currentKeys.length === nextKeys.length ? current : next;
    });
  }, [fields]);

  const getEffectiveVerification = (
    fieldId: string,
    link: Partial<ShopifyProductLink> | undefined
  ): VerificationState => {
    const inputKey = getInputKey(link);
    const verification = verificationByFieldId[fieldId];

    if (!verification || verification.inputKey !== inputKey) {
      return {
        status: "unchecked",
        inputKey,
      };
    }

    return verification;
  };

  const verifyLink = async (
    fieldId: string,
    link: Partial<ShopifyProductLink> | undefined
  ) => {
    const verificationInput = getVerificationInput(link);

    if (!verificationInput.success) {
      setVerificationByFieldId((current) => ({
        ...current,
        [fieldId]: {
          status: "invalid",
          inputKey: verificationInput.inputKey,
          message: verificationInput.message,
        },
      }));
      return;
    }

    setVerificationByFieldId((current) => ({
      ...current,
      [fieldId]: {
        status: "checking",
        inputKey: verificationInput.inputKey,
      },
    }));

    const result = await clientPublicApi.shop.productById(
      verificationInput.productId
    );

    setVerificationByFieldId((current) => ({
      ...current,
      [fieldId]: result.success
        ? {
            status: "verified",
            inputKey: verificationInput.inputKey,
            message: "Shopify product found",
            product: result.data,
          }
        : getFailedVerificationState(verificationInput.inputKey, result.error),
    }));
  };

  return (
    <section className="space-y-3" aria-labelledby="shopify-products-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 id="shopify-products-heading" className="text-sm font-medium">
            Shopify product links
          </h3>
          {arrayErrorMessage ? (
            <p className="text-sm font-medium text-destructive">
              {arrayErrorMessage}
            </p>
          ) : null}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Add Shopify product link"
                disabled={disabled}
                onClick={() => append({ ...EMPTY_SHOPIFY_PRODUCT_LINK })}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add link</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
          No Shopify product links
        </p>
      ) : null}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const position = index + 1;
          const currentLink = watchedLinks?.[index] ?? field;
          const verification = getEffectiveVerification(field.id, currentLink);
          const isChecking = verification.status === "checking";
          const productIdError = getErrorMessage(errors?.[index]?.productId);
          const typeError = getErrorMessage(errors?.[index]?.type);

          return (
            <div
              key={field.id}
              className="grid gap-3 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto]"
            >
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor={`shopify-product-id-${field.id}`}
                >
                  Product ID
                </label>
                <Input
                  id={`shopify-product-id-${field.id}`}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Numeric product ID"
                  aria-label={`Shopify product ID ${position}`}
                  aria-invalid={!!productIdError}
                  disabled={disabled}
                  {...register(`shopifyProducts.${index}.productId`)}
                />
                {productIdError ? (
                  <p className="text-sm font-medium text-destructive">
                    {productIdError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor={`shopify-product-type-${field.id}`}
                >
                  Type
                </label>
                <select
                  id={`shopify-product-type-${field.id}`}
                  aria-label={`Shopify product type ${position}`}
                  aria-invalid={!!typeError}
                  disabled={disabled}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  {...register(`shopifyProducts.${index}.type`)}
                >
                  {SHOPIFY_PRODUCT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {SHOPIFY_PRODUCT_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
                {typeError ? (
                  <p className="text-sm font-medium text-destructive">
                    {typeError}
                  </p>
                ) : null}
              </div>

              <div className="flex items-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        aria-label={`Verify Shopify product link ${position}`}
                        disabled={disabled || isChecking}
                        onClick={() => {
                          void verifyLink(field.id, currentLink);
                        }}
                      >
                        {isChecking ? (
                          <Loader2
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <SearchCheck
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                        {isChecking ? "Checking" : "Verify"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Verify product</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Remove Shopify product link ${position}`}
                        disabled={disabled}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove link</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div
                className={cn(
                  "rounded-md border px-3 py-2 text-sm sm:col-span-3",
                  getVerificationTone(verification.status)
                )}
                aria-live="polite"
              >
                <p className="font-medium">
                  {VERIFICATION_LABELS[verification.status]}
                  {verification.message ? `: ${verification.message}` : null}
                </p>

                {verification.status === "verified" && verification.product ? (
                  <dl className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="font-medium">Title</dt>
                      <dd>{verification.product.title}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Handle</dt>
                      <dd>{verification.product.handle}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Availability</dt>
                      <dd>{formatProductAvailability(verification.product)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Product type</dt>
                      <dd>{verification.product.productType || "Not set"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Price</dt>
                      <dd>{formatProductPrice(verification.product)}</dd>
                    </div>
                  </dl>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
