import React, { useEffect, useRef } from "react";
import Image from "next/image";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`
        fixed inset-0 
        bg-transparent p-0 m-auto
        backdrop:bg-black backdrop:bg-opacity-50 
        w-full ${maxWidthClasses[maxWidth]}
        h-fit
      `}
      onClick={handleBackdropClick}
      onKeyDown={handleEscape}
    >
      <div className="bg-white rounded-lg shadow-xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          {title && (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <Image
              src="/assets/icons/close.svg"
              alt="Close"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
