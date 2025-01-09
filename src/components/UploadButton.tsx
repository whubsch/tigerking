import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import upload from "../assets/upload.svg";
import { uploadChanges } from "../services/upload";
import { OsmWay } from "../objects";
import { useChangesetStore } from "../stores/useChangesetStore";

interface UploadButtonProps {
  uploads: OsmWay[];
  setUploadWays: (ways: OsmWay[]) => void;
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
      color="primary"
      className="hover:border-2 hover:border-primary"
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
      <Chip color="primary" variant="flat">
        {uploads ? uploads.length : 0}
      </Chip>
    </Button>
  );
};

export default UploadButton;
