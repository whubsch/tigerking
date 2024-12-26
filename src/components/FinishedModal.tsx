import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import UploadButton from "./UploadButton";
import { OsmWay } from "../objects";

interface FinishedModalProps {
  ways: number;
  onClose: () => void; // Add this prop
  uploads: OsmWay[];
  setUploadWays: React.Dispatch<React.SetStateAction<OsmWay[]>>;
  location: string;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
}

const FinishedModal: React.FC<FinishedModalProps> = ({
  ways,
  onClose,
  uploads,
  setUploadWays,
  location,
  setChangeset,
}) => {
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
          <UploadButton
            uploads={uploads}
            setUploadWays={setUploadWays}
            location={location}
            setChangeset={setChangeset}
          />
          <Button onPress={onClose}>Close</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishedModal;
