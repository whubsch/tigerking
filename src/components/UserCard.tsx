import React from "react";
import { Avatar } from "@heroui/avatar";

interface UserCardProps {
  name: string;
  imageUrl: string;
  changes: number;
}

const UserCard: React.FC<UserCardProps> = ({ name, imageUrl, changes }) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col">
        <h2 className="text-sm font-bold">{name}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{changes}</p>
      </div>
      <Avatar radius="sm" src={imageUrl} />
    </div>
  );
};

export default UserCard;
