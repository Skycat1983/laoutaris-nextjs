"use client";

import { useFormState } from "react-dom";
import {
  unsubscribeNewsletter,
  type UnsubscribeFormState,
} from "@/lib/actions/submitSubscription";
import { SubmitButton } from "@/components/elements/buttons/SubmitButton";

type UnsubscribeFormProps = {
  token: string;
};

const UnsubscribeForm = ({ token }: UnsubscribeFormProps) => {
  const initialState: UnsubscribeFormState = {
    success: false,
    message: "",
  };
  const [state, formAction] = useFormState(unsubscribeNewsletter, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <SubmitButton label="Unsubscribe" size="sm" />
      {state.message && (
        <p className={state.success ? "text-green-700" : "text-red-700"}>
          {state.message}
        </p>
      )}
    </form>
  );
};

export default UnsubscribeForm;
