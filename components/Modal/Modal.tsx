//Modal.tsx

"use client";

import css from "./Modal.module.css";
import { useEffect, ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMounted.current) {
        console.log("Escape pressed in Modal, calling onClose");
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      isMounted.current = false;
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && isMounted.current) {
      console.log("Backdrop clicked in Modal, calling onClose");
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
}
