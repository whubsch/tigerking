import React, { ReactNode } from "react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import Icon from "./Icon";

export interface TagFixAction {
  action: string;
  src: string;
  alt: string;
  tooltip: string;
  color: "default" | "warning" | "primary" | "secondary" | "success" | "danger";
}

interface TagFixAlertProps {
  title: string;
  description: ReactNode;
  actions: TagFixAction[];
  selectedAction: string;
  onActionSelect: (action: string) => void;
  highlightColor?: "warning" | "danger" | "primary";
}

const TagFixAlert: React.FC<TagFixAlertProps> = ({
  title,
  description,
  actions,
  selectedAction,
  onActionSelect,
  highlightColor = "warning",
}) => {
  const getTextColorClass = () => {
    switch (highlightColor) {
      case "warning":
        return "text-warning-700";
      case "danger":
        return "text-danger-700";
      case "primary":
        return "text-primary-700";
      default:
        return "text-warning-700";
    }
  };

  const getBackgroundClass = () => {
    switch (highlightColor) {
      case "warning":
        return selectedAction === actions[0]?.action
          ? "bg-warning-200 outline-solid outline-2 outline-warning"
          : "bg-warning-100";
      case "danger":
        return selectedAction === actions[0]?.action
          ? "bg-danger-200 outline-solid outline-2 outline-danger"
          : "bg-danger-100";
      case "primary":
        return selectedAction === actions[0]?.action
          ? "bg-primary-200 outline-solid outline-2 outline-primary"
          : "bg-primary-100";
      default:
        return selectedAction === actions[0]?.action
          ? "bg-warning-200 outline-solid outline-2 outline-warning"
          : "bg-warning-100";
    }
  };

  return (
    <div
      className={`flex p-4 my-4 gap-2 ${getTextColorClass()} rounded-medium items-center ${getBackgroundClass()}`}
    >
      <div className="flex flex-col grow gap-1">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs">{description}</span>
      </div>
      <div className="flex gap-1">
        {actions.map(({ action, src, alt, tooltip, color }) => (
          <Tooltip content={tooltip} key={alt}>
            <Button
              isIconOnly
              size="sm"
              color={color}
              variant={selectedAction === action ? "solid" : "flat"}
              onPress={() => onActionSelect(action)}
            >
              <Icon src={src} alt={alt} />
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default TagFixAlert;
