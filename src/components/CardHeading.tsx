import React from "react";
import { EditorLinks } from "./EditDropdown";
import { Button } from "@nextui-org/button";

interface CardHeadingProps {
  name: string;
  type: string;
  id: string;
  onReset?: () => void; // Add this prop
}

const CardHeading: React.FC<CardHeadingProps> = ({
  name,
  type,
  id,
  onReset,
}) => {
  return (
    <div className="flex gap-2 mb-4 justify-between items-center">
      <h3
        className={`text-xl font-bold truncate ${name ? "" : "text-danger-400"}`}
      >
        {name ? name : "no name"}
      </h3>
      <div className="flex gap-2">
        {onReset && (
          <Button size="sm" variant="light" color="danger" onPress={onReset}>
            Clear
          </Button>
        )}
        <EditorLinks elementType={type} elementId={id} />
      </div>
    </div>
  );
};

export default CardHeading;
