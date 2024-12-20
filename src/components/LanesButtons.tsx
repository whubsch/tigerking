import React from "react";
import { Button, ButtonGroup } from "@nextui-org/react";

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
      <h2 className="text-lg">Lanes</h2>
      <ButtonGroup variant="bordered" className="w-full">
        <Button
          className="flex-1"
          onPress={() => setLanesKeys("none")}
          variant={lanesKeys === "none" ? "solid" : "bordered"}
        >
          None
        </Button>
        <Button
          className="flex-1"
          onPress={() => setLanesKeys("2")}
          variant={lanesKeys === "2" ? "solid" : "bordered"}
        >
          2
        </Button>
        <Button
          className="flex-1"
          onPress={() => setLanesKeys("4")}
          variant={lanesKeys === "4" ? "solid" : "bordered"}
        >
          4
        </Button>
        <Button
          className="flex-1"
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
