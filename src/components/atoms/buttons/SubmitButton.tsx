import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
  className?: string;
}

function SubmitButton({
  label,
  className = "subheading-button-active",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={className}>
      <span>{label}</span>
    </button>
  );
}

export default SubmitButton;
