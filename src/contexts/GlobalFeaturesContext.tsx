"use client";

import { ReactNode, createContext, useContext } from "react";
import useModal, { UseModalValues } from "../hooks/useModal";
import { useLanguage, Languages, UseLanguageValues } from "@/hooks/useLanguage";

type GlobalFeaturesContextValues = UseModalValues & UseLanguageValues;

export const defaultValue: GlobalFeaturesContextValues = {
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  modalContent: null,
  setModalContent: () => {},
  language: "en",
  changeLanguage: () => {},
};

const GlobalFeaturesContext =
  createContext<GlobalFeaturesContextValues>(defaultValue);

interface GlobalFeaturesProviderProps {
  children: ReactNode;
}

export const GlobalFeaturesProvider = ({
  children,
}: GlobalFeaturesProviderProps): React.ReactElement => {
  const language = useLanguage();
  const modal = useModal();

  return (
    <GlobalFeaturesContext.Provider
      value={{
        ...modal,
        ...language,
      }}
    >
      {children}
    </GlobalFeaturesContext.Provider>
  );
};

export const useGlobalFeatures = () => useContext(GlobalFeaturesContext);
