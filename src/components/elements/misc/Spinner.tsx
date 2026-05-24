import React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
  label?: string;
}

export function Spinner({
  size,
  show,
  children,
  className,
  label,
}: SpinnerContentProps) {
  const isVisible = show !== false;
  const accessibleLabel =
    label ?? (typeof children === "string" ? children : "Loading");

  return (
    <span
      role={isVisible ? "status" : undefined}
      aria-live={isVisible ? "polite" : undefined}
      aria-label={isVisible ? accessibleLabel : undefined}
      aria-hidden={isVisible ? undefined : true}
      className={spinnerVariants({ show })}
    >
      <Loader2
        aria-hidden="true"
        className={cn(loaderVariants({ size }), className)}
      />
      {children ?? <span className="sr-only">{accessibleLabel}</span>}
    </span>
  );
}
