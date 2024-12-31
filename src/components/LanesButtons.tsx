import React from "react";
import { Button, ButtonGroup, Slider } from "@nextui-org/react";
import TagButtonHeading from "./TagButtonHeading";

interface LanesButtonsProps {
  lanesKeys: string;
  setLanesKeys: (keys: string) => void;
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
  lanesForward: number;
  setLanesForward: (value: number) => void;
  lanesBackward: number;
  setLanesBackward: (value: number) => void;
}

const LanesButtons: React.FC<LanesButtonsProps> = ({
  lanesKeys,
  setLanesKeys,
  showLaneDirection,
  setShowLaneDirection,
  lanesForward,
  setLanesForward,
  lanesBackward,
  setLanesBackward,
}) => {
  const commonLanesKeys = ["none", "2", "4"];

  return (
    <div className="w-full space-y-4">
      <TagButtonHeading
        header="lanes"
        tooltip="The number of lanes on the road as indicated by painted strips."
      />
      <ButtonGroup
        variant="bordered"
        className="flex flex-wrap w-full"
        size="md"
      >
        {commonLanesKeys.map((lanes) => {
          return (
            <Button
              key={lanes}
              className="flex-1 border-1"
              onPress={() => setLanesKeys(lanes)}
              variant={lanesKeys === lanes ? "solid" : "bordered"}
            >
              {lanes}
            </Button>
          );
        })}
        <Button
          className="flex-1 border-1"
          onPress={() => {
            setLanesKeys("other");
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
                setLanesKeys(((value as number) + lanesBackward).toString());
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
                setLanesKeys(((value as number) + lanesForward).toString());
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
