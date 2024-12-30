import React from "react";
import {
  Button,
  Card,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import RelationTags from "./RelationHeading";
import RelationForm from "./RelationForm";
import WayHeading from "./WayHeading";
import SurfaceButtons from "./SurfaceButtons";
import LanesButtons from "./LanesButtons";
import QuickTags from "./QuickTags";
import { OsmWay } from "../objects";

interface LeftPaneProps {
  relationId: string;
  showRelationHeading: boolean;
  overpassWays: OsmWay[];
  currentWay: number;
  isLoading: boolean;
  surfaceKeys: string;
  lanesKeys: string;
  onSurfaceChange: (value: string) => void;
  onLanesChange: (value: string) => void;
  onSkip: () => void;
  onFix: (message: string) => void;
  onSubmit: () => void;
  loading: boolean;
  setLocation: (location: string) => void;
  setRelationId: (id: string) => void;
  handleRelationSubmit: (e: React.FormEvent) => Promise<void>; // Add type definition
}

const LeftPane: React.FC<LeftPaneProps> = ({
  relationId,
  showRelationHeading,
  overpassWays,
  currentWay,
  isLoading,
  surfaceKeys,
  lanesKeys,
  onSurfaceChange,
  onLanesChange,
  onSkip,
  onFix,
  onSubmit,
  loading,
  setLocation,
  setRelationId,
  handleRelationSubmit,
}) => {
  const fixOptions = [
    { key: "bad-geometry", label: "Bad geometry" },
    { key: "needs-splitting", label: "Needs splitting" },
    { key: "doesnt-exist", label: "Doesn't exist" },
  ];

  return (
    <div className="w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4">
      {loading ? (
        <div>Loading authentication state...</div>
      ) : (
        <div className="p-4">
          {relationId && showRelationHeading ? (
            <RelationTags
              relationId={relationId}
              setRelationName={setLocation}
            />
          ) : (
            <RelationForm
              relationId={relationId}
              setRelationId={setRelationId}
              onSubmit={handleRelationSubmit}
            />
          )}
        </div>
      )}
      {overpassWays && overpassWays.length > 0 && (
        <div className="relative">
          <Divider className="my-4" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
            {currentWay + 1} of {overpassWays.length}
          </div>
        </div>
      )}
      <Card className="rounded-lg shadow p-4 gap-2 flex flex-col md:grow">
        {overpassWays && overpassWays.length > 0 ? (
          <div>
            <div>
              <WayHeading
                tags={overpassWays[currentWay].tags}
                wayId={overpassWays[currentWay].id?.toString() ?? ""}
              />
              <div className="flex flex-col gap-2">
                <div className="py-2 flex flex-col gap-4">
                  <SurfaceButtons
                    surfaceKeys={surfaceKeys}
                    setSurfaceKeys={onSurfaceChange}
                  />
                  <LanesButtons
                    lanesKeys={lanesKeys}
                    setLanesKeys={onLanesChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <QuickTags
                surfaceKeys={surfaceKeys}
                lanesKeys={lanesKeys}
                onSurfaceChange={onSurfaceChange}
                onLanesChange={onLanesChange}
              />
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
                      Fix
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Fix options"
                    onAction={(label) => onFix(label.toString().toLowerCase())}
                  >
                    {fixOptions.map((option) => (
                      <DropdownItem key={option.key}>
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Button
                  color="primary"
                  size="md"
                  className="flex-1"
                  onPress={onSubmit}
                  isDisabled={!surfaceKeys || !lanesKeys}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center mt-4">
            <Spinner label="Loading ways..." color="primary" />
          </div>
        ) : (
          <p>Enter a relation ID to get started.</p>
        )}
      </Card>
    </div>
  );
};
export default LeftPane;
