import React from "react";
import { Button, ButtonGroup, Slider } from "@nextui-org/react";
import TagButtonHeading from "./TagButtonHeading";
import { useWayTagsStore } from "../stores/useWayTagsStore";

interface LanesButtonsProps {
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
}

const LanesButtons: React.FC<LanesButtonsProps> = ({
  showLaneDirection,
  setShowLaneDirection,
}) => {
  const commonLanes = ["none", "2", "4"];
  const {
    lanes,
    setLanes,
    lanesForward,
    setLanesForward,
    lanesBackward,
    setLanesBackward,
  } = useWayTagsStore();

  return (
    <div className="w-full">
      <TagButtonHeading
        header="lanes"
        tooltip="The number of lanes on the road as indicated by painted strips."
      />
      <ButtonGroup
        variant="bordered"
        className="flex flex-wrap w-full"
        size="md"
      >
        {commonLanes.map((lanesKey) => {
          return (
            <Button
              key={lanesKey}
              className="flex-1 border-1"
              onPress={() => setLanes(lanesKey)}
              variant={lanesKey === lanes ? "solid" : "bordered"}
            >
              {lanesKey}
            </Button>
          );
        })}
        <Button
          className="flex-1 border-1"
          onPress={() => {
            setLanes("other");
            setShowLaneDirection(true);
          }}
          variant={showLaneDirection ? "solid" : "bordered"}
        >
          Other
        </Button>
      </ButtonGroup>

      {showLaneDirection && (
        <div className="space-y-4">
          <div>
            <p className="text-small font-medium mb-2">Lanes Forward</p>
            <Slider
              size="sm"
              step={1}
              maxValue={5}
              minValue={0}
              value={lanesForward}
              onChange={(value) => {
                setLanesForward(value as number);
                setLanes(((value as number) + lanesBackward).toString());
              }}
              className="max-w-md"
              showSteps={true}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
              ]}
            />
          </div>

          <div>
            <p className="text-small font-medium mb-2">Lanes Backward</p>
            <Slider
              size="sm"
              step={1}
              maxValue={5}
              minValue={0}
              value={lanesBackward}
              onChange={(value) => {
                setLanesBackward(value as number);
                setLanes(((value as number) + lanesForward).toString());
              }}
              className="max-w-md"
              showSteps={true}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LanesButtons;
