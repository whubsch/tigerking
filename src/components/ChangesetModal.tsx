import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Link,
} from "@nextui-org/react";

interface ChangesetModalProps {
  latestChangeset: number;
  onClose: () => void; // Add this prop
}

const ChangesetModal: React.FC<ChangesetModalProps> = ({
  latestChangeset,
  onClose,
}) => {
  return (
    <Modal isOpen={latestChangeset !== 0} onClose={onClose} closeButton>
      <ModalContent>
        <ModalHeader>Changeset uploaded</ModalHeader>
        <ModalBody>
          <p>Thank you for helping to tame the TIGER!</p>
          <p>
            Changeset ID:
            <Link
              href={`https://www.openstreetmap.org/changeset/${latestChangeset}`}
            >
              {latestChangeset}
            </Link>
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangesetModal;
