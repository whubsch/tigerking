import React from "react";
import CardHeading from "./CardHeading";
import TagSelection from "./TagSelection";
import { Tags } from "../objects";

interface WayHeadingProps {
  tags: Tags;
  wayId: string | number;
}

const WayHeading: React.FC<WayHeadingProps> = ({ tags, wayId }) => {
  return (
    <div className="gap-2">
      <CardHeading name={tags.name ? tags.name : ""} id={wayId} type={"way"} />
      <TagSelection tags={tags} />
    </div>
  );
};

export default WayHeading;
