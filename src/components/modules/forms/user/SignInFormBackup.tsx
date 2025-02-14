"use client";

import SubmitButton from "@/components/modules/common/buttons/SubmitButton";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { useFormState } from "react-dom";
import SignUpForm from "./SignUpForm";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import {
  LoginProcessResponse,
  processLogin,
} from "@/lib/old_code/user/actions/processLogin";
import { signIn, useSession } from "next-auth/react";

const initialState: LoginProcessResponse = {
  type: "validation",
  formValidationErrors: { email: "", password: "" },
};

const SignInForm = () => {
  // const router = useRouter();
  const { data: session } = useSession();

  const { setModalContent } = useGlobalFeatures();
  const [state, formAction] = useFormState(processLogin, initialState);

  if (session) {
    setModalContent(<ModalMessage message="Login successful." />);
  }

  // useEffect(() => {
  //   router.push("/login");

  //   return () => {
  //     //
  //   };
  // }, []);

  // if (state?.type === "success") {
  //   setModalContent(<ModalMessage message="Login successful." />);
  // }

  return (
    <>
      <div className="bg-white w-1/2 p-12 mx-auto">
        <h1 className="text-2xl py-4">Sign In</h1>
        <form action={() => signIn()} className="flex flex-col gap-3">
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
          <SubmitButton label={"Sign in"} />
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
