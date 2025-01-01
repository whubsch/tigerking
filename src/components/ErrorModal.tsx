import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = "Error Occurred",
  message,
  details,
  action,
}) => {
  return (
    <Modal
      isOpen={isOpen}
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
          <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            Please review the error details below
          </p>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-center text-lg font-medium text-red-800">
                {message}
              </p>
            </div>

            {details && (
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 font-mono">
                {details}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-4">
              {action && (
                <Button
                  color="primary"
                  variant="solid"
                  onPress={action.onClick}
                  className="w-full"
                >
                  {action.label}
                </Button>
              )}

              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
