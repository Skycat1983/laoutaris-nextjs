"use client";

import ModalMessage from "@/components/elements/typography/ModalMessage";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn/button";

// TODO: redo this form with shadcn/ui
const LogoutForm = () => {
  const router = useRouter();
  const redirectToHome = () => {
    router.push("http://localhost:3000/");
  };
  const { openModal } = useGlobalFeatures();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      // await signOut({ callbackUrl: "/" });

      openModal(<ModalMessage message="Logout successful." />, redirectToHome);
    } catch (error) {
      console.error("Logout failed:", error);
      openModal(<ModalMessage message="Logout failed." />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white w-1/2 p-12 mx-auto flex flex-row gap-4 w-full">
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="outline"
          className="text-black p-3 w-full"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
        <Button className=" text-white p-3 w-full">Delete Account</Button>
      </div>
    </>
  );
};

export default LogoutForm;
