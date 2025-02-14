"use client";

import ModalMessage from "@/components/ui/common/ModalMessage";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="bg-white w-1/2 p-12 mx-auto">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-blue-600 text-white rounded-md p-3"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );
};

export default LogoutForm;
