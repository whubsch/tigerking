import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Spinner } from "@heroui/spinner";
import RelationHeading from "./RelationHeading";
import WayHeading from "./WayHeading";
import SurfaceButtons from "./SurfaceButtons";
import LanesButtons from "./LanesButtons";
import QuickTags from "./QuickTags";
import NoRelationPlaceholder from "./NoRelationPlaceholder";
import CustomMessageModal from "./modals/CustomMessageModal";
import LocationAutocomplete from "./LocationAutocomplete";
import { OsmWay } from "../objects";
import check from "../assets/check.svg";
import lightning from "../assets/lightning.svg";
import edit from "../assets/edit.svg";
import ban from "../assets/ban.svg";
import trash from "../assets/trash.svg";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { useChangesetStore } from "../stores/useChangesetStore";
import { useWayTagsStore } from "../stores/useWayTagsStore";
import { BBox } from "../stores/useBboxStore";
import BboxCard from "./BboxCard";
import LoginModal from "./modals/LoginModal";
import { Kbd } from "@heroui/kbd";
import { Tooltip } from "@heroui/tooltip";

interface LeftPaneProps {
  showRelationHeading: boolean;
  bbox: BBox;
  overpassWays: OsmWay[];
  setOverpassWays: (ways: OsmWay[]) => void; // Add this line
  currentWay: number;
  isLoading: boolean;
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
  convertDriveway: string;
  setConvertDriveway: (value: string) => void;
  nameFixAction: string;
  setNameFixAction: (action: string) => void;
  onSkip: () => void;
  onFix: (message: string) => void;
  onClearTiger: () => void;
  onSubmit: () => void;
}

const LeftPane: React.FC<LeftPaneProps> = ({
  showRelationHeading,
  bbox,
  overpassWays,
  setOverpassWays,
  currentWay,
  isLoading,
  showLaneDirection,
  setShowLaneDirection,
  convertDriveway,
  setConvertDriveway,
  nameFixAction,
  setNameFixAction,
  onSkip,
  onFix,
  onClearTiger,
  onSubmit,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [customFixMessage, setCustomFixMessage] = useState("");
  const fixOptions = [
    { key: "bad-geometry", label: "Bad geometry", keybind: "b" },
    { key: "needs-splitting", label: "Needs splitting", keybind: "s" },
    { key: "doesnt-exist", label: "Doesn't exist", keybind: "d" },
    { key: "check-name", label: "Check name value", keybind: "n" },
    { key: "check-highway", label: "Check highway value", keybind: "c" },
  ];
  const { relation } = useChangesetStore();
  const { lanes, surface, laneMarkings } = useWayTagsStore();
  const { loggedIn, handleLogin } = useOsmAuthContext();

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

  const handleNameFixSelection = (action: string) => {
    setNameFixAction(action);
  };

  const getNumberedNameTagInfo = () => {
    if (!overpassWays[currentWay]?.tags) return null;

    const tags = overpassWays[currentWay].tags;

    // Find all name_ tags that end with a digit
    const numberedNameTags = Object.keys(tags)
      .filter((key) => /^name_\d+$/.test(key))
      .sort();

    // Only show alert if there's exactly one numbered name tag and no alt_name
    if (numberedNameTags.length === 1 && !tags.alt_name) {
      const tagKey = numberedNameTags[0];
      const tagValue = tags[tagKey];
      return { tagKey, tagValue };
    }

    return null;
  };

  const numberedNameInfo = getNumberedNameTagInfo();

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
      <div className="w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4 flex flex-col md:h-full">
        <Card>
          {bbox.north && bbox.south && bbox.east && bbox.west ? (
            <BboxCard bbox={bbox} />
          ) : (
            <div className="p-4">
              {relation.id && showRelationHeading ? (
                <RelationHeading />
              ) : (
                <LocationAutocomplete />
              )}
            </div>
          )}
        </Card>
        {overpassWays && overpassWays.length > 0 && (
          <div className="relative">
            <Divider className="my-4" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
              {currentWay + 1} of {overpassWays.length}
            </div>
          </div>
        )}
        <div className="px-4 gap-2 flex flex-col md:grow">
          {overpassWays && overpassWays.length > 0 ? (
            <>
              <WayHeading
                tags={overpassWays[currentWay].tags}
                wayId={overpassWays[currentWay].id?.toString() ?? ""}
                onTagsUpdate={(updatedTags) => {
                  // Create a new array with the updated way
                  const updatedWays = [...overpassWays];

                  // Update the tags for the current way
                  updatedWays[currentWay] = {
                    ...updatedWays[currentWay],
                    tags: updatedTags,
                  };

                  // Update the state with the new array
                  setOverpassWays(updatedWays);
                }}
              />
              <div className="flex flex-col gap-2 md:grow">
                <div className="py-2 flex flex-col gap-4">
                  <SurfaceButtons />
                  <LanesButtons
                    showLaneDirection={showLaneDirection}
                    setShowLaneDirection={setShowLaneDirection}
                  />
                </div>
              </div>
              <div className="flex-none">
                <>
                  {!overpassWays[currentWay].tags.name &&
                    overpassWays[currentWay].tags.highway === "residential" && (
                      <div
                        className={`flex p-4 my-4 gap-2 text-warning-700 rounded-medium items-center ${convertDriveway ? "bg-warning-200 outline outline-2 outline-warning" : "bg-warning-100"}`}
                      >
                        <div className="flex flex-col flex-grow gap-1">
                          <span className="text-sm font-medium">
                            This residential way has no name
                          </span>
                          <span className="text-xs">
                            Consider converting to a driveway or track if
                            appropriate
                          </span>
                        </div>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button size="sm" color="warning" variant="flat">
                              {convertDriveway ? (
                                <img
                                  src={check}
                                  alt="check"
                                  className="h-6 w-6 brightness-0 dark:brightness-100 dark:invert"
                                />
                              ) : (
                                "Convert"
                              )}
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
                                onPress={() => setConvertDriveway(option)}
                              >
                                {option}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
                  {numberedNameInfo && (
                    <div
                      className={`flex p-4 my-4 gap-2 text-warning-700 rounded-medium items-center ${
                        nameFixAction === "check"
                          ? "bg-warning-200 outline outline-2 outline-warning"
                          : "bg-warning-100"
                      }`}
                    >
                      <div className="flex flex-col flex-grow gap-1">
                        <span className="text-sm font-medium">
                          Fix name tagging
                        </span>
                        <span className="text-xs">
                          Move the <code>{numberedNameInfo.tagKey}</code> tag to{" "}
                          <code>alt_name</code>
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[
                          {
                            action: "check",
                            src: check,
                            alt: "check",
                            tooltip: "Accept fix",
                            color:
                              nameFixAction === "check" ? "warning" : "default",
                          },
                          {
                            action: "ban",
                            src: ban,
                            alt: "ban",
                            tooltip: "Reject fix",
                            color:
                              nameFixAction === "ban" ? "primary" : "default",
                          },
                          {
                            action: "trash",
                            src: trash,
                            alt: "trash",
                            tooltip: "Delete tag",
                            color:
                              nameFixAction === "trash" ? "danger" : "default",
                          },
                        ].map(({ action, src, alt, tooltip, color }) => (
                          <Tooltip content={tooltip} key={alt}>
                            <Button
                              key={alt}
                              isIconOnly
                              size="sm"
                              color={color as any}
                              variant={
                                nameFixAction === action ? "solid" : "flat"
                              }
                              onPress={() => handleNameFixSelection(action)}
                            >
                              <img
                                src={src}
                                alt={alt}
                                className="h-6 w-6 brightness-0 dark:brightness-100 dark:invert"
                              />
                            </Button>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}
                  <QuickTags />

                  <div className="flex gap-2 w-full mt-4">
                    <Button
                      color="default"
                      size="md"
                      className="flex-1"
                      onPress={onSkip}
                    >
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
                              onPress={() =>
                                handleFix(option.label.toLowerCase())
                              }
                              textValue={option.label}
                            >
                              <div className="flex gap-2 items-center justify-between">
                                <p>{option.label}</p>
                                {option.keybind && (
                                  <Kbd className="hidden md:block">
                                    {option.keybind}
                                  </Kbd>
                                )}
                              </div>
                            </DropdownItem>
                          ))}
                        </>
                        <DropdownItem
                          key="custom-fix-message"
                          color="primary"
                          onPress={handleCustomFix}
                          endContent={
                            <img
                              src={edit}
                              alt="edit"
                              className="w-4 h-4 brightness-0 dark:brightness-100 dark:invert"
                            />
                          }
                          textValue="Custom fix message"
                        >
                          <div className="flex gap-2 items-center">
                            Custom fix message
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          key="clear-tiger"
                          color="primary"
                          onPress={handleClearTiger}
                          endContent={
                            <img
                              src={lightning}
                              alt="lightning"
                              className="w-5 h-5 brightness-0 dark:brightness-100 dark:invert"
                            />
                          }
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
              </div>
            </>
          ) : isLoading ? (
            <div className="flex justify-center items-center mt-4">
              <Spinner label="Loading ways..." color="primary" />
            </div>
          ) : (
            <NoRelationPlaceholder />
          )}
        </div>
      </div>
    </>
  );
};
export default LeftPane;
