"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import { useGlobalFeatures } from "@/contexts/GlobalFeaturesContext";

const ModalDialog = lazy(async () => {
  const dialogModule = await import("@/components/modules/modal/ModalDialog");
  return { default: dialogModule.ModalDialog };
});

function Modal() {
  const { isOpen, closeModal, modalContent } = useGlobalFeatures();
  const [hasModalIntent, setHasModalIntent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasModalIntent(true);
    }
  }, [isOpen]);

  if (!hasModalIntent) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ModalDialog
        isOpen={isOpen}
        closeModal={closeModal}
        modalContent={modalContent}
      />
    </Suspense>
  );
}

export default Modal;
