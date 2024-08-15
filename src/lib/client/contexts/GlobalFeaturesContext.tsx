"use client";

import { ReactNode, createContext, useContext } from "react";
import useModal, { UseModalValues } from "../hooks/useModal";

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
  const modal = useModal();

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
