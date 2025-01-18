import React from "react";
import BaseModal from "./BaseModal";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import ChangesetTagTable from "./ChangesetTags";
import { useChangesetStore } from "../stores/useChangesetStore";
import { Alert } from "@heroui/alert";

interface ChangesetModalProps {
  latestChangeset: number;
  onClose: () => void;
}

const ChangesetModal: React.FC<ChangesetModalProps> = ({
  latestChangeset,
  onClose,
}) => {
  const { source, description } = useChangesetStore();

  return (
    <BaseModal
      isOpen={latestChangeset !== 0}
      onClose={onClose}
      title={{
        label: "Changeset uploaded!",
        emoji: "🎉",
        colorClass: "text-green-600",
      }}
      subtitle="Your changes have been uploaded successfully"
      actions={[
        {
          label: "Close",
          color: "default",
          variant: "flat",
          onClick: onClose,
        },
      ]}
    >
      <div className="space-y-4">
        <Alert
          color="success"
          variant="faded"
          title={"Changeset " + latestChangeset.toString()}
          description={"Thanks for helping to tame the TIGER!"}
          endContent={
            <Button
              color="success"
              variant="flat"
              as={Link}
              href={`https://www.openstreetmap.org/changeset/${latestChangeset}`}
              target="_blank"
              // className="text-white"
              isExternal
              showAnchorIcon
            >
              View
            </Button>
          }
        />

        <ChangesetTagTable description={description} source={source} />
      </div>
    </BaseModal>
  );
};

export default ChangesetModal;
