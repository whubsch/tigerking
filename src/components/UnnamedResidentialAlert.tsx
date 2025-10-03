import React from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Icon from "./Icon";
import check from "../assets/check.svg";

interface UnnamedResidentialAlertProps {
  convertDriveway: string;
  onConvertDriveway: (option: string) => void;
}

const UnnamedResidentialAlert: React.FC<UnnamedResidentialAlertProps> = ({
  convertDriveway,
  onConvertDriveway,
}) => {
  return (
    <div
      className={`flex p-4 my-4 gap-2 text-warning-700 rounded-medium items-center ${
        convertDriveway
          ? "bg-warning-200 outline outline-2 outline-warning"
          : "bg-warning-100"
      }`}
    >
      <div className="flex flex-col flex-grow gap-1">
        <span className="text-sm font-medium">
          This residential way has no name
        </span>
        <span className="text-xs">
          Consider converting to a driveway or track if appropriate
        </span>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button size="sm" color="warning" variant="flat">
            {convertDriveway ? <Icon src={check} alt="check" /> : "Convert"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Convert options"
          selectionMode="single"
          selectedKeys={[convertDriveway]}
        >
          {["driveway", "service", "track"].map((option) => (
            <DropdownItem
              key={option}
              onPress={() => onConvertDriveway(option)}
            >
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UnnamedResidentialAlert;
