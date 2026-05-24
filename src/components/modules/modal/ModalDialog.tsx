"use client";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import type { ReactNode } from "react";

interface ModalDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  modalContent: ReactNode;
}

export function ModalDialog({
  isOpen,
  closeModal,
  modalContent,
}: ModalDialogProps) {
  return (
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
  );
}
