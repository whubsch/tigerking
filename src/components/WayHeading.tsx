import React from "react";
import { Link } from "@nextui-org/react";

interface WayHeadingProps {
  name: string;
  type: string;
  wayId: string | number;
}

const WayHeading: React.FC<WayHeadingProps> = ({ name, type, wayId }) => {
  return (
    <div className="my-6 gap-2">
      <h1 className="text-xl font-bold my-2 mt-4">{name}</h1>
      <h2 className="text-large text-gray-800">{type}</h2>
      <h3 className="text-normal text-gray-500">
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
