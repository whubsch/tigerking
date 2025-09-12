import React, { useState } from "react";
import BaseModal from "./BaseModal";
import { Link } from "@heroui/link";
import { Card } from "@heroui/card";
import UploadButton from "../UploadButton";
import WayAccordion from "../WayAccordion";
import WayCountBadge from "../WayCountBadge";
import { OsmWay } from "../../objects";
import ChangesetTagTable from "../ChangesetTags";
import ConfirmationModal from "./ConfirmationModal";
import { useOsmAuthContext } from "../../contexts/useOsmAuth";
import { useChangesetStore } from "../../stores/useChangesetStore";

interface UploadModalProps {
  show: boolean;
  ways: number;
  onClose: () => void;
  uploads: OsmWay[];
  setUploadWays: (ways: OsmWay[]) => void;
  setChangeset: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  show,
  ways,
  onClose,
  uploads,
  setUploadWays,
  setChangeset,
  setError,
}) => {
  const { source, description } = useChangesetStore();
  const { osmUser } = useOsmAuthContext();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleDiscard = () => {
    setUploadWays([]);
    onClose();
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDiscard}
        confirmText="Discard"
      >
        <p>
          This action cannot be undone. Are you sure you want to discard your
          edits?
        </p>
      </ConfirmationModal>
      <BaseModal
        modalType="wide"
        isOpen={show && uploads.length > 0}
        onClose={onClose}
        title={{
          label: "Ready to Upload?",
          colorClass: "text-blue-600 dark:text-blue-400",
          emoji: "🚀",
        }}
        subtitle="Time to make your changes permanent!"
        actions={[
          {
            label: "Cancel",
            color: "default",
            variant: "flat",
            onClick: onClose,
          },
          {
            label: "Discard",
            color: "danger",
            variant: "flat",
            onClick: () => {
              setIsConfirmModalOpen(true);
            },
            className: "mt-2 hover:border-2 hover:border-danger",
          },
        ]}
        contentClassName="max-h-[80vh] overflow-y-auto md:max-w-[80vh]"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <WayCountBadge count={ways} verb="reviewed" />
            <p className="text-center text-medium font-medium">
              The changes you upload as
              <Link
                className="px-1 hover:underline"
                target="_blank"
                href={`https://www.openstreetmap.org/user/${osmUser}`}
              >
                {osmUser}
              </Link>
              will be visible on all maps that use OpenStreetMap data.
            </p>

            <ChangesetTagTable source={source} description={description} />

            <Card className="rounded-lg p-4 w-full mx-4">
              <h3 className="text-lg font-semibold">Ways</h3>
              {uploads.length === 0 ? (
                <p className="text-gray-500 text-center">No ways selected</p>
              ) : (
                <WayAccordion
                  ways={uploads}
                  onRemoveWay={(index) => {
                    const newUploads = [...uploads];
                    newUploads.splice(index, 1);
                    setUploadWays(newUploads);
                  }}
                  editable={true}
                />
              )}
            </Card>
          </div>

          <UploadButton
            uploads={uploads}
            setUploadWays={setUploadWays}
            setChangeset={setChangeset}
            setError={setError}
          />
        </div>
      </BaseModal>
    </>
  );
};

export default UploadModal;
