import React from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Slider } from "@nextui-org/slider";
import { Code } from "@nextui-org/code";
import TagButtonHeading from "./TagButtonHeading";
import { useWayTagsStore } from "../stores/useWayTagsStore";
import kebab from "../assets/kebab.svg";

interface LanesButtonsProps {
  showLaneDirection: boolean;
  setShowLaneDirection: (value: boolean) => void;
}

const LanesButtons: React.FC<LanesButtonsProps> = ({
  showLaneDirection,
  setShowLaneDirection,
}) => {
  const commonLanes = ["2", "4"];
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

  return (
    <div className="w-full">
      <TagButtonHeading
        header="lanes"
        tooltip={
          <p>
            The number of lanes on the road as indicated by painted stripes.{" "}
            <Code className="py-1" size="sm">
              lanes=none
            </Code>{" "}
            will be converted to{" "}
            <Code className="py-1" size="sm">
              lane_markings=no
            </Code>
            .
          </p>
        }
      />
      <ButtonGroup
        variant="bordered"
        className="flex flex-wrap w-full"
        size="md"
      >
        <Button
          className={`flex-1 border-1 transition-all duration-200 ${
            !laneMarkings
              ? "bg-primary-100 shadow-lg border-primary"
              : "hover:bg-primary/10"
          }`}
          onPress={() => {
            setLaneMarkings(false);
          }}
        >
          none
        </Button>
        {commonLanes.map((lanesKey) => {
          return (
            <Button
              key={lanesKey}
              className={`flex-1 border-1 transition-all duration-200 ${
                lanesKey === lanes
                  ? "bg-primary-100 shadow-lg border-primary"
                  : "hover:bg-primary/10"
              }`}
              onPress={() => setLanes(lanesKey)}
            >
              {lanesKey}
            </Button>
          );
        })}
        <Button
          className={`flex-1 border-1 transition-all duration-200 ${
            (lanes && !commonLanes.includes(lanes)) ||
            lanesBackward ||
            lanesForward
              ? "bg-primary-100 shadow-lg border-primary"
              : "hover:bg-primary/10"
          }`}
          onPress={() => {
            setShowLaneDirection(showLaneDirection ? false : true);
          }}
          key="other"
          isIconOnly
        >
          <img
            src={kebab}
            alt="kebab"
            className="h-6 w-6 brightness-0 dark:brightness-100 dark:invert"
          />
        </Button>
      </ButtonGroup>

      {showLaneDirection && (
        <div className="space-y-4 mt-2">
          <div>
            <Slider
              label={<p className="text-small font-medium">Lanes</p>}
              aria-label="Lanes"
              size="sm"
              step={1}
              maxValue={10}
              minValue={0}
              value={Number(lanes)}
              onChange={(value) => {
                setLanes(value.toString());
              }}
              className="max-w-md"
              showSteps={true}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
              ]}
            />
          </div>
          <div>
            <Slider
              label={
                <p className="text-small font-medium mb-2">Lanes Forward</p>
              }
              aria-label="Lanes Forward"
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
            <Slider
              label={
                <p className="text-small font-medium mb-2">Lanes Backward</p>
              }
              aria-label="Lanes Backward"
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
