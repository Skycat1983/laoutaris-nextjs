"use client";

import SubmitButton from "@/components/atoms/buttons/SubmitButton";
import { useGlobalFeatures } from "@/lib/client/contexts/GlobalFeaturesContext";
import { useFormState } from "react-dom";
import SignUpForm from "./SignUpForm";
import ModalMessage from "@/components/atoms/ModalMessage";
import {
  LoginProcessResponse,
  processLogin,
} from "@/lib/server/user/actions/processLogin";

const initialState: LoginProcessResponse = {
  type: "validation",
  formValidationErrors: { email: "", password: "" },
};

const SignInForm = () => {
  const { setModalContent } = useGlobalFeatures();
  const [state, formAction] = useFormState(processLogin, initialState);

  if (state?.type === "success") {
    setModalContent(<ModalMessage message="Login successful." />);
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
          {state?.type === "validation" && (
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
          {state?.type === "validation" && (
            <p aria-live="polite" className="bg-red-100">
              {state.formValidationErrors.password}
            </p>
          )}
          {state?.type === "auth" && (
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
