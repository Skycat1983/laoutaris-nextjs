"use client";

import SubmitButton from "@/components/atoms/buttons/SubmitButton";
import { useGlobalFeatures } from "@/lib/contexts/GlobalFeaturesContext";
import { useFormState } from "react-dom";
import SignUpForm from "./SignUpForm";
import { logout, signIn, signUp } from "@/app/actions";

const initialState = {
  formValidationErrors: { logout: "" },
  authError: null,
  user: null,
};

const LogoutForm = () => {
  const { setModalContent } = useGlobalFeatures();
  const [state, formAction] = useFormState(logout, initialState);

  console.log("state :>> ", state);

  if (state.authError) {
    const stringifiedError = JSON.stringify(state.authError);
    console.warn(stringifiedError);
  }

  return (
    <>
      <div className="bg-white w-1/2 p-12 mx-auto">
        <form
          action={async (formData) => {
            "use server";
            await logout(formData);
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="email"
            className="w-full p-3 border border-gray-300 rounded-md"
            autoComplete="off"
            name="email"
            id="email"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md p-3"
          >
            Logout
          </button>
        </form>
      </div>
    </>
  );
};

export default LogoutForm;
