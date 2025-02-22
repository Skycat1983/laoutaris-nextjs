import { Button } from "@/components/shadcn/button";
import { Loader2 } from "lucide-react";
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
}

function SubmitButton({ label, variant }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      shape={"rounded"}
      variant={variant}
      size={"full"}
      disabled={pending}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Loading..." : label}
    </Button>
  );
}

export { SubmitButton };
