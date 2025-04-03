import React from "react";
import BaseModal from "./BaseModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  confirmText: string;
  children: React.ReactNode;
  isDangerous?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  confirmText,
  children,
  isDangerous = true,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={{
        label: title,
        emoji: "⚠️",
      }}
      modalType="narrow"
      actions={[
        {
          label: "Cancel",
          color: "default",
          variant: "flat",
          onClick: onClose,
        },
        {
          label: confirmText,
          color: isDangerous ? "danger" : "primary",
          onClick: handleConfirm,
        },
      ]}
    >
      {children}
    </BaseModal>
  );
};

export default ConfirmationModal;
