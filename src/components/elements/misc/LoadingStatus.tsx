import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const iconSizeClasses = {
  small: "size-4",
  medium: "size-8",
  large: "size-12",
} as const;

const textSizeClasses = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
} as const;

type LoadingStatusSize = keyof typeof iconSizeClasses;

interface LoadingStatusProps {
  label?: string;
  visibleLabel?: React.ReactNode;
  size?: LoadingStatusSize;
  className?: string;
  iconClassName?: string;
}

export function LoadingStatus({
  label,
  visibleLabel,
  size = "medium",
  className,
  iconClassName,
}: LoadingStatusProps) {
  const accessibleLabel =
    label ?? (typeof visibleLabel === "string" ? visibleLabel : "Loading");

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={accessibleLabel}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        textSizeClasses[size],
        className
      )}
    >
      <Loader2
        aria-hidden="true"
        className={cn(
          "shrink-0 animate-spin text-primary",
          iconSizeClasses[size],
          iconClassName
        )}
      />
      {visibleLabel ? (
        <span>{visibleLabel}</span>
      ) : (
        <span className="sr-only">{accessibleLabel}</span>
      )}
    </span>
  );
}
