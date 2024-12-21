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
  return (
    <div className="w-full">
      <TagButtonHeading
        header="lanes"
        tooltip="The number of lanes on the road as indicated by painted strips."
      />
      <ButtonGroup variant="bordered" className="w-full" size="lg">
        <Button
          className="flex-1 border-1"
          onPress={() => setLanesKeys("none")}
          variant={lanesKeys === "none" ? "solid" : "bordered"}
        >
          None
        </Button>
        <Button
          className="flex-1 border-1"
          onPress={() => setLanesKeys("2")}
          variant={lanesKeys === "2" ? "solid" : "bordered"}
        >
          2
        </Button>
        <Button
          className="flex-1 border-1"
          onPress={() => setLanesKeys("4")}
          variant={lanesKeys === "4" ? "solid" : "bordered"}
        >
          4
        </Button>
        <Button
          className="flex-1 border-1"
          onPress={() => setLanesKeys("other")}
          variant={lanesKeys === "other" ? "solid" : "bordered"}
        >
          Other
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LanesButtons;
