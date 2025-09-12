import React, { ReactNode } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button, ButtonProps } from "@heroui/button";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: {
    label: string;
    colorClass?: string;
    emoji?: string;
  };
  subtitle?: string;
  children: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  bodyClassName?: string;
  actions?: {
    label: string;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    onClick: () => void;
    className?: string;
  }[];
  size?: ButtonProps["size"];
  closeButton?: boolean;
  modalType?: "default" | "wide" | "narrow";
}

const modalSizes = {
  default: {
    content: "max-h-[80vh] overflow-y-auto",
    body: "py-6 px-6",
  },
  wide: {
    content: "max-h-[80vh] overflow-y-auto md:min-w-[600px]",
    body: "py-6 px-8",
  },
  narrow: {
    content: "max-h-[80vh] overflow-y-auto md:max-w-[500px]",
    body: "py-6 px-4",
  },
};

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  headerClassName = "",
  contentClassName = "max-h-[80vh] overflow-y-auto",
  bodyClassName = "py-6",
  actions = [],
  size = "md",
  closeButton = true,
  modalType = "default",
}) => {
  const modalStyles = modalSizes[modalType];
  const finalContentClassName = contentClassName || modalStyles.content;
  const finalBodyClassName = bodyClassName || modalStyles.body;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeButton={closeButton}
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
      <ModalContent className={finalContentClassName}>
        {title && (
          <ModalHeader className={`flex flex-col gap-1 ${headerClassName}`}>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${title.colorClass}`}>
                {title.label}
              </span>
              <span className="text-2xl">{title.emoji}</span>
            </div>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </ModalHeader>
        )}

        <ModalBody className={finalBodyClassName}>
          <div className="space-y-4">
            {children}

            {actions.length > 0 && (
              <div className="flex flex-col gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    color={action.color || "primary"}
                    variant={action.variant || "solid"}
                    onPress={action.onClick}
                    className={`w-full ${action.className}`}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;
