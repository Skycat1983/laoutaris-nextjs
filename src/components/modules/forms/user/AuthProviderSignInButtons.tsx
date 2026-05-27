"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/shadcn/button";
import { accountSettingsPath } from "@/lib/routes/accountRoutes";
import { publicAppRoutes } from "@/lib/routes/publicAppRoutes";

const defaultCallbackUrl = accountSettingsPath;

const normalizeCallbackUrl = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return defaultCallbackUrl;
  }

  return value;
};

const AuthProviderSignInButtons = () => {
  const searchParams = useSearchParams();
  const callbackUrl = normalizeCallbackUrl(searchParams.get("callbackUrl"));

  const handleProviderSignIn = (provider: "github" | "google") => {
    void signIn(provider, { callbackUrl });
  };

  return (
    <section className="mx-auto w-1/2 bg-white p-12">
      <h2 className="py-2 text-xl">Provider sign in</h2>
      <p className="pb-4 text-sm leading-6 text-[#000000BF]">
        By continuing with GitHub or Google, you acknowledge the account{" "}
        <Link className="text-blue-600 underline" href={publicAppRoutes.privacy}>
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link className="text-blue-600 underline" href={publicAppRoutes.terms}>
          Terms of Use
        </Link>
        . New provider-created accounts store this acknowledgement with the
        account record.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleProviderSignIn("github")}
        >
          Continue with GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleProviderSignIn("google")}
        >
          Continue with Google
        </Button>
      </div>
    </section>
  );
};

export default AuthProviderSignInButtons;
