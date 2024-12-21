import React from "react";
import { Chip, Link } from "@nextui-org/react";
import link from "../assets/link.svg";

interface CardHeadingProps {
  name: string;
  type: string;
  id: string | number;
}

const CardHeading: React.FC<CardHeadingProps> = ({ name, type, id }) => {
  return (
    <div className="flex gap-2 mb-4">
      <h3 className="text-xl font-bold">{name}</h3>
      <Link
        href={`https://www.openstreetmap.org/${type}/${id}`}
        target="_blank"
      >
        <Chip
          variant="flat"
          endContent={<img src={link} alt="link" className="w-3 h-3 mr-1" />}
        >
          {type.charAt(0)}
          {id}
        </Chip>
      </Link>
    </div>
  );
};

export default CardHeading;
