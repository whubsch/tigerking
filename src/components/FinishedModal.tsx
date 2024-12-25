import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";

interface FinishedModalProps {
  ways: number;
  onClose: () => void; // Add this prop
}

const FinishedModal: React.FC<FinishedModalProps> = ({ ways, onClose }) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose} // Add this prop
      isDismissable={true} // Allows closing by clicking outside
    >
      <ModalContent>
        <ModalHeader>Area completed</ModalHeader>
        <ModalBody>
          <p>Thank you for helping to tame the TIGER!</p>
          <p>
            You've cleared the area of {ways} ways! Time to upload your changes.
          </p>
          <Button onClick={onClose}>Close</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishedModal;
