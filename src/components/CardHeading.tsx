import React from "react";
import { EditorLinks } from "./EditDropdown";

interface CardHeadingProps {
  name: string;
  type: string;
  id: string;
}

const CardHeading: React.FC<CardHeadingProps> = ({ name, type, id }) => {
  return (
    <div className="flex gap-2 mb-4 justify-between">
      <h3 className="text-xl font-bold">{name}</h3>
      <EditorLinks elementType={type} elementId={id} />
    </div>
  );
};

export default CardHeading;
