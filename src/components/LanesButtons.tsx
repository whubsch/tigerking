import React from "react";
import { Button, ButtonGroup } from "@heroui/button";
import { Slider } from "@heroui/slider";
import TagButtonHeading from "./TagButtonHeading";
import toggleButton from "./ToggleButton";
import { useWayTagsStore } from "../stores/useWayTagsStore";
import { Chip } from "@heroui/react";
import { UNPAVED_SURFACES } from "../objects";

interface LanesButtonsProps {
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
  currentTags: Record<string, string | undefined>;
}

const LanesButtons: React.FC<LanesButtonsProps> = ({
  showLaneDirection,
  setShowLaneDirection,
  currentTags,
}) => {
  const COMMON_LANES = ["2", "4"];

  const {
    lanes,
    setLanes,
    laneMarkings,
    setLaneMarkings,
    lanesForward,
    setLanesForward,
    lanesBackward,
    setLanesBackward,
    surface,
  } = useWayTagsStore();

  // Check if current surface is unpaved
  const isUnpavedSurface = UNPAVED_SURFACES.includes(surface);

  // Check if way already has lane tags in original OSM data
  const hasExistingLaneTags = Boolean(
    currentTags.lanes ||
    currentTags["lanes:forward"] ||
    currentTags["lanes:backward"] ||
    currentTags.lane_markings,
  );

  // Disable lane buttons if unpaved surface and no existing lane tags
  // This allows modification/removal of existing tags but prevents adding new ones
  const lanesDisabled = isUnpavedSurface && !hasExistingLaneTags;

  // Check if there's any lane data currently set (in store or original tags)
  const hasAnyLaneData = Boolean(
    lanes ||
    lanesForward ||
    lanesBackward ||
    !laneMarkings ||
    hasExistingLaneTags,
  );

  // Show remove button if unpaved surface with lane data present
  const showRemoveButton = isUnpavedSurface && hasAnyLaneData;

  const handleRemoveLaneData = () => {
    setLanes("");
    setLanesForward(0);
    setLanesBackward(0);
    setLaneMarkings(true);
    setShowLaneDirection(false);
  };

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    maxValue: number = 5,
  ) => (
    <div>
      <Slider
        label={<p className="text-small font-medium mb-2">{label}</p>}
        aria-label={label}
        size="sm"
        step={1}
        maxValue={maxValue}
        minValue={0}
        value={value}
        onChange={(val) => onChange(val as number)}
        className="max-w-md"
        showSteps={true}
        marks={[
          { value: 0, label: "0" },
          { value: maxValue / 5, label: `${maxValue / 5}` },
          { value: (maxValue * 2) / 5, label: `${(maxValue * 2) / 5}` },
          { value: (maxValue * 3) / 5, label: `${(maxValue * 3) / 5}` },
          { value: (maxValue * 4) / 5, label: `${(maxValue * 4) / 5}` },
          { value: maxValue, label: `${maxValue}` },
        ]}
      />
    </div>
  );

  const handleLaneChange = (forward: number, backward: number) => {
    setLanesForward(forward);
    setLanesBackward(backward);
    setLanes((forward + backward).toString());
  };

  return (
    <div className="w-full">
      <TagButtonHeading
        header="lanes"
        tooltip={
          lanesDisabled
            ? "Lane tags are not applicable for unpaved surfaces. Existing tags can be removed."
            : "The number of lanes on the road as indicated by painted stripes."
        }
        warning={lanesDisabled}
      />

      <div className="flex gap-2">
        <Button
          variant="bordered"
          className={`flex-1 border-1 transition-all duration-200 ${
            !laneMarkings
              ? "bg-primary-100 shadow-lg border-primary"
              : "hover:bg-primary/10"
          }`}
          onPress={() => setLaneMarkings(!laneMarkings)}
          isDisabled={lanesDisabled}
        >
          none
        </Button>

        <ButtonGroup
          variant="bordered"
          className="flex flex-wrap w-full"
          size="md"
        >
          {COMMON_LANES.map((lanesKey) =>
            toggleButton(
              lanesKey === lanes,
              lanesKey,
              lanesDisabled ? undefined : () => setLanes(lanesKey),
              false,
              undefined,
              lanesDisabled,
            ),
          )}

          {toggleButton(
            Boolean(
              (lanes && !COMMON_LANES.includes(lanes)) ||
              lanesBackward ||
              lanesForward,
            ),
            undefined,
            lanesDisabled
              ? undefined
              : () => setShowLaneDirection(!showLaneDirection),
            true,
            <Chip>{lanes}</Chip>,
            lanesDisabled,
          )}
        </ButtonGroup>
      </div>

      {showLaneDirection && !lanesDisabled && (
        <div className="space-y-4 mt-2">
          {renderSlider(
            "Lanes",
            Number(lanes),
            (value) => setLanes(value.toString()),
            10,
          )}

          {renderSlider("Lanes Forward", lanesForward, (value) =>
            handleLaneChange(value, lanesBackward),
          )}

          {renderSlider("Lanes Backward", lanesBackward, (value) =>
            handleLaneChange(lanesForward, value),
          )}
        </div>
      )}

      {showRemoveButton && (
        <div className="mt-2">
          <Button
            color="warning"
            variant="flat"
            size="sm"
            className="w-full"
            onPress={handleRemoveLaneData}
          >
            Remove lane data
          </Button>
        </div>
      )}
    </div>
  );
};

export default LanesButtons;
