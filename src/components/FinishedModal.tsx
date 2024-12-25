import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

interface FinishedModalProps {
  ways: number;
}

const FinishedModal: React.FC<FinishedModalProps> = ({ ways }) => {
  return (
    <Modal isOpen={true}>
      <ModalContent>
        <ModalHeader>Area completed</ModalHeader>
        <ModalBody>
          <p>Thank you for helping to tame the TIGER!</p>
          <p>
            You've cleared the area of {ways} ways! Time to upload your changes.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishedModal;
