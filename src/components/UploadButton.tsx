import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import upload from "../assets/upload.svg";
import { uploadChanges } from "../services/upload";
import { OsmWay } from "../objects";
import { useChangesetStore } from "../stores/useChangesetStore";

interface UploadButtonProps {
  uploads: OsmWay[];
  setUploadWays: React.Dispatch<React.SetStateAction<OsmWay[]>>;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  uploads,
  setUploadWays,
  setChangeset,
  setError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { description, source, host } = useChangesetStore();

  const handleUpload = async (uploads: OsmWay[]) => {
    try {
      setIsLoading(true);
      const changeset = await uploadChanges(uploads, description, source, host);
      setChangeset(changeset);
      setUploadWays([]);
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Error uploading OSM data: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="flat"
      isDisabled={uploads.length === 0 || isLoading}
      isLoading={isLoading}
      startContent={
        !isLoading && (
          <img
            src={upload}
            alt="upload"
            className="w-6 h-6 brightness-0 dark:brightness-100 dark:invert"
          />
        )
      }
      onPress={() => handleUpload(uploads)}
    >
      Upload
      <Chip>{uploads ? uploads.length : 0}</Chip>
    </Button>
  );
};

export default UploadButton;
