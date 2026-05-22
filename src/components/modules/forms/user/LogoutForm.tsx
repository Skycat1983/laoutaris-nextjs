"use client";

import ModalMessage from "@/components/elements/typography/ModalMessage";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";

// TODO: redo this form with shadcn/ui
const privacyRequestHref =
  "mailto:hlaoutaris@gmail.com?subject=Account%20privacy%20request&body=Please%20describe%20whether%20you%20are%20requesting%20account%20deletion%2C%20data%20export%2C%20or%20correction.%20Do%20not%20include%20your%20password.";

const LogoutForm = () => {
  const router = useRouter();
  const redirectToHome = () => {
    router.push("/");
  };
  const { openModal } = useGlobalFeatures();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      // await signOut({ callbackUrl: "/" });

      openModal(<ModalMessage message="Logout successful." />, redirectToHome);
    } catch {
      openModal(<ModalMessage message="Logout failed." />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-4 bg-white p-12">
        <div className="flex w-full flex-row gap-4">
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="outline"
            className="w-full p-3 text-black"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
          <Button asChild className="w-full p-3 text-white">
            <Link href={privacyRequestHref}>Email privacy request</Link>
          </Button>
        </div>
        <p className="text-sm leading-6 text-[#000000BF]">
          To request account deletion, data export, or account correction,
          email hlaoutaris@gmail.com. This app does not perform self-service
          deletion or export from this control.
        </p>
      </div>
    </>
  );
};

export default LogoutForm;
