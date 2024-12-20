import React from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
} from "@nextui-org/react";

interface SurfaceButtonsProps {
  surfaceKeys: string;
  setSurfaceKeys: (keys: string) => void;
}

const SurfaceButtons: React.FC<SurfaceButtonsProps> = ({
  surfaceKeys,
  setSurfaceKeys,
}) => {
  const commonSurfaces = ["concrete", "asphalt", "compacted"];
  return (
    <div className="w-full">
      <h2 className="text-lg">Surface</h2>
      <ButtonGroup variant="bordered" className="w-full">
        <Button
          className="flex-1"
          onPress={() => setSurfaceKeys("asphalt")}
          variant={surfaceKeys === "asphalt" ? "solid" : "bordered"}
        >
          asphalt
        </Button>
        <Button
          className="flex-1"
          onPress={() => setSurfaceKeys("compacted")}
          variant={surfaceKeys === "compacted" ? "solid" : "bordered"}
        >
          compacted
        </Button>
        <Button
          className="flex-1"
          onPress={() => setSurfaceKeys("concrete")}
          variant={surfaceKeys === "concrete" ? "solid" : "bordered"}
        >
          concrete
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={
                !commonSurfaces.includes(surfaceKeys) && surfaceKeys
                  ? "solid"
                  : "bordered"
              }
              className="flex-1"
              onPress={() => setSurfaceKeys("none")}
            >
              {!commonSurfaces.includes(surfaceKeys) && surfaceKeys
                ? surfaceKeys
                : "Other"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            selectedKeys={surfaceKeys}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(keys) =>
              setSurfaceKeys(Array.from(keys)[0] as string)
            }
          >
            <DropdownSection showDivider title="generic">
              <DropdownItem key="paved">paved</DropdownItem>
              <DropdownItem key="unpaved">unpaved</DropdownItem>
            </DropdownSection>
            <DropdownSection title="uncommon">
              <DropdownItem key="brick">brick</DropdownItem>
              <DropdownItem key="gravel">gravel</DropdownItem>
              <DropdownItem key="ground">ground</DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>
    </div>
  );
};

export default SurfaceButtons;
