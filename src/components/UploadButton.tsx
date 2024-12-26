import React from "react";
import { Button, Chip } from "@nextui-org/react";
import upload from "../assets/upload.svg";
import { uploadChanges } from "../services/upload";
import { OsmWay } from "../objects";

interface UploadButtonProps {
  uploads: OsmWay[];
  setUploadWays: React.Dispatch<React.SetStateAction<OsmWay[]>>;
  location: string;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  uploads,
  setUploadWays,
  location,
  setChangeset,
}) => {
  const handleUpload = async (uploads: OsmWay[]) => {
    const changeset = await uploadChanges(uploads, location);
    setChangeset(changeset);
    setUploadWays([]);
  };

  return (
    <Button
      variant="flat"
      isDisabled={uploads.length === 0}
      startContent={
        <img
          src={upload}
          alt="upload"
          className="w-6 h-6 brightness-0 dark:brightness-100 dark:invert"
        />
      }
      onPress={() => handleUpload(uploads)}
    >
      <Chip>{uploads ? uploads.length : 0}</Chip>
    </Button>
  );
};

export default UploadButton;
