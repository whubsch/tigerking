import React from "react";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import info from "../assets/info.svg";

interface TagButtonHeadingProps {
  header: string;
  tooltip: string;
}

const TagButtonHeading: React.FC<TagButtonHeadingProps> = ({
  header,
  tooltip,
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <h2 className="text-lg font-bold">{header}</h2>
        <p>=</p>
      </div>
      <Tooltip content={tooltip}>
        <Link
          href={`https://wiki.openstreetmap.org/wiki/Key:${header}`}
          target="_blank"
        >
          <img
            src={info}
            alt="surface"
            className="h-4 w-4 brightness-0 dark:brightness-100 dark:invert"
          />
        </Link>
      </Tooltip>
    </div>
  );
};

export default TagButtonHeading;
