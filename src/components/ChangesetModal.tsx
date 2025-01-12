import React from "react";
import BaseModal from "./BaseModal";
import { Link } from "@nextui-org/link";
import ChangesetTagTable from "./ChangesetTags";
import { useChangesetStore } from "../stores/useChangesetStore";

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
      subtitle="Your changeset has been uploaded successfully"
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
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-center text-lg font-medium text-green-800">
            Thank you for helping to tame the TIGER!
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-600">Changeset ID:</p>
          <Link
            href={`https://www.openstreetmap.org/changeset/${latestChangeset}`}
            target="_blank"
            className="text-lg font-semibold hover:text-blue-600 transition-colors"
            isExternal
            showAnchorIcon
          >
            {latestChangeset}
          </Link>
        </div>

        <ChangesetTagTable description={description} source={source} />
      </div>
    </BaseModal>
  );
};

export default ChangesetModal;
