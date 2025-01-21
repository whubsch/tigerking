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
              endContent={
                <svg
                  className="h-5 w-5 stroke-success fill-none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M12 3c-7.412 0-9 1.588-9 9s1.588 9 9 9 9-1.588 9-9"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.5 3.5 15 9M16 3h4.672c.181 0 .328.147.328.328V8"
                  />
                </svg>
              }
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
