import React from "react";
import { Link } from "@heroui/link";
import { Tooltip } from "@heroui/tooltip";
import info from "../assets/info.svg";
import Icon from "./Icon";

interface TagButtonHeadingProps {
  header: string;
  tooltip: string | React.ReactNode;
  warning?: boolean;
}

const TagButtonHeading: React.FC<TagButtonHeadingProps> = ({
  header,
  tooltip,
  warning,
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <h2 className="text-lg font-bold">{header}</h2>
        <p>=</p>
      </div>
      <Tooltip content={tooltip} className="max-w-64">
        <Link
          href={`https://wiki.openstreetmap.org/wiki/Key:${header}`}
          target="_blank"
          color={warning ? "warning" : "primary"}
        >
          <Icon
            src={info}
            alt={header}
            className={warning ? "fill-warning" : ""}
          />
        </Link>
      </Tooltip>
    </div>
  );
};

export default TagButtonHeading;
