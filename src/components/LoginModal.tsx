import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
      <ModalContent className="max-h-[80vh] overflow-y-auto">
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-blue-600">
            Welcome to TIGER King 👋
          </h2>
          <p className="text-sm text-gray-500">
            Log in with your OpenStreetMap account to get started
          </p>
        </ModalHeader>

        <ModalBody className="py-6">
          <div className="space-y-6">
            <div className="text-center p-6">
              <p className="mb-4">By logging in, you'll be able to:</p>
              <ul className="text-left list-disc list-inside">
                <li>Edit TIGER data</li>
                <li>Make improvements to OpenStreetMap</li>
                <li>Contribute to your local map data</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                color="primary"
                variant="solid"
                onPress={onLogin}
                className="w-full"
              >
                Login with OpenStreetMap
              </Button>

              <Button variant="flat" onPress={onClose} className="w-full">
                Cancel
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                Don't have an account?{" "}
                <Link
                  href="https://www.openstreetmap.org/user/new"
                  target="_blank"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
