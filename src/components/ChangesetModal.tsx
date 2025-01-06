import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import ChangesetTagTable from "./ChangesetTags";
import { useChangesetStore } from "../stores/useChangesetStore";

interface ChangesetModalProps {
  latestChangeset: number;
  onClose: () => void;
}

const ChangesetModal: React.FC<ChangesetModalProps> = ({
  latestChangeset,
  onClose,
}) => {
  const { source, description } = useChangesetStore();
  return (
    <Modal
      isOpen={latestChangeset !== 0}
      onClose={onClose}
      closeButton
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-green-600">Success! 🎉</h2>
          <p className="text-sm text-gray-500">
            Your changeset has been uploaded successfully
          </p>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-center text-lg font-medium text-green-800">
                Thank you for helping to tame the TIGER!
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-600">Changeset ID:</p>
              <Link
                href={`https://www.openstreetmap.org/changeset/${latestChangeset}`}
                target="_blank"
                className="text-lg font-semibold hover:text-blue-600 transition-colors"
                isExternal
                showAnchorIcon
              >
                {latestChangeset}
              </Link>
            </div>
            <ChangesetTagTable description={description} source={source} />

            <div className="flex justify-center pt-4 flex-col">
              <Button color="default" variant="flat" onPress={onClose}>
                Close
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangesetModal;
