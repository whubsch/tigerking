import React from "react";
import { Link } from "@nextui-org/react";

interface WayHeadingProps {
  name: string;
  type: string;
  wayId: string | number;
}

const WayHeading: React.FC<WayHeadingProps> = ({ name, type, wayId }) => {
  return (
    <div className="gap-2">
      <h1 className="text-xl font-bold my-2">{name}</h1>
      <h2 className="text-large text-gray-800 dark:text-gray-300">{type}</h2>
      <h3 className="text-normal">
        {
          <Link isExternal href={`https://www.openstreetmap.org/way/${wayId}`}>
            Way {wayId}
          </Link>
        }
      </h3>
    </div>
  );
};

export default WayHeading;
