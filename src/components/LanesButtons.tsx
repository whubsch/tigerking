import React from "react";
import { Button, ButtonGroup, Link } from "@nextui-org/react";
import info from "../assets/info.svg";

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
      <div className="flex justify-between">
        <h2 className="text-lg">Lanes</h2>
        <Link
          href="https://wiki.openstreetmap.org/wiki/Key:lanes"
          target="_blank"
        >
          <img src={info} alt="surface" className="w-6 h-6" />
        </Link>
      </div>
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
