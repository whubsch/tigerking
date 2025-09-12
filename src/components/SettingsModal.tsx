import React from "react";
import BaseModal from "./BaseModal";
import { Switch } from "@heroui/switch";
import { Divider } from "@heroui/divider";
import { useSettingsStore } from "../stores/useSettingsStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { advancedMode, includeTracks, setAdvancedMode, setIncludeTracks } =
    useSettingsStore();

  const handleAdvancedModeChange = (isSelected: boolean) => {
    setAdvancedMode(isSelected);
    // If advanced mode is turned off, also disable includeTracks
    if (!isSelected) {
      setIncludeTracks(false);
    }
  };

  return (
    <BaseModal
      modalType="narrow"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={{
        label: "Settings",
        emoji: "⚙️",
        colorClass: "text-blue-600 dark:text-blue-400",
      }}
      subtitle="Pick your preferences"
      actions={[
        {
          label: "Close",
          color: "primary",
          variant: "flat",
          onClick: onClose,
        },
      ]}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-medium">Advanced Mode</h3>
            <p className="text-sm text-gray-500">
              Enable advanced features and options
            </p>
          </div>
          <Switch
            isSelected={advancedMode}
            onValueChange={handleAdvancedModeChange}
            color="primary"
          />
        </div>

        <Divider className="my-2" />

        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-medium">Include Tracks</h3>
            <p className="text-sm text-gray-500">
              Include track ways in Overpass queries
            </p>
          </div>
          <Switch
            isSelected={includeTracks}
            onValueChange={setIncludeTracks}
            isDisabled={!advancedMode}
            color="primary"
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;
