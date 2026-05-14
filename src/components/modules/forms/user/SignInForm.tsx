"use client";

import { Button } from "@/components/shadcn/button";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import SignUpForm from "./SignUpForm";
import ModalMessage from "@/components/elements/typography/ModalMessage";
import { signIn, useSession } from "next-auth/react";
import { type FormEvent, useEffect, useState } from "react";
import {
  CredentialsSignInFormData,
  validateCredentialsSignInData,
} from "@/lib/validation/validateLoginData";
import { Loader2 } from "lucide-react";

// TODO: redo this form with shadcn/ui

type SignInFormErrors = Partial<
  Record<keyof CredentialsSignInFormData, string>
> & {
  form?: string;
};

const authErrorMessage = "Invalid username or password.";

const SignInForm = () => {
  const { data: session, update } = useSession();
  const { setModalContent } = useGlobalFeatures();
  const [errors, setErrors] = useState<SignInFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      setModalContent(<ModalMessage message="Login successful." />);
    }
  }, [session, setModalContent]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const validationResult = validateCredentialsSignInData({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!validationResult.success) {
      setErrors(validationResult.formValidationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        username: validationResult.data.username,
        password: validationResult.data.password,
        redirect: false,
      });

      if (!result || result.error || result.ok === false) {
        setErrors({ form: authErrorMessage });
        return;
      }

      await update();
      setModalContent(<ModalMessage message="Login successful." />);
    } catch {
      setErrors({ form: "Sign in failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white w-1/2 p-12 mx-auto">
        <h1 className="text-2xl py-4">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              placeholder="username"
              className="w-full p-3 border border-gray-300 rounded-md"
              autoComplete="username"
              name="username"
              id="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" aria-live="polite" className="bg-red-100">
                {errors.username}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              className="w-full p-3 border border-gray-300 rounded-md"
              autoComplete="current-password"
              name="password"
              id="password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" aria-live="polite" className="bg-red-100">
                {errors.password}
              </p>
            )}
          </div>

          {errors.form && (
            <p role="alert" aria-live="polite" className="bg-red-100">
              {errors.form}
            </p>
          )}

          <Button shape="rounded" disabled={isSubmitting} type="submit">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Loading..." : "Sign in"}
          </Button>
        </form>
        <h2 className="text-lg py-4 text-[#000000BF]">
          Not registered?{" "}
          <button
            type="button"
            className="text-blue-600 cursor-pointer"
            onClick={() => {
              setModalContent(<SignUpForm />);
            }}
          >
            Sign up
          </button>{" "}
          today!
        </h2>
      </div>
    </>
  );
};

export default SignInForm;
