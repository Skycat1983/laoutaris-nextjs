"use client";

import ModalMessage from "@/components/atoms/ModalMessage";
import { useGlobalFeatures } from "@/lib/client/contexts/GlobalFeaturesContext";
import {
  LogoutProcessResponse,
  processLogout,
} from "@/lib/server/user/actions/processLogout";
import { useFormState } from "react-dom";

const initialState: LogoutProcessResponse = {
  type: "auth",
  authError: "",
};

const LogoutForm = () => {
  const { setModalContent } = useGlobalFeatures();
  const [state, formAction] = useFormState(processLogout, initialState);

  if (state.type === "auth" && state.authError) {
    setModalContent(
      <ModalMessage message="Logout failed. Please try again later." />
    );
  }

  if (state.type === "success") {
    setModalContent(<ModalMessage message="Logout successful." />);
  }

  return (
    <>
      <div className="bg-white w-1/2 p-12 mx-auto">
        <form action={formAction} className="flex flex-col gap-3">
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
