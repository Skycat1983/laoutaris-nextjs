"use client";

import { useState } from "react";

export interface UseModalValues {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalContent: React.ReactNode;
  setModalContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

const useModal = (): UseModalValues => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //   TODO: this could be useful for transitioning between different modals and their animations/delays
  const transitionModalContent = (content: React.ReactNode) => {};

  return {
    isOpen,
    openModal,
    closeModal,
    modalContent,
    setModalContent,
  };
};

export default useModal;
