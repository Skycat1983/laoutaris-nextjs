"use client";

import { Button } from "@/components/shadcn/button";
import { LoadingStatus } from "@/components/elements/misc/LoadingStatus";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  variant?:
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
  size?: "full" | "default" | "icon" | "sm" | "lg" | "icon" | "default";
  pendingLabel?: string;
}

function SubmitButton({
  label,
  variant,
  className,
  size,
  pendingLabel = "Submitting...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      shape={"rounded"}
      variant={variant}
      size={size}
      disabled={pending}
      className={className}
    >
      {pending ? (
        <LoadingStatus
          label={pendingLabel}
          visibleLabel={pendingLabel}
          size="small"
        />
      ) : (
        label
      )}
    </Button>
  );
}

export { SubmitButton };
