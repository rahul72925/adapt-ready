"use client";
import { useRef } from "react";
import { Modal, ModalHandle } from "@/components/modal";
import Button from "@/components/button";
import { SuggestionModalContent } from "./suggestionContent";

export const Suggestion: React.FC = () => {
  const modalRef = useRef<ModalHandle>(null);

  const handleSuggestOnClick = () => {
    modalRef.current?.open();
  };

  const handleCloseSuggestOnClick = () => {
    modalRef.current?.close();
  };
  return (
    <div>
      <Button onClick={handleSuggestOnClick}>Suggest</Button>
      <Modal ref={modalRef}>
        <SuggestionModalContent
          handleCloseSuggestOnClick={handleCloseSuggestOnClick}
        />
      </Modal>
    </div>
  );
};
