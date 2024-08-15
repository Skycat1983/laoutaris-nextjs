"use client";

import { useGlobalFeatures } from "@/lib/client/contexts/GlobalFeaturesContext";
/**
 * `ModalWrapper` is a component that renders a modal dialog using the `@headlessui/react` library.
 *
 * It uses the `useGlobalFeatures` hook to control the state of the modal (whether it's open or closed) and its content.
 *
 * this in turn uses the useModal hook
 *
 * The modal's visibility, opening, and closing are controlled by the `isOpen`, `openModal`, and `closeModal` values from `useGlobalFeatures`.
 *
 * The content of the modal is set by the `modalContent` value from `useGlobalFeatures`.
 *
 * The modal uses a smooth transition for opening and closing, and it is positioned in the center of the screen.
 *
 * The modal's content can be any React node.
 *
 */

import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { useEffect } from "react";

function Modal() {
  const { isOpen, openModal, closeModal, setModalContent, modalContent } =
    useGlobalFeatures();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!modalContent && !isOpen) {
        // setModalContent(<SignUpForm />);
        // openModal();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 text-center">
          <Transition
            show={isOpen}
            appear={true}
            enter="transition-height-opacity-transform duration-500"
            enterFrom="-translate-y-[150px] opacity-0 "
            enterTo="translate-y-0 opacity-100 "
          >
            <DialogPanel className="flex h-auto w-full m-8 sm:m-0 md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2">
              {modalContent}
            </DialogPanel>
          </Transition>
        </div>
      </Dialog>
    </>
  );
}

export default Modal;
