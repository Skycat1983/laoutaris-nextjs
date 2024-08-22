import { Button } from "@/components/ui/shadcn/button";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
}

function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      shape={"rounded"}
      // variant={"outline"}
      size={"full"}
      disabled={pending}
    >
      {pending ? "Loading..." : label}
    </Button>
  );
}

export default SubmitButton;
