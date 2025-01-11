import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Spinner } from "@nextui-org/spinner";
import RelationTags from "./RelationHeading";
import RelationForm from "./RelationForm";
import WayHeading from "./WayHeading";
import SurfaceButtons from "./SurfaceButtons";
import LanesButtons from "./LanesButtons";
import QuickTags from "./QuickTags";
import NoRelationPlaceholder from "./NoRelationPlaceholder";
import CustomMessageModal from "./CustomMessageModal";
import { OsmWay } from "../objects";
import check from "../assets/check.svg";
import lightning from "../assets/lightning.svg";
import edit from "../assets/edit.svg";
import { useOsmAuthContext } from "../contexts/useOsmAuth";
import { useChangesetStore } from "../stores/useChangesetStore";
import { useWayTagsStore } from "../stores/useWayTagsStore";
import { BBox } from "../stores/useBboxStore";
import BboxCard from "./BboxCard";
import LoginModal from "./LoginModal";
import { Kbd } from "@nextui-org/kbd";
import { Tooltip } from "@nextui-org/tooltip";

interface LeftPaneProps {
  showRelationHeading: boolean;
  bbox: BBox;
  overpassWays: OsmWay[];
  currentWay: number;
  isLoading: boolean;
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
  convertDriveway: string;
  setConvertDriveway: (value: string) => void;
  onSkip: () => void;
  onFix: (message: string) => void;
  onClearTiger: () => void;
  onSubmit: () => void;
  handleRelationSubmit: (e: React.FormEvent) => Promise<void>; // Add type definition
}

const LeftPane: React.FC<LeftPaneProps> = ({
  showRelationHeading,
  bbox,
  overpassWays,
  currentWay,
  isLoading,
  showLaneDirection,
  setShowLaneDirection,
  convertDriveway,
  setConvertDriveway,
  onSkip,
  onFix,
  onClearTiger,
  onSubmit,
  handleRelationSubmit,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [customFixMessage, setCustomFixMessage] = useState("");
  const fixOptions = [
    { key: "bad-geometry", label: "Bad geometry" },
    { key: "needs-splitting", label: "Needs splitting" },
    { key: "doesnt-exist", label: "Doesn't exist" },
    { key: "check-highway", label: "Check highway value" },
  ];
  const { relationId } = useChangesetStore();
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
    onCustomFix();
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
      <div className="w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4 flex flex-col md:h-full">
        <Card>
          {bbox.north && bbox.south && bbox.east && bbox.west ? (
            <BboxCard bbox={bbox} />
          ) : (
            <div className="p-4">
              {relationId && showRelationHeading ? (
                <RelationTags />
              ) : (
                <RelationForm onSubmit={handleRelationSubmit} />
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
              />
              <div className="flex flex-col gap-2">
                <div className="py-2 flex flex-col gap-4">
                  <SurfaceButtons />
                  <LanesButtons
                    showLaneDirection={showLaneDirection}
                    setShowLaneDirection={setShowLaneDirection}
                  />
                </div>
              </div>
              <div className="grow">
                <>
                  <QuickTags />
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
                            <DropdownItem
                              key="driveway"
                              onPress={() => setConvertDriveway("driveway")}
                            >
                              driveway
                            </DropdownItem>
                            <DropdownItem
                              key="track"
                              onPress={() => setConvertDriveway("track")}
                            >
                              track
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    )}
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
                            >
                              {option.label}
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
                          Shortcut: <Kbd>s</Kbd>
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
