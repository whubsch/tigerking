import React from "react";
import { ButtonGroup } from "@heroui/button";
import TagButtonHeading from "./TagButtonHeading";
import toggleButton from "./ToggleButton";
import { useWayTagsStore } from "../stores/useWayTagsStore";

const SMOOTHNESS_OPTIONS = [
  "excellent",
  "good",
  "intermediate",
  "bad",
  "very_bad",
  "horrible",
  "very_horrible",
  "impassible",
];

const SmoothnessButtons: React.FC = () => {
  const { smoothness, setSmoothness } = useWayTagsStore();

  return (
    <div className="w-full">
      <TagButtonHeading
        header="smoothness"
        tooltip="How smooth the way is for wheeled vehicles."
      />
      <ButtonGroup
        variant="bordered"
        className="flex flex-wrap w-full"
        radius="sm"
        size="md"
      >
        {SMOOTHNESS_OPTIONS.map((smoothnessKey) =>
          toggleButton(smoothnessKey === smoothness, smoothnessKey, () =>
            setSmoothness(smoothnessKey),
          ),
        )}
      </ButtonGroup>
    </div>
  );
};

export default SmoothnessButtons;
