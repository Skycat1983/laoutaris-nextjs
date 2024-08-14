import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string;
}

function SubmitButton({ label }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="subheading-button-active">
      <span>{label}</span>
    </button>
  );
}

export default SubmitButton;
