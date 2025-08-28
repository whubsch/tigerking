import React from "react";
import { ButtonGroup } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
} from "@heroui/dropdown";
import TagButtonHeading from "./TagButtonHeading";
import toggleButton from "./ToggleButton";
import { useWayTagsStore } from "../stores/useWayTagsStore";

const SurfaceButtons: React.FC = () => {
  const COMMON_SURFACES = ["concrete", "asphalt", "compacted"];
  const { surface, setSurface } = useWayTagsStore();

  const renderDropdownButton = () => {
    const isCustomSurface = Boolean(
      surface && !COMMON_SURFACES.includes(surface),
    );

    return (
      <Dropdown>
        <DropdownTrigger>
          {toggleButton(
            isCustomSurface,
            isCustomSurface ? surface : "other",
            undefined,
            true,
          )}
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Surface selection"
          selectedKeys={surface ? new Set([surface]) : new Set()}
          selectionMode="single"
          variant="flat"
          onSelectionChange={(keys) =>
            setSurface(Array.from(keys)[0] as string)
          }
          className="max-h-[300px]"
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
    );
  };

  return (
    <div className="w-full">
      <TagButtonHeading
        header="surface"
        tooltip="The surface of the roadway."
      />
      <ButtonGroup
        variant="bordered"
        className="flex flex-wrap w-full"
        radius="sm"
        size="md"
      >
        {COMMON_SURFACES.map((surfaceKey) =>
          toggleButton(surfaceKey === surface, surfaceKey, () =>
            setSurface(surfaceKey),
          ),
        )}
        {renderDropdownButton()}
      </ButtonGroup>
    </div>
  );
};

export default SurfaceButtons;
