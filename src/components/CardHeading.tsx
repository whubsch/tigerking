import React from "react";
import { EditorLinks } from "./EditDropdown";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

interface CardHeadingProps {
  name: string;
  type: string;
  id: string;
  sendHome?: boolean;
}

const CardHeading: React.FC<CardHeadingProps> = ({
  name,
  type,
  id,
  sendHome,
}) => {
  return (
    <div className="flex gap-2 mb-4 justify-between items-center">
      <h3
        className={`text-xl font-bold truncate ${name ? "" : "text-danger-400"}`}
      >
        {name ? name : "no name"}
      </h3>
      <div className="flex gap-2">
        {sendHome && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            href="/tigerking/"
            as={Link}
          >
            Clear
          </Button>
        )}
        <EditorLinks elementType={type} elementId={id} />
      </div>
    </div>
  );
};

export default CardHeading;
