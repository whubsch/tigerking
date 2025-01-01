import React from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
} from "@nextui-org/dropdown";
import TagButtonHeading from "./TagButtonHeading";
import { useWayTagsStore } from "../stores/useWayTagsStore";

const SurfaceButtons: React.FC = () => {
  const commonSurfaces = ["concrete", "asphalt", "compacted"];
  const { surface, setSurface } = useWayTagsStore();
  return (
    <div className="w-full">
      <TagButtonHeading
        header="surface"
        tooltip="The surface of the roadway."
      />
      <ButtonGroup
        variant="bordered"
        className="flex flex-wrap w-full"
        size="md"
      >
        {commonSurfaces.map((surfaceKeys) => (
          <Button
            key={surfaceKeys}
            className="flex-1 border-1"
            onPress={() => setSurface(surfaceKeys)}
            variant={surfaceKeys === surface ? "solid" : "bordered"}
          >
            {surfaceKeys}
          </Button>
        ))}

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={
                !commonSurfaces.includes(surface) && surface
                  ? "solid"
                  : "bordered"
              }
              className="flex-1 border-1"
              onPress={() => setSurface("none")}
            >
              {!commonSurfaces.includes(surface) && surface ? surface : "Other"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            selectedKeys={surface}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(keys) =>
              setSurface(Array.from(keys)[0] as string)
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
