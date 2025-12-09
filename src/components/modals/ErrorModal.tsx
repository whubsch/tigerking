import React from "react";
import BaseModal from "./BaseModal";
import { ButtonProps } from "@heroui/button";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
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
  const modalActions = [
    ...(action
      ? [
          {
            label: action.label,
            color: action.color || "primary",
            variant: action.variant || "solid",
            onClick: action.onClick,
          },
        ]
      : []),
    {
      label: "Close",
      color: "danger" as const,
      variant: "light" as const,
      onClick: onClose,
    },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={{ label: title, emoji: "🚨", colorClass: "text-red-600" }}
      subtitle="Please review the error details below"
      actions={modalActions}
    >
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-center text-lg font-medium text-red-800">
            {message}
          </p>
        </div>

        {details && (
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 font-mono overflow-x-auto">
            <pre className="whitespace-pre-wrap wrap-break-word">{details}</pre>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ErrorModal;
