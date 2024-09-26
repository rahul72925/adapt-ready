import React, {
  forwardRef,
  ReactNode,
  Ref,
  useImperativeHandle,
  useState,
} from "react";

interface ModalProps {
  children: ReactNode;
}

export interface ModalHandle {
  open: () => void;
  close: () => void;
}

export const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ children }, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useImperativeHandle(
      ref,
      () => ({
        open() {
          setIsOpen(true);
        },
        close() {
          setIsOpen(false);
        },
      }),
      []
    );

    if (!isOpen) return null;

    return (
      <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="bg-black opacity-50  absolute h-full w-full "></div>
        {children}
      </div>
    );
  }
);

Modal.displayName = "Modal";
