import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Tooltip } from "@heroui/tooltip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Icon from "./Icon";
import edit from "../assets/edit.svg";
import lightning from "../assets/lightning.svg";
import CustomMessageModal from "./modals/CustomMessageModal";
import LoginModal from "./modals/LoginModal";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { useWayTagsStore } from "../stores/useWayTagsStore";

interface ActionButtonsProps {
  onSkip: () => void;
  onFix: (message: string) => void;
  onClearTiger: () => void;
  onSubmit: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSkip,
  onFix,
  onClearTiger,
  onSubmit,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [customFixMessage, setCustomFixMessage] = useState("");
  const { lanes, surface, laneMarkings } = useWayTagsStore();
  const { loggedIn, handleLogin } = useOsmAuthContext();

  const fixOptions = [
    { key: "bad-geometry", label: "Bad geometry", keybind: "b" },
    { key: "needs-splitting", label: "Needs splitting", keybind: "s" },
    { key: "doesnt-exist", label: "Doesn't exist", keybind: "d" },
    { key: "check-name", label: "Check name value", keybind: "n" },
    { key: "check-highway", label: "Check highway value", keybind: "c" },
  ];

  const onCustomFix = () => {
    if (customFixMessage.trim()) {
      onFix(customFixMessage);
      setCustomFixMessage("");
      setIsFixModalOpen(false);
    }
  };

  const handleFix = (message: string) => {
    if (!loggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    onFix(message);
  };

  const handleSubmit = () => {
    if (!loggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    onSubmit();
  };

  const handleClearTiger = () => {
    if (!loggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    onClearTiger();
  };

  const handleCustomFix = () => {
    if (!loggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsFixModalOpen(true);
  };

  return (
    <>
      <CustomMessageModal
        isOpen={isFixModalOpen}
        onOpenChange={setIsFixModalOpen}
        customMessage={customFixMessage}
        setCustomMessage={setCustomFixMessage}
        onSubmit={onCustomFix}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => {
          handleLogin();
          setIsLoginModalOpen(false);
        }}
      />

      <div className="flex gap-2 w-full mt-4">
        <Button color="default" size="md" className="flex-1" onPress={onSkip}>
          Skip
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button color="default" size="md" className="flex-1">
              Fix...
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Fix options">
            <>
              {fixOptions.map((option) => (
                <DropdownItem
                  key={option.key}
                  onPress={() => handleFix(option.label.toLowerCase())}
                  textValue={option.label}
                >
                  <div className="flex gap-2 items-center justify-between">
                    <p>{option.label}</p>
                    {option.keybind && (
                      <Kbd className="hidden md:block">{option.keybind}</Kbd>
                    )}
                  </div>
                </DropdownItem>
              ))}
            </>
            <DropdownItem
              key="custom-fix-message"
              color="primary"
              onPress={handleCustomFix}
              endContent={<Icon src={edit} alt="edit" size="w-4 h-4" />}
              textValue="Custom fix message"
            >
              <div className="flex gap-2 items-center">Custom fix message</div>
            </DropdownItem>
            <DropdownItem
              key="clear-tiger"
              color="primary"
              onPress={handleClearTiger}
              endContent={<Icon src={lightning} alt="lightning" size="w-5 h-5" />}
              textValue="Clear TIGER tags"
            >
              <div className="flex gap-2 items-center">
                Clear TIGER tags
                <Kbd className="hidden md:block">f</Kbd>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Tooltip
          content={
            <p className="items-center">
              Key: <Kbd>Enter</Kbd>
            </p>
          }
          delay={250}
        >
          <Button
            color="primary"
            size="md"
            className="flex-1"
            onPress={handleSubmit}
            isDisabled={!surface || (!lanes && laneMarkings)}
          >
            Submit
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default ActionButtons;
