"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useModal, { UseModalValues } from "../hooks/useModal";
import { getSession } from "@/lib/server/user/session/session";

type GlobalFeaturesContextValues = UseModalValues;

export const defaultValue: GlobalFeaturesContextValues = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  modalContent: null,
  setModalContent: () => {},
};

const GlobalFeaturesContext =
  createContext<GlobalFeaturesContextValues>(defaultValue);

interface GlobalFeaturesProviderProps {
  children: ReactNode;
}

export const GlobalFeaturesProvider = ({
  children,
}: GlobalFeaturesProviderProps): React.ReactElement => {
  // const [activeSession, setActiveSession] = useState(false);
  const modal = useModal();

  // useEffect(() => {
  //   const session = async () => {
  //     const session = await getSession();
  //     if (session) {
  //       setActiveSession(true);
  //     }
  //   };
  //   session();
  //   // first

  //   return () => {
  //     // second
  //   };
  // }, []);

  return (
    <GlobalFeaturesContext.Provider
      value={{
        ...modal,
      }}
    >
      {children}
    </GlobalFeaturesContext.Provider>
  );
};

export const useGlobalFeatures = () => useContext(GlobalFeaturesContext);
