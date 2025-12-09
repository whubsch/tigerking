import { Button } from "@heroui/button";
import { ReactNode } from "react";
import kebab from "../assets/kebab.svg";
import Icon from "./Icon";

const toggleButton = (
  isActive: boolean,
  label?: string,
  onPress?: () => void,
  isIconOnly: boolean = false,
  slot?: ReactNode,
  isDisabled: boolean = false,
) => (
  <Button
    key={label}
    variant="bordered"
    className={`flex-1 border-1 transition-all duration-200 ${isActive ? "bg-primary-100 shadow-lg border-primary" : "hover:bg-primary/10"}`}
    onPress={onPress}
    isIconOnly={isIconOnly}
    isDisabled={isDisabled}
  >
    {isIconOnly && !isActive ? (
      <Icon src={kebab} alt="kebab" />
    ) : (
      <div className="flex items-center gap-2">
        {label && <span>{label}</span>}
        {slot}
      </div>
    )}
  </Button>
);

export default toggleButton;
