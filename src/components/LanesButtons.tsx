import React from "react";
import { ButtonGroup } from "@nextui-org/button";
import { Slider } from "@nextui-org/slider";
import TagButtonHeading from "./TagButtonHeading";
import toggleButton from "./ToggleButton";
import { useWayTagsStore } from "../stores/useWayTagsStore";

interface LanesButtonsProps {
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
}

const LanesButtons: React.FC<LanesButtonsProps> = ({
  showLaneDirection,
  setShowLaneDirection,
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
  } = useWayTagsStore();

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
          { value: maxValue / 2, label: `${maxValue / 2}` },
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
        tooltip="The number of lanes on the road as indicated by painted stripes."
      />

      <div className="flex gap-2">
        {toggleButton("none", !laneMarkings, () =>
          setLaneMarkings(!laneMarkings),
        )}

        <ButtonGroup
          variant="bordered"
          className="flex flex-wrap w-full"
          size="md"
        >
          {COMMON_LANES.map((lanesKey) =>
            toggleButton(lanesKey, lanesKey === lanes, () =>
              setLanes(lanesKey),
            ),
          )}

          {toggleButton(
            "other",
            Boolean(
              (lanes && !COMMON_LANES.includes(lanes)) ||
                lanesBackward ||
                lanesForward,
            ),
            () => setShowLaneDirection(!showLaneDirection),
            true,
          )}
        </ButtonGroup>
      </div>

      {showLaneDirection && (
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
    </div>
  );
};

export default LanesButtons;
