import React from "react";
import { Button, ButtonGroup } from "@nextui-org/react";
import TagButtonHeading from "./TagButtonHeading";

interface LanesButtonsProps {
  lanesKeys: string;
  setLanesKeys: (keys: string) => void;
}

const LanesButtons: React.FC<LanesButtonsProps> = ({
  lanesKeys,
  setLanesKeys,
}) => {
  const commonLanesKeys = ["none", "2", "4"];
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
          onPress={() => setLanesKeys("odd")}
          variant={lanesKeys === "odd" ? "solid" : "bordered"}
        >
          Odd
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LanesButtons;
