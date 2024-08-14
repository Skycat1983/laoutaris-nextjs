"use client";

import { createUser } from "@/app/actions";
import SubmitButton from "@/components/atoms/buttons/SubmitButton";
import { useGlobalFeatures } from "@/lib/contexts/GlobalFeaturesContext";
import { useFormState } from "react-dom";
import SignUpForm from "./SignUpForm";

const initialState = {
  formValidationErrors: { email: "", password: "" },
  authError: null,
  user: null,
};

const SignInForm = () => {
  const { setModalContent } = useGlobalFeatures();
  const [state, formAction] = useFormState(createUser, initialState);

  console.log("state :>> ", state);

  if (state.authError) {
    const stringifiedError = JSON.stringify(state.authError);
    console.warn(stringifiedError);
  }

  return (
    <>
      <div className="bg-white w-1/2 p-12 mx-auto">
        <h1 className="text-2xl py-4">Sign In</h1>
        <form action={formAction} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="email"
            className="w-full p-3 border border-gray-300 rounded-md"
            autoComplete="off"
            name="email"
            id="email"
          />
          {state?.formValidationErrors && (
            <p aria-live="polite" className="bg-red-100">
              {state.formValidationErrors.email}
            </p>
          )}
          <input
            type="password"
            placeholder="password"
            className="w-full p-3 border border-gray-300 rounded-md"
            autoComplete="new-password"
            name="password"
            id="password"
          />
          {state?.formValidationErrors && (
            <p aria-live="polite" className="bg-red-100">
              {state.formValidationErrors.password}
            </p>
          )}
          {state?.authError && (
            <p aria-live="polite" className="bg-red-100">
              {JSON.stringify(state.authError)}
            </p>
          )}
          <SubmitButton label={"Sign up"} />
        </form>
        <h2 className="text-lg py-4 text-[#000000BF]">
          Not registered?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              setModalContent(<SignUpForm />);
            }}
          >
            Sign up
          </span>{" "}
          today!
        </h2>
      </div>
    </>
  );
};

export default SignInForm;
