"use client";

import { useState, useCallback } from "react";

export interface UseModalValues {
  isOpen: boolean;
  openModal: (content: React.ReactNode, onClose?: () => void) => void;
  closeModal: () => void;
  modalContent: React.ReactNode;
  setModalContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

const useModal = (): UseModalValues => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(
    null
  );

  /**
   * Opens the modal with specified content and an optional onClose callback.
   *
   * @param content - The React node to display inside the modal.
   * @param onClose - Optional callback to execute when the modal is closed.
   */
  const openModal = useCallback(
    (content: React.ReactNode, onClose?: () => void) => {
      setModalContent(content);
      setIsOpen(true);
      setOnCloseCallback(() => onClose ?? null);
    },
    []
  );

  /**
   * Closes the modal and executes the onClose callback if it exists.
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (onCloseCallback) {
      onCloseCallback();
      setOnCloseCallback(null); // Reset after execution to prevent repeated calls
    }
  }, [onCloseCallback]);

  return {
    isOpen,
    openModal,
    closeModal,
    modalContent,
    setModalContent,
  };
};

export default useModal;

// "use client";

// import { useState } from "react";

// export interface UseModalValues {
//   isOpen: boolean;
//   openModal: () => void;
//   closeModal: () => void;
//   modalContent: React.ReactNode;
//   setModalContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
// }

// const useModal = (): UseModalValues => {
//   const [modalContent, setModalContent] = useState<React.ReactNode>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   const openModal = () => {
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   //   TODO: this could be useful for transitioning between different modals and their animations/delays
//   const transitionModalContent = (content: React.ReactNode) => {};

//   return {
//     isOpen,
//     openModal,
//     closeModal,
//     modalContent,
//     setModalContent,
//   };
// };

// export default useModal;
