import type { Metadata } from "next";
import { Suspense } from "react";
import AuthProviderSignInButtons from "@/components/modules/forms/user/AuthProviderSignInButtons";
import SignInForm from "@/components/modules/forms/user/SignInForm";
import SignUpForm from "@/components/modules/forms/user/SignUpForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to the Joseph Laoutaris Art Archive or create an account with the approved privacy and terms acknowledgement.",
  alternates: {
    canonical: "/sign-in",
  },
};

interface SignInPageProps {
  searchParams?: {
    mode?: string;
  };
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  const showSignUp = searchParams?.mode === "signup";

  return (
    <main className="flex flex-col gap-6 py-8">
      {showSignUp ? <SignUpForm /> : <SignInForm />}
      <Suspense fallback={null}>
        <AuthProviderSignInButtons />
      </Suspense>
    </main>
  );
}
