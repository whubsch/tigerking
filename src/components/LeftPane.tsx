import React from "react";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import RelationHeading from "./RelationHeading";
import LocationAutocomplete from "./LocationAutocomplete";
import NoRelationPlaceholder from "./NoRelationPlaceholder";
import WayEditor from "./WayEditor";
import BboxCard from "./BboxCard";
import { OsmWay } from "../objects";
import { useChangesetStore } from "../stores/useChangesetStore";
import { BBox } from "../stores/useBboxStore";

interface LeftPaneProps {
  showRelationHeading: boolean;
  bbox: BBox;
  overpassWays: OsmWay[];
  setOverpassWays: (ways: OsmWay[]) => void;
  currentWay: number;
  isLoading: boolean;
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
  convertDriveway: string;
  setConvertDriveway: (value: string) => void;
  nameFixAction: string;
  setNameFixAction: (action: string) => void;
  streetAbbreviationAction: string;
  setStreetAbbreviationAction: (action: string) => void;
  laneTagFixAction: string;
  setLaneTagFixAction: (action: string) => void;
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
  streetAbbreviationAction,
  setStreetAbbreviationAction,
  laneTagFixAction,
  setLaneTagFixAction,
  onSkip,
  onFix,
  onClearTiger,
  onSubmit,
}) => {
  const { relation } = useChangesetStore();

  const handleTagsUpdate = (
    updatedTags: Record<string, string | undefined>,
  ) => {
    const updatedWays = [...overpassWays];
    updatedWays[currentWay] = {
      ...updatedWays[currentWay],
      tags: updatedTags,
    };
    setOverpassWays(updatedWays);
  };

  const hasBbox = bbox.north && bbox.south && bbox.east && bbox.west;
  const hasWays = overpassWays && overpassWays.length > 0;

  return (
    <div className="w-full md:w-1/3 p-4 border-b md:border-r border-gray-200 gap-4 flex flex-col md:h-full">
      <Card>
        {hasBbox ? (
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

      {hasWays && (
        <div className="relative">
          <Divider className="my-4" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2">
            {currentWay + 1} of {overpassWays.length}
          </div>
        </div>
      )}

      <div className="px-4 gap-2 flex flex-col md:grow">
        {hasWays ? (
          <WayEditor
            way={overpassWays[currentWay]}
            onTagsUpdate={handleTagsUpdate}
            showLaneDirection={showLaneDirection}
            setShowLaneDirection={setShowLaneDirection}
            convertDriveway={convertDriveway}
            setConvertDriveway={setConvertDriveway}
            nameFixAction={nameFixAction}
            setNameFixAction={setNameFixAction}
            streetAbbreviationAction={streetAbbreviationAction}
            setStreetAbbreviationAction={setStreetAbbreviationAction}
            laneTagFixAction={laneTagFixAction}
            setLaneTagFixAction={setLaneTagFixAction}
            onSkip={onSkip}
            onFix={onFix}
            onClearTiger={onClearTiger}
            onSubmit={onSubmit}
          />
        ) : isLoading ? (
          <div className="flex justify-center items-center mt-4">
            <Spinner label="Loading ways..." color="primary" />
          </div>
        ) : (
          <NoRelationPlaceholder />
        )}
      </div>
    </div>
  );
};

export default LeftPane;
