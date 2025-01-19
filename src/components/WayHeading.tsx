import React from "react";
import CardHeading from "./CardHeading";
import TagSelection from "./TagSelection";
import { Tags } from "../objects";

interface WayHeadingProps {
  tags: Tags;
  wayId: string;
}

const WayHeading: React.FC<WayHeadingProps> = ({ tags, wayId }) => {
  return (
    <div className="gap-2 flex-none">
      <CardHeading name={tags.name ? tags.name : ""} id={wayId} type={"way"} />
      <TagSelection tags={tags} scroll={true} style="splitted" />
    </div>
  );
};

export default WayHeading;
