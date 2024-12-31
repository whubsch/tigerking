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
  show: boolean;
  ways: number;
  onClose: () => void;
  uploads: OsmWay[];
  setUploadWays: React.Dispatch<React.SetStateAction<OsmWay[]>>;
  location: string;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
  imagery: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const FinishedModal: React.FC<FinishedModalProps> = ({
  show,
  ways,
  onClose,
  uploads,
  setUploadWays,
  location,
  setChangeset,
  imagery,
  setError,
}) => {
  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      isDismissable={true}
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
          <h2 className="text-2xl font-bold text-blue-600">
            Area Completed! 🎯
          </h2>
          <p className="text-sm text-gray-500">
            You've successfully reviewed all ways in this area
          </p>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center text-lg font-medium text-blue-800">
                Thank you for helping to tame the TIGER!
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-gray-100 px-6 py-3 rounded-full">
                <span className="text-2xl font-bold text-gray-700">{ways}</span>
                <span className="text-gray-600 ml-2">ways cleared</span>
              </div>
              <p className="text-center text-gray-600 mt-2">
                Time to upload your changes and make them permanent!
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <UploadButton
                uploads={uploads}
                setUploadWays={setUploadWays}
                location={location}
                setChangeset={setChangeset}
                imagery={imagery}
                setError={setError}
              />

              <Button onPress={onClose} variant="light" className="w-full">
                Continue Editing
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishedModal;
