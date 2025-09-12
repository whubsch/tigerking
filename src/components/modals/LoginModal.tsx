import React from "react";
import BaseModal from "./BaseModal";
import { Link } from "@heroui/link";

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
    <BaseModal
      modalType="narrow"
      isOpen={isOpen}
      onClose={onClose}
      title={{
        label: "Welcome to TIGER King",
        emoji: "👋",
        colorClass: "text-blue-600 dark:text-blue-400",
      }}
      subtitle="Log in with your OpenStreetMap account to get started"
      actions={[
        {
          label: "Login with OpenStreetMap",
          color: "primary",
          onClick: onLogin,
        },
        {
          label: "Cancel",
          variant: "flat",
          onClick: onClose,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="px-6">
          <p className="mb-4 font-semibold">
            By logging in, you'll be able to:
          </p>
          <ul className="text-left list-disc list-inside">
            <li>Edit and correct imported TIGER data</li>
            <li>Make improvements to OpenStreetMap</li>
            <li>Contribute to your local map data</li>
          </ul>
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
    </BaseModal>
  );
};

export default LoginModal;
