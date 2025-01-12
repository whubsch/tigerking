import React, { ReactNode } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button, ButtonProps } from "@nextui-org/button";

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
}

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
}) => {
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
      <ModalContent className={contentClassName}>
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

        <ModalBody className={bodyClassName}>
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
